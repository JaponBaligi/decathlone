<script setup>
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

/** Waterproof highlight tiles for the home page. */
const tiles = [
  {
    title: 'Suya Dayanıklı Ürünler',
    to: '/tum-urunler/su-gecirmezler',
    image:
      'https://contents.mediadecathlon.com/s1498495/k$e3fb7393d9132d8b1b4ae128edc8489e/defaut.jpg?format=auto&f=969x0',
  },
  {
    title: 'Yağmurluklar',
    to: '/tum-urunler/yagmurluklar',
    image:
      'https://contents.mediadecathlon.com/p2907617/k$d182c8f2864401ec0cd5a9861e0ee0d1/picture.jpg?format=auto&f=640x0',
  },
  {
    title: 'Botlar & Çizmeler',
    to: '/tum-urunler/su-gecirmez-ayakkabilar',
    image:
      'https://contents.mediadecathlon.com/p2715737/k$486b5fd2ea21d43c63441f59a5ad44cb/defaut.jpg?format=auto&f=800x0',
  },
]
</script>

<template>
  <section class="waterproof" aria-labelledby="waterproof-heading">
    <h2 id="waterproof-heading" class="waterproof__title">Su Geçirmezleri Keşfet!</h2>
    <div class="waterproof__grid">
      <article v-for="tile in tiles" :key="tile.to" class="waterproof__card">
        <img :src="tile.image" :alt="tile.title" loading="lazy" />
        <RouterLink :to="tile.to" class="waterproof__hit" :aria-label="tile.title" />
        <div class="waterproof__overlay">
          <div class="waterproof__ctas">
            <RouterLink :to="tile.to">
              <BaseButton variant="pill-light">{{ tile.title }}</BaseButton>
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.waterproof__title {
  margin: 0 0 32px;
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.waterproof__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}
.waterproof__card {
  position: relative;
  overflow: hidden;
  background: #f5f4f5;
  aspect-ratio: 1.25 / 1;
}
.waterproof__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.waterproof__hit {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.waterproof__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
  padding: 100px 32px 32px;
  background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.54) 100px);
  pointer-events: none;
}
.waterproof__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  pointer-events: auto;
}

@media (max-width: 900px) {
  .waterproof__grid {
    grid-template-columns: 1fr;
  }
  .waterproof__title {
    font-size: 26px;
    line-height: 32px;
  }
  .waterproof__overlay {
    padding: 64px 24px 24px;
  }
}
</style>
