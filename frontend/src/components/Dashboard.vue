    <script setup>
    import axios from 'axios';
    import { reactive, onMounted, ref, watchEffect, computed } from 'vue';
    import { RouterLink } from 'vue-router';
    import Chart from 'chart.js/auto';

    const state = reactive({
        academic_papers: [],
        books: [],
        transactions: [],
        activities: [],
        accounts: [],
        isLoading: false,
    });

    const filteredAccounts = computed(() => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        return state.accounts
            .filter(acc => {
                const createdAt = new Date(acc.created_at);
                return createdAt >= lastMonth && createdAt <= today;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort latest first
    });

    const filteredBooks = computed(() => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        return state.books
            .filter(book => {
                const createdAt = new Date(book.created_at);
                return createdAt >= lastMonth && createdAt <= today;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort latest first
    });


    const selectedYear = ref(new Date().getFullYear());
    const chartCanvas = ref(null);
    let chartInstance = null;

    const data = {
        labels: [],
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
            state.books = booksRes.data.records;
            state.academic_papers = papersRes.data.records;
            state.transactions = transRes.data;
            state.activities = actRes.data;
            state.accounts = accRes.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            state.isLoading = false;
        }
    };

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

    onMounted(async () => {
        await fetchData();
        createChart();
    });

    watchEffect(() => {
        if (state.books.length || state.academic_papers.length || state.transactions.length) {
            updateChartData();
        }
    });
</script>

    <template>
        <div class="relative h-full w-full">
            <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
                <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
            </div>
            <div class="p-5 flex flex-col gap-y-4 container mx-auto w-full">
                <p class="text-2xl mb-4">Welcome to Dashboard</p>
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
                            <p class="text-right text-3xl font-semibold">{{ state.accounts.filter(a => a.account_type
                                ===
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
                            <option v-for="year in Object.keys(groupByYearAndMonth(state.books))" :key="year"
                                :value="year">
                                {{ year }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="grid xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4">
                    <div class="bg-white p-4 border border-1 border-gray-200">
                        <!-- (Last Month to Today) -->
                        <p class="mb-4">New Members</p>
                        <div v-for="account in filteredAccounts" :key="account.id"
                            class="grid grid-cols-3 items-center gap-4 p-4 border border-1 border-gray-200 shadow-sm rounded-md text-sm hover:bg-gray-100 mb-3 relative">
                            <div class="flex items-center ">
                                <i class="pi pi-user bg-blue-400 text-gray-50 p-2 rounded-full mr-2"></i>
                                <p>{{ account.name }}</p>
                            </div>
                            <p>{{ account.account_id }}</p>
                            <p>{{ new Date(account.created_at).toLocaleDateString() }}</p>
                            <div class="flex items-center gap-x-1 absolute top-6 right-4">
                                <i
                                    class="pi pi-pencil bg-blue-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-blue-500 transition ease duration-200 cursor-pointer"></i>
                                <i
                                    class="pi pi-trash bg-red-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-red-500 transition ease duration-200 cursor-pointer"></i>
                            </div>
                        </div>
                        <RouterLink to="/accounts" class="flex justify-end">
                            <p
                                class="bg-blue-400 hover:bg-blue-500 transition ease duration-200 text-[11px] text-gray-50 py-1 px-4 cursor-pointer">
                                List All</p>
                        </RouterLink>
                    </div>
                    <div class="bg-white p-4 border border-1 border-gray-200">
                        <!-- (Last Month to Today) -->
                        <p class="mb-4">New Books</p>
                        <div v-for="book in filteredBooks.slice(0, 5)" :key="book.id"
                            class="grid grid-cols-3 items-center gap-4 p-4 border border-1 border-gray-200 shadow-sm rounded-md text-sm hover:bg-gray-100 mb-3 relative">
                            <div class="flex items-center">
                                <i class="pi pi-book bg-green-400 text-gray-50 p-2 rounded-full mr-2"></i>
                                <p>{{ book.title_name }}</p>
                            </div>
                            <p>{{ book.book_id }}</p>
                            <p>{{ new Date(book.created_at).toLocaleDateString() }}</p>
                            <div class="flex items-center gap-x-1 absolute top-6 right-4">
                                <i
                                    class="pi pi-pencil bg-blue-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-blue-500 transition ease duration-200 cursor-pointer"></i>
                                <i
                                    class="pi pi-trash bg-red-400 text-gray-50 p-1 rounded-md text-[10px] hover:bg-red-500 transition ease duration-200 cursor-pointer"></i>
                            </div>
                        </div>
                        <RouterLink to="/books" class="flex justify-end">
                            <p
                                class="bg-blue-400 hover:bg-blue-500 transition ease duration-200 text-[11px] text-gray-50 py-1 px-4 cursor-pointer">
                                List All</p>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </template>
