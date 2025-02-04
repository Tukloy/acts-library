<script setup>
const props = defineProps({
    isLoading: Boolean,
    academic_papers: Array,
    books: Array,
    transactions: Array,
    activities: Array,
    accounts: Array
});
</script>

<template>
    <div class="relative h-full w-full">
        <div v-if="props.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <div class="p-5">
            <p class="text-2xl text-gray">Welcome to Dashboard</p>
        </div>
    </div>
</template>
