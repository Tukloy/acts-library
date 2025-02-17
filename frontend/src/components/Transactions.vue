<script setup>
import axios from "axios"
import { reactive, onMounted } from "vue";

const state = reactive({
    transactions: []
})

const getTransactions = async () => {
    try {
        const response = await axios.get("/api/transactions");
        state.transactions = response.data;
        console.log("Fetched transactions:", state.transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

onMounted(() => {
    getTransactions(); // Fetch transactions on component mounting
});
</script>
<template>
    this is the transaction
</template>