<script setup>
import axios from 'axios'
import { reactive, onMounted, ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
defineProps(['backgroundImage', 'logo'])

const router = useRouter()

const toggleSidebar = ref(true)
const state = reactive({
    user: '',
    academic_papers: {},
    books: {},
    transactions: {},
    activities: {},
    accounts: {},
    isLoading: false,
})

const getUser = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/me', { withCredentials: true });
        if (response.status === 200) {
            state.user = response.data.user;
        }
    } catch (error) {
        console.error('Error getting user:', error);
    } finally {
        state.isLoading = false;
    }
}

const getAcademicPapers = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/academic-papers');
        if (response.status === 200) {
            state.academic_papers = response.data;
        }
    } catch (error) {
        console.error('Error getting academic papers:', error);
    } finally {
        state.isLoading = false;
    }
}

const getBooks = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/books');
        if (response.status === 200) {
            state.books = response.data;
        }
    } catch (error) {
        console.error('Error getting books:', error);
    } finally {
        state.isLoading = false;
    }
}

const getTransactions = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/transactions');
        if (response.status === 200) {
            state.transactions = response.data;
        }
    } catch (error) {
        console.error('Error getting transactions:', error);
    } finally {
        state.isLoading = false;
    }
}

const getActivities = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/activities');
        if (response.status === 200) {
            state.activities = response.data;
        }
    } catch (error) {
        console.error('Error getting activities:', error);
    } finally {
        state.isLoading = false;
    }
}

const getAccounts = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/accounts');
        if (response.status === 200) {
            state.accounts = response.data;
        }
    } catch (error) {
        console.error('Error getting accounts:', error);
    } finally {
        state.isLoading = false;
    }
}

const logout = async () => {
    try {
        const response = await axios.get('/api/logout', { withCredentials: true });
        if (response.status === 200) {
            router.push({ name: 'login' });
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

onMounted(() => {
    getUser();
    getAcademicPapers();
    getBooks()
    getTransactions()
    getActivities()
    getAccounts()
})
</script>
<template>
    <div class="relative h-screen flex">
        <Sidebar :logo="logo" @emit-logout="logout" :toggleSidebar="toggleSidebar" />
        <div class="w-full flex flex-col">
            <Navbar :username="state.user.name" @emit-logout="logout"
                @emit-close-sidebar="toggleSidebar = !toggleSidebar" />
            <div class="flex-1 overflow-auto container-xl">
                <RouterView :isLoading="state.isLoading" :academic_papers="state.academic_papers" :books="state.books"
                    :transactions="state.transactions" :activities="state.activities" :accounts="state.accounts" />
            </div>
        </div>
    </div>
</template>
