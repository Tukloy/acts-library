<script setup>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';
import AcademicPaperEdit from '@/layout/AcademicPaperEdit.vue';
import ConfirmModal from '@/reusable/ConfirmModal.vue';
import * as XLSX from 'xlsx';

const toast = useToast();

const toggleEdit = ref(false)
const toggleDelete = ref(false)

const state = reactive({
    academic_papers: [],
    selectedPaper: null,
    isLoading: false,
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    sortBy: 'created_at',
    order: 'DESC',
    searchQuery: ''
});

const totalPages = computed(() => Math.ceil(state.totalRecords / state.pageSize));

const getAcademicPapers = async () => {
    try {
        state.isLoading = true;
        const offset = (state.currentPage - 1) * state.pageSize;
        const sortBy = state.sortBy || 'created_at';
        const order = state.order || 'DESC';

        const response = await axios.get(`/api/academic-papers`, {
            params: {
                limit: state.pageSize,
                offset: offset,
                search: state.searchQuery,
                sort_by: sortBy,
                order: order
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

const selectPaper = (paper) => {
    state.selectedPaper = paper;
    toggleEdit.value = true;
    console.log(paper)
}

const deletePaper = async () => {
    if (!state.selectedPaper) {
        toast.error('No paper selected for deletion');
        return;
    }

    try {
        await axios.delete(`/api/academic-papers/${state.selectedPaper.id}`);
        toast.success('Academic Paper deleted successfully');

        state.selectedPaper = null;
        toggleDelete.value = false;

        getAcademicPapers();
    } catch (error) {
        toast.error('Failed to delete Academic Paper');
        console.error(error);
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

const downloadExcel = async () => {
    try {
        const response = await axios.get('/api/academic-papers', {
            params: {
                limit: state.totalRecords, // Fetch all records
                sort_by: state.sortBy,
                order: state.order
            }
        });

        const papers = response.data.records;

        // Convert Data to Excel Format
        const worksheet = XLSX.utils.json_to_sheet(papers.map(paper => ({
            "ID": paper.acadp_id,
            "Author Name": paper.author_name,
            "Title Name": paper.title_name,
            "Course": paper.course,
            "Year": paper.academic_year,
            "Type": paper.type,
            "Status": paper.status
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Academic Papers");

        // Create Excel File and Trigger Download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "academic_papers.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Excel file downloaded successfully!');
    } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download Excel file');
    }
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

            // Ensure proper formatting (matching API expectations)
            const formattedData = jsonData.map(row => ({
                acadp_id: row["ID"] || '',
                author_name: row["Author Name"] || '',
                title_name: row["Title Name"] || '',
                course: row["Course"] || '',
                academic_year: row["Year"] || '',
                type: row["Type"] || '',
                status: row["Status"] || ''
            }));

            // Send data to API for database insertion
            await axios.post('/api/academic-papers/upload', { papers: formattedData });

            toast.success('File uploaded successfully!');
            getAcademicPapers(); // Refresh data list
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload Excel file');
        }
    };

    reader.readAsArrayBuffer(file);
};


watch(() => state.searchQuery, () => {
    state.currentPage = 1;
    getAcademicPapers();
});

onMounted(() => {
    getAcademicPapers();
});
</script>

<template>
    <AcademicPaperEdit :toggleEdit="toggleEdit" @emit-close-edit="toggleEdit = false"
        :selectedPaper="state.selectedPaper" @emit-paper-updated="getAcademicPapers()" />
    <ConfirmModal :toggleDelete="toggleDelete" @emit-close-delete="toggleDelete = false"
        @emit-confirm-delete="deletePaper()" questionText="Are you sure?" confirmText="Delete" />
    <div class="h-full w-full">
        <div class="p-5 container mx-auto w-full h-full">
            <p class="text-2xl mb-4">Academic Papers</p>
            <div class="">
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
                        <button @click="downloadExcel" type="button"
                            class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                            DOWNLOAD</button>
                        <RouterLink to="/academic-papers/create"
                            class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                            ADD</RouterLink>
                    </div>
                </div>
                <table class="table-auto border border-1 border-gray-200 bg-white w-full relative">
                    <div v-if="state.isLoading"
                        class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
                        <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
                    </div>
                    <thead>
                        <tr class="border border-b border-1 border-gray-200 text-gray-600 text-sm">
                            <th class="px-4 py-2">Id</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Author Name</th>
                            <th class="px-4 py-2">Title Name</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Course</th>
                            <th class="px-4 py-2">Year</th>
                            <th class="px-4 py-2 border border-x border-1 border-gray-200">Type</th>
                            <th class="px-4 py-2 border border-r border-1 border-gray-200">Status</th>
                            <th class="px-4 py-2">Action</th>
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
                            <td class="px-4 py-2 border border-x border-1 border-gray-200 text-center">
                                <span class="text-[10px] p-1 rounded-sm inline-block min-w-[5rem] text-center" :class="{
                                    'text-cyan-100 bg-cyan-600': paper.type.toLowerCase() === 'thesis',
                                    'text-blue-100 bg-blue-500': paper.type.toLowerCase() === 'project',
                                    'text-gray-100 bg-gray-800 ': paper.type.toLowerCase() === 'capstone'
                                }">
                                    {{ paper.type.toUpperCase() }}
                                </span>
                            </td>

                            <td class="px-4 py-2 text-center flex items-center justify-center">
                                <span class="text-[10px] text-gray-50 px-3 py-1 w-24 rounded-full" :class="{
                                    'bg-green-400': paper.status.toLowerCase() === 'available',
                                    'bg-red-400': paper.status.toLowerCase() === 'checked out',
                                    'bg-gray-400': paper.status.toLowerCase() === 'archived'
                                }">
                                    {{ paper.status.toUpperCase() }}
                                </span>
                            </td>
                            <td class="px-4 py-2 border border-r border-1 border-gray-200 w-16">
                                <div class="flex justify-center gap-x-2">
                                    <button type="button" @click="selectPaper(paper)"
                                        class="pi pi-pencil bg-blue-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-blue-500 transition ease duration-200 cursor-pointer">
                                    </button>
                                    <button type="button" @click="state.selectedPaper = paper; toggleDelete = true"
                                        class="pi pi-trash bg-red-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-red-500 transition ease duration-200 cursor-pointer"></button>
                                </div>
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
