<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logofill from '/images/logofill.jpg'
import backgroundImage from '/images/background.jpg'
</script>

<template>
  <RouterView :backgroundImage="backgroundImage" :logofill="logofill" />
</template>
