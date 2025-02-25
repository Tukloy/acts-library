<script setup>
import axios from "axios";
import TransactionEdit from "@/layout/TransactionEdit.vue";
import ConfirmModal from "@/reusable/ConfirmModal.vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router"
import { ref, reactive, onMounted, computed, watch } from "vue";
import moment from 'moment';
import * as XLSX from 'xlsx';

const toggleEdit = ref(false)
const toggleDelete = ref(false)
const toast = useToast();

const state = reactive({
    transactions: [],
    selectedTransaction: null,
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

const deleteTransaction = async () => {
    if (!state.selectedTransaction) {
        toast.error('No transaction selected for deletion');
        return;
    }

    try {
        state.isLoading = true
        await axios.delete(`/api/transactions/${state.selectedTransaction.id}`);
        toast.success('Transaction deleted successfully');

        state.selectedTransaction = null;
        toggleDelete.value = false;

        getTransactions();
    } catch (error) {
        toast.error('Failed to delete Transaction');
        console.error(error);
    } finally {
        state.isLoading = false;
    }
}

const selectTransaction = (transaction) => {
    state.selectedTransaction = transaction;
    toggleEdit.value = true;
}

const downloadExcel = () => {
    if (state.transactions.length === 0) {
        toast.error("No data available to export.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(state.transactions.map(transaction => ({
        "Transaction ID": transaction.transaction_id.toUpperCase(),
        "Account ID": transaction.account_id.toUpperCase(),
        "Item ID": transaction.item_id.toUpperCase(),
        "Borrow Date": transaction.borrow_date,
        "Due Date": transaction.due_date,
        "Return Date": transaction.return_date,
        "Status": transaction.status.toUpperCase()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, "Transactions.xlsx");
    toast.success('Excel file downloaded successfully');
};

const uploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        toast.error('No file selected');
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const formatExcelDate = (excelDate) => {
                if (typeof excelDate === 'number') {
                    // Excel's base date is January 1, 1900
                    const excelEpoch = new Date(1899, 11, 30); // Excel starts from Dec 30, 1899
                    const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);

                    // Format date as YYYY-MM-DD HH:mm:ss
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');

                    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
                return excelDate; // If already a string, return as is
            };
            // Proper formatting matching backend expectations
            const formattedData = jsonData.map(row => ({
                transaction_id: row["Transaction ID"] || '',
                account_id: row["Account ID"] || '',
                item_id: row["Item ID"] || '',
                borrow_date: formatExcelDate(row["Borrow Date"]),
                due_date: formatExcelDate(row["Due Date"]),
                return_date: formatExcelDate(row["Return Date"]),
                status: row["Status"] || ''
            }));

            // Send data to API for database insertion
            await axios.post('/api/transactions/upload', { transactions: formattedData });

            toast.success('File uploaded successfully!');
            getTransactions(); // Refresh data list
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload Excel file');
        }
    };

    reader.readAsArrayBuffer(file);
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

const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
    getTransactions();
});
</script>

<template>
    <TransactionEdit :toggleEdit="toggleEdit" @emit-close-edit="toggleEdit = false"
        :selectedTransaction="state.selectedTransaction" @emit-transaction-updated="getTransactions()" />
    <ConfirmModal :toggleDelete="toggleDelete" @emit-close-delete="toggleDelete = false"
        @emit-confirm-delete="deleteTransaction()" questionText="Are you sure?" confirmText="Delete" />
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
                    <RouterLink to="/transactions/create"
                        class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        ADD</RouterLink>
                </div>
            </div>
            <div class="border-1 border-gray-200 bg-white p-5 text-sm relative">
                <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
                    <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
                </div>
                <div v-for="(transaction, index) in state.transactions" :key="transaction.transaction_id"
                    class="border-1 border-gray-200">
                    <div @click="toggle(transaction.transaction_id)"
                        :class="['flex justify-between w-full cursor-pointer p-2 hover:bg-gray-100', openTransaction === transaction.transaction_id ? 'bg-green-100' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50']">
                        <div class="flex items-center">
                            <p class="pr-2 border-r mr-2 border-gray-200 text-xs"> {{ index + 1 }}</p>
                            <p><span class="font-medium mr-2">Transaction ID:</span> {{
                                transaction.transaction_id.toUpperCase() }}</p>
                        </div>
                        <div class="flex items-center gap-x-4">
                            <p class="font-medium">Status</p>
                            <i class="right-3 h-3 w-3 rounded-full" :class="{
                                'bg-green-400': transaction.status.split(' ')[0] === 'returned',
                                'bg-yellow-400': transaction.status.split(' ')[0] === 'pending',
                                'bg-red-400': transaction.status.split(' ')[0] === 'overdue'
                            }"></i>
                        </div>
                    </div>
                    <transition name="slide">
                        <div v-if="openTransaction === transaction.transaction_id"
                            class="px-4 pt-2 pb-4 bg-gray-100 flex gap-4">
                            <div class="flex flex-col flex-1 text-xs">
                                <p><span>Account ID:</span> {{ transaction.account_id.toUpperCase() }}</p>
                                <p><span>Item ID:</span> {{ transaction.item_id.toUpperCase() }}</p>
                                <p><span>Borrow Date:</span> {{ formatDate(transaction.borrow_date) }}</p>
                                <p class="text-xs mb-3"><span>Due Date:</span> {{ transaction.due_date }}</p>
                                <p>Status: <span :class="{
                                    'text-green-800': transaction.status.split(' ')[0] === 'returned',
                                    'text-yellow-800': transaction.status.split(' ')[0] === 'pending',
                                    'text-red-800': transaction.status.split(' ')[0] === 'overdue'
                                }">{{ transaction.status.toUpperCase() }}</span></p>
                            </div>
                            <div class="flex items-center gap-x-2">
                                <button type="button" @click="selectTransaction(transaction)"
                                    class="pi pi-pencil bg-blue-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-blue-500 transition ease duration-200 cursor-pointer"></button>
                                <button type="button"
                                    @click="state.selectedTransaction = transaction; toggleDelete = true"
                                    class="pi pi-trash bg-red-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-red-500 transition ease duration-200 cursor-pointer"></button>
                            </div>
                        </div>
                    </transition>
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
<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
}
</style>