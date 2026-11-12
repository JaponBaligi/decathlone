<script setup>
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()
const { sports } = storeToRefs(catalog)
</script>

<template>
  <div class="container page">
    <h1>Tüm Sporlar</h1>
    <div class="grid">
      <RouterLink
        v-for="sport in sports"
        :key="sport.slug"
        :to="{ name: 'sport', params: { slug: sport.slug } }"
        class="item"
      >
        {{ sport.name }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-3);
}
.item {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-weight: 700;
  text-align: center;
}
.item:hover {
  border-color: var(--color-brand);
  color: var(--color-brand);
}
</style>
