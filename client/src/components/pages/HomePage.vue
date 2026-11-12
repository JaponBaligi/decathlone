<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import ProductCarousel from '@/components/organisms/ProductCarousel.vue'
import HomePromoBanner from '@/components/molecules/HomePromoBanner.vue'
import MobileAppBanner from '@/components/molecules/MobileAppBanner.vue'
import PopularSports from '@/components/organisms/PopularSports.vue'
import ShoppableMediaTile from '@/components/organisms/ShoppableMediaTile.vue'
import DiscoverMoreGrid from '@/components/organisms/DiscoverMoreGrid.vue'
import ServicesShelf from '@/components/organisms/ServicesShelf.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const data = ref(null)
const error = ref('')

const popularSection = computed(() => data.value?.sections?.find((s) => s.id === 'popular') || null)
const featuredSection = computed(() => data.value?.sections?.find((s) => s.id === 'featured') || null)
const layeredSection = computed(() => data.value?.sections?.find((s) => s.id === 'layered') || null)

const assets = {
  // Homepage campaign creatives
  heroMain:
    'https://contents.mediadecathlon.com/s1504540/k$78d660556c844a975727d1cf2dfaf933/defaut.jpg?format=auto&f=1920x0',
  heroDeals:
    'https://contents.mediadecathlon.com/s1504006/k$807fd950b0955693f4dc6c9c46cb1c14/defaut.jpg?format=auto&f=640x0',
  heroWinter:
    'https://contents.mediadecathlon.com/p2447485/k$dd5e5c8dacb4e4f3220cb6c95e4b3035/defaut.jpg?format=auto&f=640x0',
  highlightApp:
    'https://contents.mediadecathlon.com/s1504004/k$419fd930ebf28dbc2e312b46089dc94e/defaut.jpg?format=auto&f=969x0',
  highlightHome:
    'https://contents.mediadecathlon.com/p2584157/k$5a30ac265bde3bb56cdf9460eba3d100/8051x0/4026pt2947/8051xcr4847/2584157_default.jpg?format=auto&f=969x0',
  highlightMember:
    'https://contents.mediadecathlon.com/s1504821/k$a9072d17c3e891f2ad8d222c66996f02/defaut.jpg?format=auto&f=969x0',
  layeredMedia:
    'https://contents.mediadecathlon.com/p2707939/k$b0c79caff5f1969bfc354a9176608a3a/defaut.jpg?format=auto&f=1920x0',
}

