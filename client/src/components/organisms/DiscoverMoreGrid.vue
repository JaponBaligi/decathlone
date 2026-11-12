<script setup>
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const cards = [
  {
    title: 'Çantalar',
    to: '/tum-sporlar',
    image:
      'https://contents.mediadecathlon.com/s1498496/k$2f0a195dc2abc13f1f11c1b1784b11ad/defaut.jpg?format=auto&f=969x0',
  },
  {
    title: 'Çoraplar',
    to: { name: 'search', query: { q: 'çorap' } },
    image:
      'https://contents.mediadecathlon.com/s1498494/k$da648d064d74f603a4852a5c20f66005/defaut.jpg?format=auto&f=969x0',
  },
  {
    title: 'Şemsiyeler',
    to: { name: 'search', query: { q: 'şemsiye' } },
    image:
      'https://contents.mediadecathlon.com/s1498495/k$e3fb7393d9132d8b1b4ae128edc8489e/defaut.jpg?format=auto&f=969x0',
  },
  {
    title: 'Termoslar & Mataralar',
    to: { name: 'search', query: { q: 'termos' } },
    image:
      'https://contents.mediadecathlon.com/s1498493/k$33f9b56d025e32e61188eb2d2e86c688/defaut.jpg?format=auto&f=969x0',
  },
]
</script>

<template>
  <section class="discover" aria-label="Daha Fazlasını Keşfedin">
    <h2 class="discover__title">Daha Fazlasını Keşfedin</h2>
    <div class="discover__grid">
      <article v-for="card in cards" :key="card.title" class="discover__card">
        <img :src="card.image" :alt="card.title" loading="lazy" />
        <div class="discover__overlay">
          <h3 class="discover__card-title">{{ card.title }}</h3>
          <div class="discover__cta">
            <RouterLink :to="card.to">
              <BaseButton variant="pill-light">Keşfet!</BaseButton>
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.discover__title {
  margin: 0 0 32px;
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.discover__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
}
.discover__card {
  position: relative;
  overflow: hidden;
  background: #f5f4f5;
  aspect-ratio: 5 / 4;
}
.discover__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.discover__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 16px;
  padding: 80px 24px 24px;
  background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.54) 100px);
  pointer-events: none;
}
.discover__card-title {
  margin: 0;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  font-variation-settings: 'opsz' 24;
}
.discover__cta {
  pointer-events: auto;
}

@media (max-width: 1100px) {
  .discover__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .discover__title {
    font-size: 26px;
    line-height: 32px;
  }
  .discover__grid {
    grid-template-columns: 1fr;
  }
}
</style>
