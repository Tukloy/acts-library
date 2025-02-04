<script setup>
import { RouterView } from 'vue-router'
import logofill from '/images/logofill.jpg'
import backgroundImage from '/images/background.jpg'
import logo from '/images/logo.png'
</script>

<template>
  <RouterView :backgroundImage="backgroundImage" :logofill="logofill" :logo="logo" />
</template>
