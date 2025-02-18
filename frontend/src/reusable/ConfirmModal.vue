<script setup>
defineProps(['toggleDelete', 'questionText', 'confirmText'])
const emit = defineEmits(['emit-close-delete', 'emit-confirm-delete'])
</script>

<template>
    <div v-show="toggleDelete" class="absolute inset-0 h-full w-full bg-black/80 z-30 flex justify-center items-center">
        <transition name="modal">
            <div v-if="toggleDelete"
                class="bg-white p-4 rounded-md w-xs flex flex-col gap-y-4 transform transition-transform duration-200">
                <p class="text-xl">{{ questionText }}</p>
                <p class="text-sm border-y py-2 border-gray-200 text-gray-500">
                    This will delete the data permanently. You cannot undo this action.
                </p>
                <div class="flex justify-end gap-x-4">
                    <button @click="emit('emit-confirm-delete')"
                        class="bg-red-500 text-gray-50 px-3 py-1 hover:bg-red-600 cursor-pointer transition ease duration-200">
                        {{ confirmText }}
                    </button>
                    <button @click="emit('emit-close-delete')"
                        class="bg-gray-400 text-gray-50 px-3 py-1 hover:bg-gray-500 cursor-pointer transition ease duration-200">
                        Cancel
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* Pop-in animation */
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
