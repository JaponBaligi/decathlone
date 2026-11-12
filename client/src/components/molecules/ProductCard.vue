<script setup>
import { RouterLink } from 'vue-router'
import BaseBadge from '@/components/atoms/BaseBadge.vue'
import PriceTag from '@/components/atoms/PriceTag.vue'
import RatingStars from '@/components/atoms/RatingStars.vue'

defineProps({
  product: { type: Object, required: true },
  /** Live shoppable-media tiles: image + title + price only */
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <article class="card" :class="{ 'card--compact': compact }">
    <RouterLink :to="{ name: 'product', params: { slug: product.slug } }" class="card__link">
      <div class="card__media">
        <img :src="product.imageUrl" :alt="product.name" loading="lazy" width="400" height="400" />
        <div v-if="!compact" class="card__badges">
          <BaseBadge v-if="product.isDeal" tone="deal">İndirim</BaseBadge>
          <BaseBadge v-if="product.isNew" tone="new">Yeni</BaseBadge>
        </div>
      </div>
      <div class="card__body">
        <p v-if="!compact" class="card__brand">{{ product.brand }}</p>
        <h3 class="card__title">{{ product.name }}</h3>
        <RatingStars v-if="!compact" :rating="product.rating" :count="product.reviewCount" />
        <p v-if="!compact" class="card__price-label">Güncel fiyat</p>
        <PriceTag
          :price-label="product.priceLabel"
          :compare-at-label="compact ? null : product.compareAtLabel"
          :discount-percent="compact ? null : product.discountPercent"
        />
        <p v-if="!compact && product.freeStorePickup" class="card__perk">Mağazadan Ücretsiz Teslimat</p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.card {
  background: transparent;
  height: 100%;
}
.card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: inherit;
}
.card__media {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-canvas-soft);
  overflow: hidden;
  border-radius: 4px;
}
.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card__badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}
.card__body {
  /* Live product-card details under 1:1 media ≈ 141px (573 − 432) */
  padding-top: 6px;
  display: grid;
  gap: 0;
}
.card__brand {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  text-transform: uppercase;
}
.card__title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
  min-height: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__price-label {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-muted);
}
.card__perk {
  margin: 2px 0 0;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 600;
}
.card--compact .card__body {
  padding-top: 8px;
  gap: 2px;
}
.card--compact .card__title {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.35;
  min-height: 0;
  -webkit-line-clamp: 2;
}
</style>
