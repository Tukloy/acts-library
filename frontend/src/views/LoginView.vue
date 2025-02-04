<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
defineProps(['backgroundImage', 'logofill'])

// Define the data properties using `ref`
const state = reactive({
    username: '',
    password: ''
})
const errorMessage = ref('');

const router = useRouter();
const toast = useToast();

// Login method
const login = async () => {
    try {
        const response = await axios.post('/api/login', {
            account_id: state.username,
            password: state.password
        });
        toast(`Welcome back ${response.data.name}`)
        console.log(response.data)
        router.push('/dashboard');
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.info.message || 'Login failed';
        } else {
            errorMessage.value = 'An error occurred. Please try again later.';
        }
    }
};
</script>
<template>
    <div class="bg-cover bg-center h-screen" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="container-lg h-full flex gap-x-6 ml-20 mr-10">
            <div class="w-[60%] h-full flex justify-center items-center">
                <div
                    class="flex flex-col bg-white/50 p-10 rounded-3xl backdrop-blur-sm border border-2 border-gray-50 relative shadow-2xl">
                    <div class="absolute -top-18 -left-18 w-34 h-32 rounded-full overflow-hidden">
                        <img class="" :src="logofill" alt="logo">
                    </div>
                    <p
                        class="text-5xl text-green-800 font-semibold drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.8)] mb-6 cursor-default">
                        Embracing
                        Unwavering Commitment Towards Reliency,
                        Growth
                        and
                        Sustainability
                    </p>
                    <p
                        class="text-right text-3xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(22,101,52,0.8)] cursor-default">
                        - To GOD be all the Glory</p>
                </div>
            </div>
            <div class="w-[40%] flex justify-center items-center">
                <form @submit.prevent="login" class="flex flex-col gap-y-3 p-10 shadow-2xl bg-white relative">
                    <p class="text-3xl font-bold text-green-900 mb-8">Welcome to ACTS
                        -
                        LIBRARY
                    </p>
                    <div class="flex flex-col">
                        <label class="font-semibold mb-1" for="username">Username:</label>
                        <div class="relative">
                            <input v-model="state.username" autocomplete="name"
                                class="border w-full border-2 border-gray-200 outline-none focus:border-green-400 py-3 pl-3 pr-12"
                                type="text" placeholder="">
                            <i class="pi pi-user absolute top-4 right-5"></i>
                        </div>
                    </div>
                    <div class="flex flex-col mb-4">
                        <label class="font-semibold" for="password">Password:</label>
                        <div class="relative">
                            <input v-model="state.password" autocomplete="current-password"
                                class="border w-full border-2 border-gray-200 outline-none focus:border-green-400 py-3 pl-3 pr-12"
                                :class="{ 'border-red-500': state.isNotLogin, 'border-gray-200': !state.isNotLogin }"
                                type="password" placeholder="">
                            <i class="pi pi-lock absolute top-4 right-5"></i>
                        </div>
                        <p v-if="errorMessage" class="text-xs text-red-500">{{ errorMessage }}</p>
                    </div>
                    <button type="submit"
                        class="btn-primary py-3 text-gray-100 cursor-pointer focus:outline-1 outline-green-500">SIGN
                        IN</button>
                </form>
            </div>
        </div>
    </div>
</template>