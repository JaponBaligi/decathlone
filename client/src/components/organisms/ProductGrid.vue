<script setup>
import ProductCard from '@/components/molecules/ProductCard.vue'

defineProps({
  products: { type: Array, default: () => [] },
  title: String,
  /** Live /deals: 4 cols (filters open or closed) */
  columns: { type: Number, default: 4 },
})
</script>

<template>
  <section class="grid-wrap">
    <h2 v-if="title">{{ title }}</h2>
    <div
      v-if="products.length"
      class="grid"
      :style="{ '--cols': String(columns) }"
    >
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <p v-else class="empty">Ürün bulunamadı.</p>
  </section>
</template>

<style scoped>
.grid-wrap h2 {
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
}
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
  /* Live product-list gap ≈ 24px row / 8px column */
  gap: 24px 8px;
}
.empty {
  color: var(--color-muted);
}
@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 800px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
