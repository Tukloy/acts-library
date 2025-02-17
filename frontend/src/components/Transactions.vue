<script setup>
import axios from "axios";
import { ref, reactive, onMounted, computed, watch } from "vue";

const state = reactive({
    transactions: [],
    isLoading: false,
    searchQuery: '',
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    sortBy: 'created_at',
    order: 'DESC'
});

const openTransaction = ref(null);

const totalPages = computed(() => Math.ceil(state.totalRecords / state.pageSize));

const getTransactions = async () => {
    try {
        state.isLoading = true;
        const offset = (state.currentPage - 1) * state.pageSize;
        const sortBy = state.sortBy || 'created_at';
        const order = state.order || 'DESC';

        const response = await axios.get("/api/transactions", {
            params: {
                limit: state.pageSize,
                offset: offset,
                search: state.searchQuery,
                sort_by: sortBy,
                order: order
            }
        });
        state.transactions = response.data.records;
        state.totalRecords = response.data.total;
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        state.isLoading = false;
    }
};

const nextPage = () => {
    if (state.currentPage < totalPages.value) {
        state.currentPage++;
        getTransactions();
    }
};

const prevPage = () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        getTransactions();
    }
};

const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== "...") {
        state.currentPage = page;
        getTransactions();
    }
};

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = state.currentPage;
    const maxVisible = 5;
    const pages = [];

    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end === total) {
        start = total - maxVisible + 1;
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    if (end < total - 1) pages.push("...");
    if (end < total) pages.push(total);

    return pages;
});

watch(() => state.searchQuery, () => {
    state.currentPage = 1;
    getTransactions();
});

const toggle = (transactionId) => {
    openTransaction.value = openTransaction.value === transactionId ? null : transactionId;
};

onMounted(() => {
    getTransactions();
});
</script>

<template>
    <div class="p-5 container mx-auto w-full h-full">
        <p class="text-2xl mb-4">Transactions</p>
        <div>
            <div class="flex items-center justify-between mb-2  text-sm">
                <div class="flex items-center">
                    <p class="mr-1">Search:</p>
                    <input v-model="state.searchQuery"
                        class="border border-1 border-gray-200 bg-white rounded-md pr-4 pl-2 py-1 outline-none focus:border-green-500 mr-4"
                        type="text" placeholder="Search here...">
                </div>
                <div class="flex items-center gap-x-2">
                    <label
                        class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        UPLOAD
                        <input type="file" accept=".xlsx" @change="uploadExcel" class="hidden">
                    </label>
                    <button @click="downloadExcel"
                        class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        DOWNLOAD</button>
                    <RouterLink to="/books/create"
                        class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        ADD</RouterLink>
                </div>
            </div>
            <div class="border-1 border-gray-200 bg-white p-5 text-sm relative">
                <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
                    <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
                </div>
                <div v-for="(transaction, index) in state.transactions" :key="transaction.transaction_id"
                    class="border-1 border-gray-200 relative">
                    <i class="absolute top-3 right-3 h-3 w-3 rounded-full"
                        :class="{ ' bg-green-400': transaction.status === 'returned', 'bg-yellow-400': transaction.status === 'borrowed', ' bg-red-400': transaction.status === 'overdued' }"></i>
                    <div @click="toggle(transaction.transaction_id)"
                        :class="['flex justify-between w-full cursor-pointer p-2 hover:bg-gray-100', index % 2 === 0 ? 'bg-white' : 'bg-gray-50']">
                        <p><span class="font-medium mr-2">Transaction ID:</span> {{
                            transaction.transaction_id.toUpperCase() }}</p>
                        <p class="mr-8 font-medium">Status</p>
                    </div>
                    <div v-if="openTransaction === transaction.transaction_id" class="pl-4 pt-2 pb-4 bg-gray-100">
                        <p><strong>Account ID:</strong> {{ transaction.account_id.toUpperCase() }}</p>
                        <p><strong>Item ID:</strong> {{ transaction.item_id.toUpperCase() }}</p>
                        <p><strong>Status:</strong> {{ transaction.status.toUpperCase() }}</p>
                        <p><strong>Borrow Date:</strong> {{ transaction.borrow_date }}</p>
                        <p><strong>Due Date:</strong> {{ transaction.due_date }}</p>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between border-t border-gray-200 py-3">
                <p class="text-sm text-gray-700">
                    Showing
                    <span class="font-medium">{{ (state.currentPage - 1) * state.pageSize + 1 }}</span>
                    to
                    <span class="font-medium">{{ Math.min(state.currentPage * state.pageSize, state.totalRecords)
                        }}</span>
                    of
                    <span class="font-medium">{{ state.totalRecords }}</span>
                    results
                </p>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                    <button @click="prevPage" :disabled="state.currentPage === 1"
                        class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer">
                        <span class="sr-only">Previous</span>
                        <i class="pi pi-angle-left"></i>
                    </button>
                    <template v-for="page in visiblePages" :key="page">
                        <button @click="setPage(page)" :class="[
                            'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 cursor-pointer',
                            state.currentPage === page ? 'bg-green-600 text-white' : 'text-gray-900 hover:bg-gray-50'
                        ]">
                            {{ page }}
                        </button>
                    </template>
                    <button @click="nextPage" :disabled="state.currentPage === totalPages"
                        class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer">
                        <span class="sr-only">Next</span>
                        <i class="pi pi-angle-right"></i>
                    </button>
                </nav>
            </div>
        </div>
    </div>
</template>
