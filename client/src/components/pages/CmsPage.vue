<script setup>
import { onMounted, ref, watch } from 'vue'
import { api } from '@/services/api'

const props = defineProps({ slug: String })
const page = ref(null)
const error = ref('')

async function load() {
  try {
    error.value = ''
    page.value = await api(`/cms/${props.slug}`)
  } catch (e) {
    error.value = e.message
    page.value = null
  }
}
onMounted(load)
watch(() => props.slug, load)
</script>

<template>
  <div class="container page">
    <p v-if="error">{{ error }}</p>
    <article v-else-if="page" class="card">
      <h1>{{ page.title }}</h1>
      <p>{{ page.body }}</p>
    </article>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  max-width: 760px;
}
</style>
