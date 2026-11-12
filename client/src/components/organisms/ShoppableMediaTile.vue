<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from '@/components/molecules/ProductCard.vue'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  mediaUrl: { type: String, required: true },
  mediaAlt: { type: String, default: '' },
  products: { type: Array, default: () => [] },
  ctaLabel: { type: String, default: '' },
  ctaTo: { type: [String, Object], default: '/' },
})
</script>

<template>
  <!-- Live shoppable-media-tile: 50% left media + ~608px right product column -->
  <section class="shoppable" :aria-label="title">
    <div class="shoppable__media" aria-hidden="true">
      <img :src="mediaUrl" :alt="mediaAlt" loading="lazy" />
    </div>
    <div class="shoppable__content">
      <div class="shoppable__headline">
        <h2 class="shoppable__title">{{ title }}</h2>
        <p v-if="subtitle" class="shoppable__subtitle">{{ subtitle }}</p>
      </div>
      <div class="shoppable__products">
        <ProductCard v-for="p in products" :key="p.id" :product="p" compact />
      </div>
      <RouterLink v-if="ctaLabel" :to="ctaTo" class="shoppable__cta">
        {{ ctaLabel }}
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path d="M9 18L15 12L9 6" stroke="currentColor" />
        </svg>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.shoppable {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: #fff;
}
.shoppable__media {
  flex: 0 0 50%;
  position: relative;
  overflow: hidden;
  background: #f5f4f5;
  /* Live aspect-ratio--4-5 */
  aspect-ratio: 4 / 5;
}
.shoppable__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.shoppable__content {
  flex: 0 0 608px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding: 0;
  max-width: 608px;
  width: 100%;
  box-sizing: border-box;
}
.shoppable__headline {
  padding: 0 80px 40px;
  max-width: 100%;
}
.shoppable__title {
  margin: 0 0 8px;
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.shoppable__subtitle {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--color-ink);
}
.shoppable__products {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px 4px;
  padding: 0 0 40px;
}
.shoppable__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  color: var(--color-brand);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
}
.shoppable__cta:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .shoppable__content {
    flex-basis: min(608px, 48%);
  }
  .shoppable__headline {
    padding: 0 40px 32px;
  }
}

@media (max-width: 980px) {
  .shoppable {
    flex-direction: column;
  }
  .shoppable__media {
    flex: none;
    width: 100%;
    aspect-ratio: 4 / 5;
    max-height: 520px;
  }
  .shoppable__content {
    flex: none;
    width: 100%;
    max-width: none;
    padding: 32px 16px 40px;
  }
  .shoppable__headline {
    padding: 0 0 24px;
  }
  .shoppable__products {
    padding-bottom: 24px;
  }
}

@media (max-width: 600px) {
  .shoppable__title {
    font-size: 26px;
    line-height: 32px;
  }
}
</style>
