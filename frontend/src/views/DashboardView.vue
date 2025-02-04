<script setup>
import axios from 'axios'
import { reactive, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
defineProps(['backgroundImage'])

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

onMounted(() => {
    getUser();
})
</script>
<template>
    <div class="relative h-screen">
        <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <Navbar :username="state.user.name" :backgroundImage="backgroundImage" />
        <div class="container-xl mx-auto">
            <p>this is the dashboard</p>
        </div>
    </div>
</template>