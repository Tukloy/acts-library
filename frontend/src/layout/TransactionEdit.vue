<script setup>
import axios from 'axios';
import { reactive, watch, onMounted } from 'vue';

const props = defineProps({
    toggleEdit: Boolean,
    selectedTransaction: Object
})
const emit = defineEmits(['emit-close-edit'])

const state = reactive({
    accounts: [],
    items: []
})
const form = reactive({
    id: null,
    transaction_id: '',
    account_id: '',
    item_id: '',
    borrow_date: '',
    due_date: '',
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
        console.log(state.items)
    } catch (error) {
        console.error(error);
    }
};

const submitForm = () => {
    const updatedTransactions = {
        account_id: form.account_id,
        transaction_id: form.transaction_id,
        item_id: form.item_id,
        borrow_date: form.borrow_date,
        due_date: form.due_date,
        status: form.status
    }
    console.log(updatedTransactions)
}

onMounted(() => {
    getAccounts();
    getItems()
});

watch(() => props.selectedTransaction, (newVal) => {
    if (newVal) {
        form.id = newVal.id || null;
        form.account_id = newVal.account_id || '';
        form.transaction_id = newVal.transaction_id || '';
        form.item_id = newVal.item_id || '';
        form.borrow_date = newVal.borrow_date || '';
        form.due_date = newVal.due_date || '';
        form.status = newVal.status || '';
    }
}, { deep: true, immediate: true });

</script>
<template>
    <div v-show="toggleEdit" class="absolute inset-0 bg-black/80 z-30 flex items-center justify-center">
        <div v-if="state.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <transition name="modal">
            <div v-if="toggleEdit"
                class="p-5 container flex flex-col items-center mx-auto h-full w-full transform transition-transform duration-200">
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
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                                <option v-for="account in state.accounts" :key="account.id" :value="account.account_id">
                                    {{ account.name }}
                                </option>
                            </select>
                        </div>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Item ID:</p>
                            <select v-model="form.item_id"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                                <option v-for="item in state.items" :key="item.id" :value="item.item_id">{{ item.item_id
                                }}</option>
                            </select>
                        </div>
                        <p class="bg-gray-100 text-green-800 p-2 mb-2">Date Information</p>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Borrow Date:</p>
                            <select v-model="form.borrow_date"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                                <option value="test">test</option>
                            </select>
                        </div>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Due Date:</p>
                            <select v-model="form.due_date"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                                <option value="test">test</option>
                            </select>
                        </div>
                        <p class="bg-gray-100 text-green-800 p-2 mb-2">Status</p>
                        <select v-model="form.status"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                            <option value="test">test</option>
                        </select>
                    </div>
                    <div class="flex justify-end gap-x-4">
                        <button type="button" @click="emit('emit-close-edit')"
                            class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                            CANCEL</button>
                        <button type="submit"
                            class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                            SAVE</button>
                    </div>
                </form>
            </div>
        </transition>
    </div>
</template>
<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
    transform: scale(0.95);
    opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
    transform: scale(1);
    opacity: 1;
}
</style>