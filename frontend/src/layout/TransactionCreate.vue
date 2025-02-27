<script setup>
import axios from "axios"
import { reactive, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import VueDatePicker from '@vuepic/vue-datepicker';

const router = useRouter()
const toast = useToast()

const state = reactive({
    accounts: [],
    items: []
})

const errorMessage = ref('')

const form = reactive({
    transaction_id: '',
    account_id: '',
    item_id: '',
    borrow_date: '',
    due_date: '',
    return_date: null,
    status: '',
    isLoading: false
})

const getAccounts = async () => {
    try {
        state.isLoading = true;
        const response = await axios.get('/api/accounts');
        state.accounts = response.data.filter(account => account.account_type === 'student')
    } catch (error) {
        console.error(error);
    } finally {
        state.isLoading = false;
    }
}

const getItems = async () => {
    try {
        const [booksRes, papersRes] = await Promise.all([
            axios.get('/api/books'),
            axios.get('/api/academic-papers'),
        ]);

        const books = booksRes.data.records.map(book => ({
            ...book,
            item_id: book.book_id,
        }));
        const papers = papersRes.data.records.map(paper => ({
            ...paper,
            item_id: paper.acadp_id,
        }));

        state.items = [...books, ...papers];
    } catch (error) {
        console.error(error);
    }
};

const submitForm = async () => {
    try {
        let borrowDate = new Date(form.borrow_date);
        if (isNaN(borrowDate.getTime())) {
            throw new Error("Invalid borrow date");
        }
        form.borrow_date = borrowDate.toISOString();

        const newTransactions = {
            account_id: form.account_id.toLowerCase(),
            transaction_id: form.transaction_id.toLowerCase(),
            item_id: form.item_id.toLowerCase(),
            created_at: form.borrow_date,
            borrow_date: form.borrow_date,
            status: form.status.toLowerCase(),
        };

        if (form.return_date !== null && form.return_date !== undefined) {
            newTransactions.return_date = form.return_date;
        }

        form.isLoading = true;
        await axios.post(`/api/transactions/`, newTransactions);
        toast.success('Transaction created successfully');
        router.push('/transactions');
    } catch (error) {
        if (error.message === "Invalid borrow date") {
            toast.error("The borrow date is invalid. Please enter a valid date.");
        } else if (error.response) {
            errorMessage.value = error.response.data.msg || error.response.data.errors[0] || 'Creating failed';
            toast.error(errorMessage.value);
        } else {
            console.error(error);
        }
    } finally {
        form.isLoading = false;
    }
};


onMounted(() => {
    getAccounts();
    getItems()
});
</script>
<template>
    <div class="relative h-full w-full">
        <div v-if="form.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <div class="p-5 container flex flex-col items-center mx-auto w-full h-full">
            <form @submit.prevent="submitForm()"
                class="p-6 bg-white flex flex-col justify-between border border-1 border-gray-200 rounded w-lg h-full">
                <div class="flex flex-col gap-y-2">
                    <p class="text-2xl text-center mb-6">Transaction Form</p>
                    <p class="bg-gray-100 text-green-800 p-2 mb-2">Transaction Information</p>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Transaction ID:</p>
                        <input v-model="form.transaction_id"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Account ID:</p>
                        <select v-model="form.account_id"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400 cursor-pointer">
                            <option v-for="account in state.accounts" :key="account.id" :value="account.account_id">
                                {{ account.account_id }}
                            </option>
                        </select>
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Item ID:</p>
                        <select v-model="form.item_id"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400 cursor-pointer">
                            <option v-for="item in state.items" :key="item.id" :value="item.item_id">{{ item.item_id
                                }}</option>
                        </select>
                    </div>
                    <p class="bg-gray-100 text-green-800 p-2 mb-2">Date Information</p>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Borrow Date:</p>
                        <VueDatePicker v-model="form.borrow_date" auto-apply placeholder="Select date borrowed" />
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Return Date:</p>
                        <VueDatePicker v-model="form.return_date" auto-apply placeholder="Select return date" />
                    </div>
                    <p class="bg-gray-100 text-green-800 p-2 mb-2">Status</p>
                    <input v-model="form.status" disabled="true" :class="{
                        'bg-green-100 border-green-300 text-green-600': form.status.split(' ')[0] === 'returned',
                        'bg-yellow-100 border-yellow-300 text-yellow-600': form.status.split(' ')[0] === 'pending',
                        'bg-red-100 border-red-300 text-red-600': form.status.split(' ')[0] === 'overdue'
                    }" class="border border-1 w-full p-2 outline-none focus:border-green-400 text-center">
                </div>
                <div class="flex justify-end gap-x-4">
                    <RouterLink to="/transactions"
                        class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        CANCEL</RouterLink>
                    <button type="submit"
                        class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        SAVE</button>
                </div>
            </form>
        </div>
    </div>
</template>