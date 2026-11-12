<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Live content-shelf--inverted / three-up service cards:
 * default scale 0.9 → active 1 (600ms), media zoom 1.05,
 * expandable description via + / title toggle.
 */
const services = [
  {
    title: 'Buy Back',
    body: 'İyi ve temiz durumda olan Decathlon marka ekipmanlarınızı hediye çeki karşılığında hemen satın alıyoruz.',
    cta: 'Fiyat teklifi almak için tıklayın!',
    to: '/sayfa/iade-politikasi',
    image:
      'https://contents.mediadecathlon.com/s1487682/k$5ed2caf2cd3be7a2c402995096185114/defaut.jpg?format=auto&f=1200x0',
  },
  {
    title: 'Kişiselleştirme',
    body: 'Kişiselleştirme stüdyolarımızda nakış, lazer baskı, sıcak baskı ve patch baskı dahil birçok kişiselleştirme hizmeti alabilirsiniz.',
    cta: 'Tüm kişiselleştirme hizmetlerini incelemek için tıklayın!',
    to: '/sayfa/atolye',
    image:
      'https://contents.mediadecathlon.com/s1487683/k$b839be28682213403182225fbdca1fef/defaut.jpg?format=auto&f=1200x0',
  },
  {
    title: 'Kurumsal Satış',
    body: 'Eğitim kurumları, kulüpler ve diğer tüm kuruluşlar için toplu ürün alımlarınızda sizlere özel destek sağlıyoruz.',
    cta: 'Detaylı bilgi almak ve teklif oluşturmak için tıklayın!',
    to: '/sayfa/bize-ulasin',
    image:
      'https://contents.mediadecathlon.com/s1487684/k$beef2fbe7018b7001a248e404767134e/defaut.jpg?format=auto&f=1200x0',
  },
]

const active = ref(0)
const open = ref(-1)

function activate(i) {
  active.value = i
}

function toggleOpen(i, e) {
  e?.preventDefault?.()
  e?.stopPropagation?.()
  open.value = open.value === i ? -1 : i
  active.value = i
}
</script>

<template>
  <section class="services" aria-label="Servisler">
    <div class="services__inner">
      <h2 class="services__title">Servisler</h2>

      <div
        class="services__row"
        :class="`services__row--active-${active}`"
        role="group"
        aria-roledescription="carousel"
        aria-label="İçerik Görüntüleyici"
      >
        <article
          v-for="(service, i) in services"
          :key="service.title"
          class="services__item"
          :class="{ 'services__item--active': i === active }"
          @mouseenter="activate(i)"
          @focusin="activate(i)"
        >
          <div class="services__card" :class="{ 'services__card--open': open === i }">
            <div class="services__media">
              <img :src="service.image" :alt="service.title" loading="lazy" />
            </div>

            <div class="services__toggle">
              <div class="services__footer">
                <button
                  type="button"
                  class="services__name"
                  :aria-expanded="open === i"
                  @click="toggleOpen(i, $event)"
                >
                  <h3>{{ service.title }}</h3>
                </button>

                <div class="services__desc" :class="{ 'services__desc--open': open === i }">
                  <div class="services__desc-inner">
                    <p>{{ service.body }}</p>
                    <RouterLink :to="service.to" class="services__cta" tabindex="-1">
                      {{ service.cta }}
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
                </div>
              </div>

              <button
                type="button"
                class="services__plus"
                :aria-label="open === i ? 'Kapat' : 'Detayları aç'"
                :aria-expanded="open === i"
                tabindex="-1"
                @click="toggleOpen(i, $event)"
              >
                <svg
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke-width="1.5"
                  aria-hidden="true"
                  :class="{ 'services__plus-icon--open': open === i }"
                >
                  <path d="M12 4V20M20 12H4" stroke="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  /* Live content-shelf--inverted ≈ 0.92vh (padding, not margin — avoid collapse) */
  background: var(--color-brand);
  color: #fff;
  padding: 96px 80px;
  box-sizing: border-box;
}
.services__inner {
  width: 100%;
}
.services__title {
  margin: 0 0 32px;
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  color: #fff;
  font-variation-settings: 'opsz' 30;
}
.services__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0;
}
.services__item {
  /*
   * Live three-up:
   * inline-size 36% + flex-shrink so three fit; space-between;
   * default scale 0.9, active 1; transform-origin follows active index
   * (first/last child keep left/right) so visual gutters stay even.
   */
  flex: 0 1 auto;
  width: 36%;
  scale: 0.9;
  transform-origin: center bottom;
  transition:
    scale 600ms cubic-bezier(0.42, 0, 0.58, 1),
    transform-origin 600ms cubic-bezier(0.42, 0, 0.58, 1);
}
.services__item:first-child {
  transform-origin: left bottom;
}
.services__item:last-child {
  transform-origin: right bottom;
}
.services__row--active-0 .services__item {
  transform-origin: right bottom;
}
.services__row--active-0 .services__item:first-child {
  transform-origin: left bottom;
}
.services__row--active-1 .services__item {
  transform-origin: center bottom;
}
.services__row--active-1 .services__item:first-child {
  transform-origin: left bottom;
}
.services__row--active-1 .services__item:last-child {
  transform-origin: right bottom;
}
.services__row--active-2 .services__item {
  transform-origin: left bottom;
}
.services__row--active-2 .services__item:last-child {
  transform-origin: right bottom;
}
.services__item--active {
  scale: 1;
}
.services__card {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #2b3494;
}
.services__media {
  position: absolute;
  inset: 0;
  transform: scale(1);
  transform-origin: center center;
  transition: transform 600ms cubic-bezier(0.42, 0, 0.58, 1);
}
.services__item--active .services__media,
.services__card:hover .services__media {
  transform: scale(1.05);
}
.services__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.services__media::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(18deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0) 50%);
}
.services__media::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transition: opacity 250ms cubic-bezier(0.42, 0, 0.58, 1);
}
.services__card--open .services__media::before {
  opacity: 1;
}
.services__toggle {
  position: absolute;
  inset: 32px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
}
.services__footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: calc(100% - 40px);
  pointer-events: auto;
}
.services__name {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: #fff;
  cursor: pointer;
  text-align: left;
}
.services__name h3 {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  font-variation-settings: 'opsz' 24;
}
.services__desc {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 250ms cubic-bezier(0.42, 0, 0.58, 1),
    opacity 250ms cubic-bezier(0.42, 0, 0.58, 1);
}
.services__desc--open {
  grid-template-rows: 1fr;
  opacity: 1;
  padding-bottom: 8px;
}
.services__desc-inner {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.services__desc-inner p {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}
.services__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
}
.services__cta:hover {
  text-decoration: underline;
}
.services__plus {
  position: absolute;
  right: 0;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  pointer-events: auto;
}
.services__plus-icon--open {
  transform: rotate(45deg);
}
.services__plus svg {
  transition: transform 250ms cubic-bezier(0.42, 0, 0.58, 1);
}

@media (max-width: 1100px) {
  .services {
    padding: 64px 32px;
  }
}
@media (max-width: 800px) {
  .services {
    padding: 48px 16px;
  }
  .services__row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  .services__item,
  .services__item--active {
    flex: none;
    width: 100%;
    scale: 1;
    transform-origin: center bottom;
  }
  .services__card {
    aspect-ratio: 16 / 10;
  }
}

@media (prefers-reduced-motion: reduce) {
  .services__item,
  .services__media,
  .services__desc,
  .services__plus svg,
  .services__media::before {
    transition: none;
  }
}
</style>
