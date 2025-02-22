<script setup>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { reactive, ref, watch } from 'vue';

const toast = useToast();

const props = defineProps({
    toggleEdit: Boolean,
    selectedBook: Object
})

const emit = defineEmits(['emit-close-edit', 'emit-book-updated'])

const toggleAddType = ref(false)

const form = reactive({
    id: null,
    book_id: '',
    author_name: '',
    title_name: '',
    typeField: '',
    type: [],
    status: '',
    created_at: '',
    isLoading: false
})

const addType = () => {
    if (!form.typeField.trim()) {
        toast.error('Please enter a type');
        return;
    }

    form.type.push(form.typeField.trim());
    toggleAddType.value = false;
    form.typeField = '';
};

const removeType = (index) => {
    form.type.splice(index, 1)
}

const errorMessage = ref('');

const submitForm = async () => {
    const updatedBook = {
        id: form.id,
        book_id: form.book_id.toLowerCase(),
        author_name: form.author_name.toLowerCase(),
        title_name: form.title_name.toLowerCase(),
        type: form.type.join(" ").toLowerCase(),
        status: form.status,
        created_at: form.created_at
    }
    try {
        form.isLoading = true;
        await axios.put(`/api/books/${form.id}`, updatedBook);
        // console.log(updatedBook);
        emit('emit-book-updated')

        toast.success('Book updated successfully!');

        emit('emit-close-edit')
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.msg || error.response.data.errors[0] || 'updating failed';
            toast.error(errorMessage.value);
        } else {
            console.error(error)
        }
    } finally {
        form.isLoading = false;
    }
}

watch(() => props.selectedBook, (newVal) => {
    if (newVal) {
        form.id = newVal.id || '';
        form.book_id = newVal.book_id.toLowerCase() || '';
        form.author_name = newVal.author_name.toLowerCase() || '';
        form.title_name = newVal.title_name.toLowerCase() || '';
        form.type = Array.isArray(newVal.type) ? newVal.type : newVal.type?.split(' ') || [];
        form.status = newVal.status.toLowerCase() || '';
        form.created_at = newVal.created_at || '';
    }
}, { immediate: true });
</script>
<template>
    <div v-show="toggleEdit" class="absolute inset-0 bg-black/80 z-30 flex items-center justify-center">
        <div v-if="form.isLoading" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <transition name="modal">
            <div v-if="toggleEdit"
                class="p-5 container flex flex-col items-center mx-auto w-full h-full transform transition-transform duration-200">
                <form @submit.prevent="submitForm()"
                    class="p-6 bg-white flex flex-col justify-between border border-1 border-gray-200 rounded w-lg h-full">
                    <div class="flex flex-col gap-y-2">
                        <p class="text-2xl text-center mb-6">Book Form</p>
                        <p class="bg-gray-100 text-green-800 p-2 mb-2">Author Information</p>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Full name:</p>
                            <input v-model="form.author_name"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                                type="text" placeholder="Ex: Dela Cruz, Juan">
                        </div>
                        <p class="bg-gray-100 text-green-800 p-2 mb-2">Book Information</p>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Title name:</p>
                            <input v-model="form.title_name"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                                type="text" placeholder="Ex: Case studies in information and computer ethics">
                        </div>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Book ID:</p>
                            <input v-model="form.book_id"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400 placeholder:text-[11px]"
                                type="text" placeholder="Ex: CSIC-1">
                        </div>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Type:</p>
                            <div class="flex items-center justify-between w-full">
                                <div v-show="form.type.length > 0" class="grid  gap-2 w-full mr-2"
                                    :class="{ 'grid-cols-3': toggleAddType === false, 'grid-cols-2': toggleAddType === true }">
                                    <p v-for="(item, index) in form.type" :key="index"
                                        class="p-1 px-4 bg-gray-200 rounded text-gray-400 relative">
                                        {{ item }}
                                        <i @click="removeType(index)"
                                            class="absolute top-2 right-2 pi pi-times text-xs cursor-pointer hover:text-red-400"></i>
                                    </p>
                                </div>
                                <div class="relative flex items-center">
                                    <input v-show="toggleAddType" v-model="form.typeField"
                                        class="border border-1 w-32 border-gray-200 p-2 outline-none focus:border-green-400 placeholder:text-[11px] mr-2"
                                        type="text" placeholder="Ex: Horror">
                                    <i v-show="toggleAddType" @click="addType()"
                                        class="absolute top-2 right-9 pi pi-check p-1 rounded-full bg-green-300 text-gray-50 hover:bg-green-400 transition ease duration-300 cursor-pointer text-sm"></i>
                                    <i v-show="!toggleAddType" @click="toggleAddType = true"
                                        class="pi pi-plus p-1 rounded-full bg-green-300 text-gray-50 hover:bg-green-400 transition ease duration-300 cursor-pointer text-sm"></i>
                                    <i v-show="toggleAddType" @click="toggleAddType = false, form.typeField = ''"
                                        class="pi pi-times p-1 rounded-full bg-red-300 text-gray-50 hover:bg-red-400 transition ease duration-300 cursor-pointer text-sm"></i>
                                </div>
                            </div>
                        </div>
                        <div class="text-sm flex items-center gap-x-4">
                            <p class="w-32">Status:</p>
                            <select v-model="form.status"
                                class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                                <option disabled value="">Select type</option>
                                <option value="available">Available</option>
                                <option value="checked out">Checked Out</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
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