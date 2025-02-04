<script setup>
import { ref, defineProps, defineEmits, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

defineProps(['username'])
const emit = defineEmits(['emit-logout'])

const toggleSetting = ref(false)

const closeDropdown = (event) => {
    if (!event.target.closest('.dropdown-menu')) {
        toggleSetting.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})
</script>

<template>
    <div class="shadow-md flex items-center justify-between px-4 py-4">
        <i class="pi pi-bars"></i>
        <div class="flex items-center gap-x-2 relative">
            <div v-show="toggleSetting"
                class="dropdown-menu absolute top-10 right-0 w-48 shadow-lg bg-white border border-gray-100 rounded-md p-2">
                <RouterLink to="/profile"
                    class="flex items-center justify-between hover:bg-green-800 px-2 py-2 rounded-lg group cursor-pointer transition ease-in-out duration-200 mb-1">
                    <div class="flex items-center">
                        <i class="pi pi-user bg-gray-200 p-2 rounded-full mr-3"></i>
                        <p class="group-hover:text-gray-50">Profile</p>
                    </div>
                    <i class="pi pi-angle-right group-hover:text-gray-50"></i>
                </RouterLink>
                <div @click="emit('emit-logout')"
                    class="flex items-center justify-between hover:bg-green-800 px-2 py-2 rounded-lg group cursor-pointer transition ease-in-out duration-200">
                    <div class="flex items-center">
                        <i class="pi pi-sign-out bg-gray-200 p-2 rounded-full mr-3"></i>
                        <p class="group-hover:text-gray-50">Logout</p>
                    </div>
                </div>
            </div>
            <p class="font-semibold mr-1 text-green-800"><span class="text-gray-500 mr-1">Hello,</span>{{ username }}
            </p>
            <button @click.stop="toggleSetting = !toggleSetting"
                class="pi pi-user bg-gray-200 p-2 rounded-full cursor-pointer hover:text-green-800 hover:scale-105 transition ease duration-200">
            </button>
        </div>
    </div>
</template>
