<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import ProductGrid from '@/components/organisms/ProductGrid.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const items = ref([])

onMounted(async () => {
  if (!auth.isAuthenticated) return
  const data = await api('/wishlist')
  items.value = data.items
})
</script>

<template>
  <div class="container page">
    <h1>Favoriler</h1>
    <template v-if="!auth.isAuthenticated">
      <p>Favorileri görmek için giriş yapın.</p>
      <RouterLink to="/giris"><BaseButton>Giriş</BaseButton></RouterLink>
    </template>
    <ProductGrid v-else :products="items" />
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
</style>
