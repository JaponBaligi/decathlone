<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps({ orderNumber: String })
const order = ref(null)

onMounted(async () => {
  order.value = await api(`/orders/${props.orderNumber}`)
})
</script>

<template>
  <div class="container page">
    <h1>Siparişiniz alındı</h1>
    <div v-if="order" class="card">
      <p>Sipariş no: <strong>{{ order.orderNumber }}</strong></p>
      <p>Durum: {{ order.status }}</p>
      <p>Toplam: {{ order.totalLabel }}</p>
      <ul>
        <li v-for="(item, i) in order.items" :key="i">
          {{ item.productName }} ({{ item.color }}/{{ item.size }}) × {{ item.quantity }} —
          {{ item.lineTotalLabel }}
        </li>
      </ul>
      <RouterLink to="/tum-urunler"><BaseButton>Alışverişe devam</BaseButton></RouterLink>
    </div>
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
  max-width: 640px;
}
</style>
