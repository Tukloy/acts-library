<script setup>
import axios from 'axios';
import { reactive, onMounted, ref, watchEffect } from 'vue';
import Chart from 'chart.js/auto';

const state = reactive({
    academic_papers: [],
    books: [],
    transactions: [],
    activities: [],
    accounts: [],
    isLoading: false,
});

const selectedYear = ref(new Date().getFullYear());
const chartCanvas = ref(null);
let chartInstance = null;

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Books',
            data: [],
            borderColor: 'rgb(74, 222, 128)',
            backgroundColor: 'rgba(74, 222, 128, 0.5)',
            borderWidth: 2,
            tension: 0.1
        },
        {
            label: 'Academic Papers',
            data: [],
            borderColor: 'rgb(251, 113, 133)',
            backgroundColor: 'rgba(251, 113, 133, 0.5)',
            borderWidth: 2,
            tension: 0.1
        },
        {
            label: 'Students',
            data: [],
            borderColor: 'rgb(96, 165, 250)',
            backgroundColor: 'rgba(96, 165, 250, 0.5)',
            borderWidth: 2,
            tension: 0.1
        },
        {
            label: 'Transactions',
            data: [],
            borderColor: 'rgb(250, 204, 21)',
            backgroundColor: 'rgba(250, 204, 21, 0.5)',
            borderWidth: 2,
            tension: 0.1
        }
    ]
};

const groupByYearAndMonth = (data) => {
    const groupedData = {};

    data.forEach(item => {
        const date = new Date(item.created_at);
        const year = date.getFullYear();
        const month = date.getMonth();

        if (!groupedData[year]) {
            groupedData[year] = Array(12).fill(0);
        }

        groupedData[year][month] += 1;
    });

    return groupedData;
};

// Update chart data based on selected year
const updateChartData = () => {
    const booksGrouped = groupByYearAndMonth(state.books);
    const papersGrouped = groupByYearAndMonth(state.academic_papers);
    const studentsGrouped = groupByYearAndMonth(state.accounts.filter(a => a.account_type === 'student'));
    const transactionsGrouped = groupByYearAndMonth(state.transactions);

    const year = selectedYear.value; // Get the selected year

    // Fetch data for the selected year
    const yearData = booksGrouped[year] || Array(12).fill(0);
    const papersData = papersGrouped[year] || Array(12).fill(0);
    const studentsData = studentsGrouped[year] || Array(12).fill(0);
    const transactionsData = transactionsGrouped[year] || Array(12).fill(0);

    // Update the datasets for the chart
    data.datasets[0].data = yearData;
    data.datasets[1].data = papersData;
    data.datasets[2].data = studentsData;
    data.datasets[3].data = transactionsData;

    // Update the chart's labels to the months
    data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Update the chart
    if (chartInstance) chartInstance.update();
};

const fetchData = async () => {
    try {
        state.isLoading = true;
        const [booksRes, papersRes, transRes, actRes, accRes] = await Promise.all([
            axios.get('/api/books'),
            axios.get('/api/academic-papers'),
            axios.get('/api/transactions'),
            axios.get('/api/activities'),
            axios.get('/api/accounts')
        ]);
        state.books = booksRes.data;
        state.academic_papers = papersRes.data;
        state.transactions = transRes.data;
        state.activities = actRes.data;
        state.accounts = accRes.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        state.isLoading = false;
    }
};

onMounted(async () => {
    await fetchData();
    createChart();
});

const createChart = () => {
    if (chartCanvas.value && !chartInstance) {
        chartInstance = new Chart(chartCanvas.value, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        },
                        ticks: {
                            autoSkip: true
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                }
            }
        });
    }
};

watchEffect(() => {
    if (state.books.length || state.academic_papers.length || state.transactions.length) {
        updateChartData();
    }
});
</script>

<template>
    <div class="relative h-full w-full">
        <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <div class="p-5 flex flex-col gap-y-4 container mx-auto w-full">
            <p class="text-2xl text-gray mb-4">Welcome to Dashboard</p>
            <!-- Dashboard Stats -->
            <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                <div
                    class="bg-white flex items-center justify-between p-4 border border-gray-200 group hover:shadow-md transition">
                    <div class="p-4 bg-green-400 rounded-sm shadow-md">
                        <i class="pi pi-book text-gray-50 text-2xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500">Total Books</p>
                        <p class="text-right text-3xl font-semibold">{{ state.books.length }}</p>
                    </div>
                </div>
                <div
                    class="bg-white flex items-center justify-between p-4 border border-gray-200 group hover:shadow-md transition">
                    <div class="p-4 bg-rose-400 rounded-sm shadow-md">
                        <i class="pi pi-address-book text-gray-50 text-2xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500">Total Academic Papers</p>
                        <p class="text-right text-3xl font-semibold">{{ state.academic_papers.length }}</p>
                    </div>
                </div>
                <div
                    class="bg-white flex items-center justify-between p-4 border border-gray-200 group hover:shadow-md transition">
                    <div class="p-4 bg-blue-400 rounded-sm shadow-md">
                        <i class="pi pi-users text-gray-50 text-2xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500">Total Students</p>
                        <p class="text-right text-3xl font-semibold">{{ state.accounts.filter(a => a.account_type ===
                            'student').length }}</p>
                    </div>
                </div>
                <div
                    class="bg-white flex items-center justify-between p-4 border border-gray-200 group hover:shadow-md transition">
                    <div class="p-4 bg-yellow-400 rounded-sm shadow-md">
                        <i class="pi pi-address-book text-gray-50 text-2xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <p class="text-sm text-gray-500">Total Transactions</p>
                        <p class="text-right text-3xl font-semibold">{{ state.transactions.length }}</p>
                    </div>
                </div>
            </div>

            <!-- Chart -->
            <div class="w-full bg-white p-4 border border-gray-200 relative">
                <canvas ref="chartCanvas" height="300"></canvas>
                <div class="absolute top-3 right-7">
                    <select v-model="selectedYear" @change="updateChartData"
                        class="p-1 border border-1 border-gray-200 outline-none cursor-pointer rounded-md text-xs">
                        <!-- Generate years dynamically, you can limit range or fetch from data -->
                        <option v-for="year in Object.keys(groupByYearAndMonth(state.books))" :key="year" :value="year">
                            {{ year }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
