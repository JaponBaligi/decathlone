<script setup>
defineProps({
  priceLabel: { type: String, required: true },
  compareAtLabel: { type: String, default: null },
  discountPercent: { type: Number, default: null },
  size: { type: String, default: 'md' },
})
</script>

<template>
  <div class="price" :class="[`price--${size}`, { 'price--sale': !!compareAtLabel }]">
    <span class="price__current">{{ priceLabel }}</span>
    <span v-if="compareAtLabel" class="price__compare">{{ compareAtLabel }}</span>
    <span v-if="discountPercent" class="price__off">%{{ discountPercent }} indirim</span>
  </div>
</template>

<style scoped>
.price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}
.price__current {
  font-weight: 700;
  font-size: 16px;
  color: var(--color-ink);
}
.price--sale .price__current {
  /* Live vp-price-amount--sale */
  background: var(--color-deal);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  padding: 0 2px;
}
.price__compare {
  color: var(--color-muted);
  text-decoration: line-through;
  font-size: 13px;
  font-weight: 500;
}
.price__off {
  color: var(--color-deal);
  font-weight: 700;
  font-size: 13px;
}
.price--lg .price__current {
  font-size: 28px;
  letter-spacing: -0.02em;
}
</style>
