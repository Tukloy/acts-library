<script setup>
import axios from 'axios';
import { reactive, onMounted, computed, watch } from 'vue';

const state = reactive({
    academic_papers: [],
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    searchQuery: ''
});

const totalPages = computed(() => Math.ceil(state.totalRecords / state.pageSize));

const getAcademicPapers = async () => {
    try {
        state.isLoading = true;
        const offset = (state.currentPage - 1) * state.pageSize;
        const response = await axios.get(`/api/academic-papers`, {
            params: {
                limit: state.pageSize,
                offset: offset,
                search: state.searchQuery
            }
        });

        state.academic_papers = response.data.records;
        state.totalRecords = response.data.total;
    } catch (error) {
        console.error(error);
    } finally {
        state.isLoading = false;
    }
};

const nextPage = () => {
    if (state.currentPage < totalPages.value) {
        state.currentPage++;
        getAcademicPapers();
    }
};

const prevPage = () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        getAcademicPapers();
    }
};

const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        state.currentPage = page;
        getAcademicPapers();
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
    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < total - 1) pages.push('...');
    if (end < total) pages.push(total);

    return pages;
});

watch(() => state.searchQuery, () => {
    state.currentPage = 1;
    getAcademicPapers();
});

onMounted(() => {
    getAcademicPapers();
});
</script>

<template>
    <div class="relative h-full w-full">
        <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <div class="p-5 container mx-auto w-full h-full">
            <p class="text-2xl mb-2">Academic Papers</p>
            <div class="">
                <div class="flex justify-end mb-2 items-center text-sm">
                    <p class="mr-2">Search:</p>
                    <input v-model="state.searchQuery"
                        class="border border-1 border-gray-200 bg-white rounded-md pr-4 pl-2 py-1 outline-none focus:border-green-500"
                        type="text">
                </div>
                <table class="table-auto border border-1 border-gray-200 bg-white w-full">
                    <thead>
                        <tr class="border border-b border-1 border-gray-200 text-gray-600 text-sm">
                            <th class="px-4 py-2">Id</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Author Name</th>
                            <th class="px-4 py-2">Title Name</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Course</th>
                            <th class="px-4 py-2">Year</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Type</th>
                            <th class="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="paper in state.academic_papers" :key="paper.id"
                            class="text-xs text-gray-600 border border-b border-1 border-gray-200 hover:bg-gray-100 cursor-pointer">
                            <td class="px-4 py-2">{{ paper.acadp_id.toUpperCase() }}</td>
                            <td class="px-4 py-2 border border-x border-1 border-gray-200">{{
                                paper.author_name.toUpperCase() }}</td>
                            <td class="px-4 py-2">{{ paper.title_name.toUpperCase() }}</td>
                            <td class="px-4 py-2 border border-x border-1 border-gray-200 text-center">{{
                                paper.course.toUpperCase() }}</td>
                            <td class="px-4 py-2 text-center">{{ paper.academic_year.toUpperCase() }}</td>
                            <td class="px-4 py-2 border border-x border-1 border-gray-200">{{ paper.type.toUpperCase()
                                }}</td>
                            <td class="px-4 py-2 text-center">
                                <span class="text-[10px] bg-green-400 text-gray-50 px-3 py-1 rounded-full">
                                    {{ paper.status.toUpperCase() }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination Controls -->
                <div class="flex items-center justify-between border-t border-gray-200 py-3">
                    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{{ (state.currentPage - 1) * state.pageSize + 1 }}</span>
                            to
                            <span class="font-medium">{{ Math.min(state.currentPage * state.pageSize,
                                state.totalRecords) }}</span>
                            of
                            <span class="font-medium">{{ state.totalRecords }}</span>
                            results
                        </p>
                        <div class="bg-white">
                            <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                                <!-- Previous Button -->
                                <button @click="prevPage" :disabled="state.currentPage === 1"
                                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer">
                                    <span class="sr-only">Previous</span>
                                    <i class="pi pi-angle-left"></i>
                                </button>

                                <!-- Dynamic Pagination -->
                                <template v-for="page in visiblePages" :key="page">
                                    <button @click="setPage(page)" :class="[
                                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 cursor-pointer',
                                        state.currentPage === page ? 'bg-green-600 text-white' : 'text-gray-900 hover:bg-gray-50'
                                    ]">
                                        {{ page }}
                                    </button>
                                </template>

                                <!-- Next Button -->
                                <button @click="nextPage" :disabled="state.currentPage === totalPages"
                                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 cursor-pointer">
                                    <span class="sr-only">Next</span>
                                    <i class="pi pi-angle-right"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
