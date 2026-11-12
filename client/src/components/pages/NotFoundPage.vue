<script setup>
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'
</script>

<template>
  <div class="container page">
    <h1>404</h1>
    <p>Aradığınız sayfa bulunamadı.</p>
    <RouterLink to="/"><BaseButton>Ana sayfaya dön</BaseButton></RouterLink>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-7);
  text-align: center;
}
</style>
