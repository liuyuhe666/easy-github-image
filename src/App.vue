<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import ImageList from './components/ImageList.vue'
import ImageUpload from './components/ImageUpload.vue'
</script>

<template>
  <div class="fixed top-0 left-0 -z-36 w-full h-full bg-[url(/bg.jpg)] bg-cover dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" />
  <Header />
  <ImageUpload />
  <ImageList />
  <Footer />
</template>

<style scoped>
</style>
