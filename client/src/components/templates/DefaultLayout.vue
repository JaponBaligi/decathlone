<script setup>
import SiteHeader from '@/components/organisms/SiteHeader.vue'
import SiteFooter from '@/components/organisms/SiteFooter.vue'
</script>

<template>
  <div class="layout">
    <SiteHeader />
    <main class="layout__main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.layout__main {
  flex: 1;
}
</style>
