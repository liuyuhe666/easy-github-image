<script setup lang="ts">
import { siteInfo } from '../constants/site.ts'
</script>

<template>
  <footer class="py-4">
    Made with ❤️ by <a :href="siteInfo.github" class="text-sky-500 hover:text-sky-700 no-underline" target="_blank" rel="noopener noreferrer">{{ siteInfo.author }}</a>
  </footer>
</template>

<style scoped>

</style>
