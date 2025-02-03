<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter()

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
</script>
<template>
    <div>
        <p>this is the dashboard</p>
        <button @click="logout" class="bg-red-500">logout</button>
    </div>
</template>