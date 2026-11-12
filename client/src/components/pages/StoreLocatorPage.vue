<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import BaseInput from '@/components/atoms/BaseInput.vue'

const stores = ref([])
const cities = ref([])
const city = ref('')
const q = ref('')

async function load() {
  const params = new URLSearchParams()
  if (city.value) params.set('city', city.value)
  if (q.value) params.set('q', q.value)
  stores.value = await api(`/stores?${params}`)
}

onMounted(async () => {
  cities.value = await api('/stores/cities')
  await load()
})
watch([city, q], load)
</script>

<template>
  <div class="container page">
    <h1>Mağazalar</h1>
    <div class="filters">
      <select v-model="city">
        <option value="">Tüm şehirler</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <BaseInput v-model="q" placeholder="Mağaza ara..." />
    </div>
    <div class="grid">
      <RouterLink
        v-for="store in stores"
        :key="store.id"
        :to="{ name: 'store-detail', params: { slug: store.slug } }"
        class="card"
      >
        <h2>{{ store.name }}</h2>
        <p>{{ store.district }}, {{ store.city }}</p>
        <p>{{ store.hours }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.filters {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
select {
  min-height: 44px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
}
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
.card h2 {
  font-size: 1.1rem;
}
@media (max-width: 700px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
