<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const orders = ref([])

onMounted(async () => {
  if (!auth.isAuthenticated) return
  orders.value = await api('/orders')
})
</script>

<template>
  <div class="container page">
    <h1>Siparişlerim</h1>
    <p v-if="!auth.isAuthenticated">Giriş yapmanız gerekiyor. <RouterLink to="/giris">Giriş</RouterLink></p>
    <ul v-else-if="orders.length" class="list">
      <li v-for="o in orders" :key="o.id">
        <RouterLink :to="{ name: 'order-success', params: { orderNumber: o.orderNumber } }">
          {{ o.orderNumber }} — {{ o.totalLabel }} — {{ o.status }}
        </RouterLink>
      </li>
    </ul>
    <p v-else>Henüz sipariş yok.</p>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}
.list a {
  display: block;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  font-weight: 600;
}
</style>
