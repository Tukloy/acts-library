<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
    <section class="text-center flex flex-col justify-center items-center h-full">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-7xl mb-5"></i>
        <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>
        <p class="text-xl mb-5">This page does not exist</p>
        <RouterLink to="/dashboard" class="text-white bg-gray-700 hover:bg-gray-900 rounded-lg py-2 mt-4 px-2">
            Go Back
        </RouterLink>
    </section>
</template>