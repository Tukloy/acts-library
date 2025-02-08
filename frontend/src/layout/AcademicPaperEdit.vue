<script setup>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    toggleEdit: Boolean,
    selectedPaper: Object
})

const emit = defineEmits(['emit-close-edit', 'emit-paper-updated'])
const toast = useToast();

const form = reactive({
    id: null,
    acadp_id: '',
    author_name: '',
    course: '',
    title_name: '',
    academic_year: '',
    type: '',
    status: '',
    created_at: '',
    isLoading: false
})

const errorMessage = ref('');

const submitForm = async () => {
    const editPaper = {
        acadp_id: form.acadp_id.toLowerCase(),
        author_name: form.author_name.toLowerCase(),
        course: form.course.toLowerCase(),
        title_name: form.title_name.toLowerCase(),
        academic_year: form.academic_year,
        type: form.type,
        status: form.status,
        created_at: form.created_at
    }
    try {
        form.isLoading = true;
        await axios.put(`/api/academic-papers/${form.id}`, editPaper);
        toast.success('Academic paper updated successfully!');

        emit('emit-paper-updated');

        form.acadp_id = '';
        form.author_name = '';
        form.course = '';
        form.title_name = '';
        form.academic_year = '';
        form.type = '';
        form.status = '';
        form.created_at = '';

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

watch(() => props.selectedPaper, (newVal) => {
    if (newVal) {
        form.id = newVal.id || '';
        form.acadp_id = newVal.acadp_id || '';
        form.author_name = newVal.author_name || '';
        form.course = newVal.course || '';
        form.title_name = newVal.title_name || '';
        form.academic_year = newVal.academic_year || '';
        form.type = newVal.type || '';
        form.status = newVal.status || '';
        form.created_at = newVal.created_at || '';
    }
}, { immediate: true });
</script>
<template>
    <div v-show="toggleEdit" class="absolute inset-0 bg-black/80 z-30 flex items-center justify-center">
        <div v-if="false" class="absolute inset-0 bg-white/90 flex justify-center items-center z-10">
            <i class="pi pi-spinner animate-spin text-6xl text-green-800"></i>
        </div>
        <div class="p-5 container flex flex-col items-center mx-auto w-full h-full">
            <form @submit.prevent="submitForm()"
                class="p-6 bg-white flex flex-col justify-between border border-1 border-gray-200 rounded w-lg h-full">
                <div class="flex flex-col gap-y-2">
                    <p class="text-2xl text-center mb-6">Academic Paper Form</p>
                    <p class="bg-gray-100 text-green-800 p-2 mb-2">Author Information</p>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Full name:</p>
                        <input v-model="form.author_name"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                            type="text" placeholder="Ex: Dela Cruz, Juan">
                    </div>
                    <div class="text-sm flex items-center gap-x-4 mb-2">
                        <p class="w-32">Course:</p>
                        <input v-model="form.course"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                            type="text" placeholder="Ex: BSIT">
                    </div>
                    <p class="bg-gray-100 text-green-800 p-2 mb-2">Paper Information</p>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Title name:</p>
                        <input v-model="form.title_name"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                            type="text" placeholder="Ex: Juan's Adventure">
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Year issued:</p>
                        <input v-model="form.academic_year"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400"
                            type="number" placeholder="Ex: 2020">
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Paper ID:</p>
                        <input v-model="form.acadp_id"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400 placeholder:text-[11px]"
                            type="text"
                            placeholder="Ex: ACADP-DJ-2020 ('1st letter of last and firstname - year issued')">
                    </div>
                    <div class="text-sm flex items-center gap-x-4">
                        <p class="w-32">Type:</p>
                        <select v-model="form.type"
                            class="border border-1 w-full border-gray-200 p-2 outline-none focus:border-green-400">
                            <option disabled value="">Select type</option>
                            <option value="project">Project</option>
                            <option value="thesis">Thesis</option>
                            <option value="capstone">Capstone</option>
                        </select>
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
                    <button @click="emit('emit-close-edit')" type="button"
                        class="text-gray-400 text-sm px-8 py-1 shadow-sm bg-gray-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        CANCEL</button>
                    <button type="submit"
                        class="text-green-600 text-sm px-8 py-1 shadow-sm bg-green-200 rounded-full hover:bg-green-600 hover:text-gray-50 transition ease duration-300 cursor-pointer">
                        SAVE</button>
                </div>
            </form>
        </div>
    </div>
</template>