onMounted(async () => {
  try {
    data.value = await api('/catalog/home')
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <div class="home">
    <section v-if="data" class="campaign container">
      <article class="card card--main">
        <img :src="assets.heroMain" alt="Kasım indirimleri" />
        <RouterLink to="/deals" class="card__hit" aria-label="Kasım indirimleri" />
        <div class="card__overlay">
          <div class="card__ctas">
            <RouterLink to="/deals"><BaseButton variant="pill-light">Tüm İndirimler</BaseButton></RouterLink>
            <RouterLink to="/deals/ekipman-indirimleri"><BaseButton variant="pill-light">Ekipman</BaseButton></RouterLink>
            <RouterLink to="/deals/giyim-indirimleri"><BaseButton variant="pill-light">Giyim</BaseButton></RouterLink>
            <RouterLink to="/deals/ayakkabi-indirimleri"><BaseButton variant="pill-light">Ayakkabı</BaseButton></RouterLink>
          </div>
        </div>
      </article>

      <article class="card card--side">
        <img :src="assets.heroDeals" alt="Online özel haftanın indirimleri" />
        <RouterLink
          to="/deals/kasim-indirimleri"
          class="card__hit"
          aria-label="Online özel haftanın indirimleri"
        />
        <div class="card__overlay">
          <div class="card__ctas">
            <RouterLink to="/deals/kasim-indirimleri">
              <BaseButton variant="pill-light">Kasım İndirimleri</BaseButton>
            </RouterLink>
            <RouterLink to="/deals/kasim-ekipman-indirimleri"><BaseButton variant="pill-light">Ekipmanlar</BaseButton></RouterLink>
          </div>
        </div>
      </article>

      <article class="card card--side">
        <img :src="assets.heroWinter" alt="Her havada Decathlon" />
        <RouterLink
          to="/tum-urunler/kis-urunleri"
          class="card__hit"
          aria-label="Her havada Decathlon"
        />
        <div class="card__overlay">
          <h2 class="card__title">Her Havada Decathlon<br />Yanında!</h2>
          <div class="card__ctas">
            <RouterLink to="/tum-urunler/kis-urunleri">
              <BaseButton variant="pill-light">Kış Ürünleri</BaseButton>
            </RouterLink>
            <RouterLink to="/tum-urunler/montlar">
              <BaseButton variant="pill-light">Montlar</BaseButton>
            </RouterLink>
            <RouterLink to="/tum-urunler/polarlar">
              <BaseButton variant="pill-light">Polarlar</BaseButton>
            </RouterLink>
            <RouterLink to="/tum-urunler/ic-giyim">
              <BaseButton variant="pill-light">İçlikler</BaseButton>
            </RouterLink>
          </div>
        </div>
      </article>
    </section>

    <div v-if="error" class="container">{{ error }}</div>

    <section v-if="data" class="container highlights">
      <h2>Haftanın Öne Çıkanları</h2>
      <div class="highlights__grid">
        <article class="promo">
          <img :src="assets.highlightApp" alt="Mobil uygulama" />
          <RouterLink to="/tum-urunler" class="promo__hit" aria-label="Mobil uygulama" />
          <div class="promo__overlay">
            <div class="promo__ctas">
              <RouterLink to="/tum-urunler"><BaseButton variant="pill-light">Keşfet!</BaseButton></RouterLink>
              <a href="https://app.adjust.com/10earbd1" rel="noopener">
                <BaseButton variant="pill-light">Şimdi Decathlon App'i İndir!</BaseButton>
              </a>
            </div>
          </div>
        </article>
        <article class="promo">
          <img :src="assets.highlightHome" alt="Evde spor aletleri" />
          <RouterLink
            to="/ekipmanlar/evde-spor-aletleri"
            class="promo__hit"
            aria-label="Evde spor aletleri"
          />
          <div class="promo__overlay">
            <h3 class="promo__title">Evde Spor Aletleri</h3>
            <div class="promo__ctas">
              <RouterLink to="/ekipmanlar/evde-spor-aletleri">
                <BaseButton variant="pill-light">Ekipmanlar</BaseButton>
              </RouterLink>
              <RouterLink to="/ekipmanlar/kosu-bantlari-eliptik-bisikletler">
                <BaseButton variant="pill-light">Koşu Bantları &amp; Eliptik Bisikletler</BaseButton>
              </RouterLink>
            </div>
          </div>
        </article>
        <article class="promo">
          <img :src="assets.highlightMember" alt="Decathlon Member" />
          <RouterLink to="/tum-urunler" class="promo__hit" aria-label="Decathlon Member" />
          <div class="promo__overlay">
            <div class="promo__ctas">
              <RouterLink to="/tum-urunler"><BaseButton variant="pill-light">Keşfet!</BaseButton></RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section v-if="popularSection" class="container popular">
      <ProductCarousel :title="popularSection.title" :products="popularSection.products" />
    </section>

    <div class="container promo-spot">
      <HomePromoBanner />
    </div>

    <div class="container sports-spot">
      <PopularSports />
    </div>

    <section v-if="featuredSection" class="container featured">
      <ProductCarousel :title="featuredSection.title" :products="featuredSection.products" />
    </section>

    <div v-if="layeredSection" class="layered-spot">
      <ShoppableMediaTile
        :title="layeredSection.title"
        subtitle="Soğuk kış günlerinin favorisi katmanlı giyimi keşfet!"
        :media-url="assets.layeredMedia"
        media-alt="Katmanlı giyim"
        :products="layeredSection.products"
        cta-label="İçlikleri incele!"
        :cta-to="{ name: 'search', query: { q: 'içlik' } }"
      />
    </div>

    <div class="container app-spot">
      <MobileAppBanner />
    </div>

    <div class="container discover-spot">
      <DiscoverMoreGrid />
    </div>

    <div class="services-spot">
      <ServicesShelf />
    </div>
  </div>
</template>

<style scoped>
.home {
  /* Live: Servisler → footer, no trailing product shelf */
  padding-bottom: 0;
}

/* Live promo grid: side cards are 16/10; main spans both rows and stretches */
.campaign {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 4px;
  padding-top: 0; /* live gap is header padding-bottom 16px */
}
.card {
  position: relative;
  overflow: hidden;
  background: #f5f4f5;
  min-height: 0;
}
.card--main {
  grid-column: 1;
  grid-row: 1 / span 2;
  height: 100%;
}
.card--side {
  grid-column: 2;
  aspect-ratio: 16 / 10;
}
.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card__hit {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.card__overlay {
  /* Live promo-card__content: bottom band only, not full-card */
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
  padding: 100px 40px 32px;
  /* transparent at top of band → 54% black at 100px, then holds to bottom */
  background: linear-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.54) 100px);
  pointer-events: none;
}
.card--side .card__overlay {
  padding: 100px 32px 32px;
}
.card__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  pointer-events: auto;
}
.card__title {
  margin: 0;
  color: #fff;
  font-family: 'Decathlon VF', Inter, sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: normal;
  max-width: none;
}

.highlights {
  padding-top: 128px;
}
.highlights h2 {
  /* Live vp-title-m */
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
  margin: 0 0 32px;
}
.highlights__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.promo {
  position: relative;
  overflow: hidden;
  background: #f5f4f5;
  /* Live promo-card-grid__cards--3: aspect-ratio 1.25 */
  aspect-ratio: 1.25 / 1;
}
.promo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.promo__hit {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.promo__overlay {
  /* Live promo-card__content: CTA band only — creatives are baked into images */
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
.promo__title {
  /* Live vp-title-s on photo cards only */
  margin: 0;
  color: #fff;
  font-family: var(--font-sans);
  font-size: 22px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.promo__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  pointer-events: auto;
}
.popular {
  /* Live: ~128px below highlights cards */
  padding-top: 128px;
}
.promo-spot {
  /* Live: ~128px below Popüler Ürünler shelf */
  padding-top: 128px;
}
.sports-spot {
  /* Live: ~128px below yellow promo banner */
  padding-top: 128px;
}
.featured {
  /* Live: shelf after Popüler Sporlar */
  padding-top: 128px;
}
.layered-spot {
  /* Live shoppable-media is full-bleed */
  padding-top: 128px;
}
.app-spot {
  padding-top: 64px;
}
.discover-spot {
  padding-top: 128px;
}
.services-spot {
  /* Live content-shelf sits full-bleed after discover */
  padding-top: 128px;
}
@media (max-width: 980px) {
  .campaign {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .card--main,
  .card--side {
    grid-column: 1;
    grid-row: auto;
  }
}
</style>
