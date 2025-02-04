<script setup>
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
defineProps(['backgroundImage', 'logo'])

const router = useRouter()

const state = reactive({
    user: '',
    isLoading: false
})

const getUser = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/me', { withCredentials: true });
        if (response.status === 200) {
            state.user = response.data.user;
        }
        console.log(state.user)
    } catch (error) {
        console.error('Error getting user:', error);
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
})
</script>
<template>
    <div class="relative h-screen flex">
        <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <Sidebar :logo="logo" @emit-logout="logout" />
        <div class="w-full">
            <Navbar :username="state.user.name" @emit-logout="logout" />
            <div class="container-xl mx-auto">
                <RouterView />
            </div>
        </div>
    </div>
</template>