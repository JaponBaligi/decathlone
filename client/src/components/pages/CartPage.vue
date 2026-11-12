<script setup>
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'
import CartLineItem from '@/components/molecules/CartLineItem.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const cart = useCartStore()
const { items, itemCount, subtotalLabel, loading } = storeToRefs(cart)
</script>

<template>
  <div class="container cart">
    <h1>Sepetim</h1>
    <p v-if="loading">Yükleniyor…</p>
    <template v-else-if="items.length">
      <CartLineItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @update-qty="cart.updateQty(item.id, $event)"
        @remove="cart.removeItem(item.id)"
      />
      <aside class="summary">
        <p>{{ itemCount }} ürün</p>
        <h2>Ara toplam: {{ subtotalLabel }}</h2>
        <RouterLink to="/odeme">
          <BaseButton block>Ödemeye Geç</BaseButton>
        </RouterLink>
      </aside>
    </template>
    <div v-else class="empty">
      <p>Sepetiniz boş.</p>
      <RouterLink to="/tum-urunler"><BaseButton>Alışverişe Başla</BaseButton></RouterLink>
    </div>
  </div>
</template>

<style scoped>
.cart {
  padding-block: var(--space-5);
}
.summary {
  margin-top: var(--space-5);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  max-width: 360px;
  margin-left: auto;
}
.empty {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
}
</style>
