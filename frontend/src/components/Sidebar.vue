<script setup>
import { RouterLink } from 'vue-router';
import { defineEmits } from 'vue';

defineProps(['logo'])

const emit = defineEmits(['emit-logout'])
</script>
<template>
    <div class="w-64 flex flex-col h-screen">
        <div class="flex px-3 pt-2 pb-2 border-r border-1 shadow-sm border-gray-100">
            <img class="h-12 w-12 mr-3" :src="logo" alt="">
            <div class="text-center flex flex-col justify-center items-center">
                <p class="text-xs">ACTS-LIBRARY</p>
                <p class="text-[8px]">LIBRARY MANAGEMENT SYSTEM</p>
            </div>
        </div>
        <div class="h-full border border-2 shadow-sm border-gray-200 py-4 pl-2 flex flex-col justify-between">
            <div class="flex flex-col gap-y-2">
                <RouterLink to="/dashboard" activeClass="border-r-4 border-green-800 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-box mr-4"></i>
                    <p class="text-sm font-semibold">DASHBOARD</p>
                </RouterLink>
                <RouterLink to="/academic-papers" activeClass="border-r-4 border-green-600 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-address-book mr-4"></i>
                    <p class="text-sm font-semibold">ACADEMIC PAPERS</p>
                </RouterLink>
                <RouterLink to="/books" activeClass="border-r-4 border-green-600 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-book mr-4"></i>
                    <p class="text-sm font-semibold">BOOKS</p>
                </RouterLink>
                <RouterLink to="/transactions" activeClass="border-r-4 border-green-600 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-arrow-right-arrow-left mr-4"></i>
                    <p class="text-sm font-semibold">TRANSACTIONS</p>
                </RouterLink>
                <RouterLink to="/activities" activeClass="border-r-4 border-green-600 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-pen-to-square mr-4"></i>
                    <p class="text-sm font-semibold">ACTIVITIES</p>
                </RouterLink>
                <RouterLink to="/accounts" activeClass="border-r-4 border-green-600 text-green-800 bg-gray-200"
                    class="flex items-center hover:bg-gray-100 py-2 pl-2 cursor-pointer">
                    <i class="pi pi-users mr-4"></i>
                    <p class="text-sm font-semibold">ACCOUNTS</p>
                </RouterLink>
            </div>
            <div @click="emit('emit-logout')"
                class="flex items-center justify-center mr-4 group cursor-pointer text-gray-400">
                <i class="pi pi-sign-out mr-4 group-hover:text-red-700 transition ease-in-out duration-200"></i>
                <p class="text-sm font-semibold group-hover:text-red-700 transition ease-in-out duration-200">
                    LOGOUT</p>
            </div>
        </div>
    </div>
</template>