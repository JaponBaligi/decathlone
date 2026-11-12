<script setup>
import DefaultLayout from '@/components/templates/DefaultLayout.vue'
import CookieBanner from '@/components/molecules/CookieBanner.vue'
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
  <CookieBanner />
</template>
