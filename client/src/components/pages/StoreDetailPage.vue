<script setup>
import { onMounted, ref, watch } from 'vue'
import { api } from '@/services/api'

const props = defineProps({ slug: String })
const store = ref(null)

async function load() {
  store.value = await api(`/stores/${props.slug}`)
}
onMounted(load)
watch(() => props.slug, load)
</script>

<template>
  <div v-if="store" class="container page">
    <h1>{{ store.name }}</h1>
    <p>{{ store.address }}</p>
    <p>{{ store.district }} / {{ store.city }}</p>
    <p>Telefon: {{ store.phone }}</p>
    <p>Çalışma saatleri: {{ store.hours }}</p>
    <p>Servisler: {{ store.services.join(', ') }}</p>
    <p class="map">Harita stub — lat {{ store.lat }}, lng {{ store.lng }}</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-top: var(--space-5);
}
.map {
  margin-top: var(--space-4);
  color: var(--color-muted);
}
</style>
