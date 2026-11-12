<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import RatingStars from '@/components/atoms/RatingStars.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import ProductGrid from '@/components/organisms/ProductGrid.vue'

const props = defineProps({ slug: String })
const product = ref(null)
const color = ref('')
const size = ref('')
const qty = ref(1)
const message = ref('')
const error = ref('')
const activeImage = ref(0)
const lightboxOpen = ref(false)
const addedFlash = ref(false)
const openAccordion = ref('description')
const cart = useCartStore()
const auth = useAuthStore()

const selectedVariant = computed(() => {
  if (!product.value) return null
  return product.value.variants.find((v) => v.color === color.value && v.size === size.value)
})

/** Deduplicate gallery URLs that only differ by size query params. */
const galleryImages = computed(() => {
  const raw = product.value?.images || []
  const seen = new Set()
  const unique = []
  for (const img of raw) {
    let key = img.url
    try {
      key = new URL(img.url).pathname
    } catch {
      /* keep raw */
    }
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(img)
  }
  if (unique.length) return unique
  if (product.value?.imageUrl) return [{ url: product.value.imageUrl, sortOrder: 0 }]
  return []
})

const savingsLabel = computed(() => {
  const p = product.value
  if (!p?.compareAtKurus || !p?.priceKurus) return null
  const diff = p.compareAtKurus - p.priceKurus
  if (diff <= 0) return null
  return formatKurus(diff)
})

const installmentLabel = computed(() => {
  const p = product.value
  if (!p?.priceKurus) return null
  return formatKurus(Math.round(p.priceKurus / 8))
})

const maxQty = computed(() => Math.max(1, selectedVariant.value?.stock || 1))

const breadcrumbs = computed(() => {
  const p = product.value
  if (!p) return []
  const crumbs = [{ label: 'Sporlar', to: '/tum-sporlar' }]
  if (p.sportSlug) {
    crumbs.push({
      label: prettyTitle(p.sportName || p.sportSlug),
      to: `/spor/${p.sportSlug}`,
    })
  }
  if (p.categorySlug) {
    crumbs.push({
      label: prettyTitle(p.categoryName || p.categorySlug),
      to: p.sportSlug ? `/spor/${p.sportSlug}` : `/kategori/${p.categorySlug}`,
    })
  }
  return crumbs
})

const isMarketplace = computed(() => String(product.value?.slug || '').startsWith('mp'))

const perks = computed(() => {
  const list = [
    {
      id: 'return',
      title: isMarketplace.value
        ? 'Üyeler için 14 gün iade süresi'
        : '60 gün iade',
      body: isMarketplace.value
        ? 'Fikrini mi değiştirdin? Ürünleri 14 gün içinde satıcının belirlediği kargo firmasını kullanarak doğrudan satıcıya iade edebilirsin.'
        : 'Decathlon hesabınızla yaptığınız nakit ödemelerde fiş olmadan kolayca iade veya değişim yapabilirsiniz.',
    },
  ]
  if (product.value?.freeStorePickup) {
    list.push({
      id: 'pickup',
      title: 'Ücretsiz mağazadan teslimat',
      body: 'Kargo ücreti ödemeden siparişini Mağazaya Teslimat seçeneğiyle tamamlayabilir, ürünlerini seçtiğin mağazadan teslim alabilirsin.',
    })
  }
  if (isMarketplace.value) {
    list.push({
      id: 'seller',
      title: "Doğrulanmış satıcı",
      body: 'Ekstra güvence için doğrulanmış satıcılarımızdan alışveriş yap.',
    })
    list.push({
      id: 'online',
      title: "Online'a özel",
      body: 'Sadece online satışta olan özel ürünler. İstediğin yerden alışveriş yap ve teslimat şeklini seç.',
    })
  } else {
    list.push({
      id: 'warranty',
      title: '2 yıl garanti',
      body: "Decathlon'dan aldığınız ürünlerin standart garantisi 2 yıl olup, bazı ürünler ek garantiden faydalanabilir.",
    })
  }
  return list
})

function formatKurus(kurus) {
  const lira = (Number(kurus) || 0) / 100
  const whole = Number.isInteger(lira)
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(lira)
}

function prettyTitle(value) {
  if (!value) return ''
  return String(value).replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatOption(value) {
  if (!value) return ''
  if (value === 'NO SIZE') return 'NO SIZE'
  return String(value).replace(/_/g, ' / ')
}

function selectImage(index) {
  activeImage.value = index
}

function openLightbox(index = activeImage.value) {
  activeImage.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function stepLightbox(delta) {
  const n = galleryImages.value.length
  if (!n) return
  activeImage.value = (activeImage.value + delta + n) % n
}

function onKeydown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') stepLightbox(1)
  if (e.key === 'ArrowLeft') stepLightbox(-1)
}

function bumpQty(delta) {
  qty.value = Math.min(maxQty.value, Math.max(1, qty.value + delta))
}

async function load() {
  product.value = await api(`/catalog/products/${props.slug}`)
  color.value = product.value.colors[0] || ''
  size.value = product.value.sizes[0] || ''
  qty.value = 1
  activeImage.value = 0
  message.value = ''
  error.value = ''
  addedFlash.value = false
  openAccordion.value = 'description'
}

async function addToCart() {
  error.value = ''
  if (!selectedVariant.value) {
    error.value = 'Renk ve beden seçin.'
    return
  }
  try {
    await cart.addItem(selectedVariant.value.id, qty.value)
    message.value = 'Ürün sepetinize eklendi!'
    addedFlash.value = true
    window.setTimeout(() => {
      addedFlash.value = false
    }, 1600)
  } catch (e) {
    error.value = e.message
  }
}

async function toggleWishlist() {
  if (!auth.isAuthenticated) {
    error.value = 'Favoriler için giriş yapın.'
    return
  }
  await api(`/wishlist/${product.value.id}`, { method: 'POST' })
  message.value = 'Favorilere eklendi.'
}

function toggleAccordion(id) {
  openAccordion.value = openAccordion.value === id ? '' : id
}

watch(maxQty, (max) => {
  if (qty.value > max) qty.value = max
})

onMounted(() => {
  load()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
watch(() => props.slug, load)
</script>

<template>
  <div v-if="product" class="container pdp">
    <nav v-if="breadcrumbs.length" class="pdp__crumbs" aria-label="Breadcrumb">
      <ol>
        <li v-for="(crumb, i) in breadcrumbs" :key="crumb.label">
          <RouterLink :to="crumb.to">{{ crumb.label }}</RouterLink>
          <span v-if="i < breadcrumbs.length - 1" aria-hidden="true">›</span>
        </li>
      </ol>
    </nav>

    <div class="pdp__grid">
      <section class="gallery" aria-label="Ürün görselleri">
        <div
          class="gallery__mosaic"
          :class="{ 'gallery__mosaic--single': galleryImages.length === 1 }"
        >
          <button
            v-for="(img, i) in galleryImages"
            :key="img.url + i"
            type="button"
            class="gallery__tile"
            :class="{
              'gallery__tile--active': activeImage === i,
              'gallery__tile--wide': galleryImages.length > 2 && i === 0,
            }"
            :aria-label="`${product.name} ${i + 1}/${galleryImages.length}`"
            @click="openLightbox(i)"
            @mouseenter="selectImage(i)"
            @focus="selectImage(i)"
          >
            <img :src="img.url" :alt="`${product.name} ${i + 1}`" loading="lazy" />
          </button>
        </div>
        <button type="button" class="gallery__open" @click="openLightbox(activeImage)">
          Medya galerisini aç
        </button>
      </section>

      <aside class="buy">
        <div class="buy__top">
          <div class="buy__badges">
            <span v-if="product.isDeal" class="buy__deal-badge">İNDİRİM</span>
            <span v-if="product.isNew" class="buy__new-badge">Yeni</span>
          </div>
          <RouterLink
            v-if="product.brandSlug"
            class="buy__brand"
            :to="{ name: 'search', query: { q: product.brand } }"
          >
            {{ product.brand }}
          </RouterLink>
          <p v-else class="buy__brand">{{ product.brand }}</p>
          <div class="buy__title-row">
            <h1>{{ product.name }}</h1>
            <button
              type="button"
              class="buy__wish"
              aria-label="Favorilere ekle"
              @click="toggleWishlist"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M12 20s-7-4.35-7-9.2A3.8 3.8 0 0 1 12 7.2a3.8 3.8 0 0 1 7 3.6C19 15.65 12 20 12 20Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
              </svg>
            </button>
          </div>
          <div class="buy__meta">
            <RatingStars :rating="product.rating" :count="product.reviewCount" />
          </div>
          <p class="buy__desc">{{ product.description }}</p>
        </div>

        <div class="buy__options">
          <p class="buy__option">
            <span class="buy__option-label">Renk</span>
            <span class="buy__option-value">{{ formatOption(color) }}</span>
          </p>
          <div v-if="product.colors.length > 1" class="chips">
            <button
              v-for="c in product.colors"
              :key="c"
              type="button"
              :class="{ active: color === c }"
              @click="color = c"
            >
              {{ formatOption(c) }}
            </button>
          </div>

          <p class="buy__option">
            <span class="buy__option-label">Beden</span>
            <span class="buy__option-value">{{ formatOption(size) }}</span>
          </p>
          <div v-if="product.sizes.length > 1" class="chips">
            <button
              v-for="s in product.sizes"
              :key="s"
              type="button"
              :class="{ active: size === s }"
              @click="size = s"
            >
              {{ formatOption(s) }}
            </button>
          </div>
        </div>

        <div class="buy__qty" role="group" aria-label="Ürün miktarı">
          <button type="button" :disabled="qty <= 1" aria-label="Decrease value" @click="bumpQty(-1)">
            −
          </button>
          <input
            :value="qty"
            type="number"
            min="1"
            :max="maxQty"
            :aria-label="`Ürün miktarı: ${qty}`"
            @change="qty = Math.min(maxQty, Math.max(1, Number($event.target.value) || 1))"
          />
          <button
            type="button"
            :disabled="qty >= maxQty"
            aria-label="Increase value"
            @click="bumpQty(1)"
          >
            +
          </button>
        </div>

        <div class="buy__price" :class="{ 'buy__price--sale': !!product.compareAtLabel }">
          <div class="buy__price-main">
            <span class="buy__price-current">{{ product.priceLabel }}</span>
            <span class="buy__price-unit">/adet</span>
          </div>
          <div v-if="product.compareAtLabel" class="buy__price-side">
            <span class="buy__price-compare">{{ product.compareAtLabel }}</span>
            <span v-if="savingsLabel" class="buy__price-save">{{ savingsLabel }} indirim</span>
          </div>
        </div>
        <p v-if="installmentLabel" class="buy__installment">
          Veya ödeme planlarıyla
          <button type="button" class="buy__installment-link">aylık {{ installmentLabel }}</button>
        </p>
        <p v-if="selectedVariant" class="buy__stock">
          Kampanya stokundan {{ selectedVariant.stock }} adet ürün mevcuttur.
        </p>

        <BaseButton
          class="buy__cta"
          :class="{ 'buy__cta--flash': addedFlash }"
          variant="brand"
          block
          @click="addToCart"
        >
          {{ addedFlash ? 'Sepete eklendi' : 'Sepete ekle' }}
        </BaseButton>
        <p v-if="message" class="ok" role="status">{{ message }}</p>
        <p v-if="error" class="err" role="alert">{{ error }}</p>

        <p v-if="isMarketplace" class="buy__seller">Satan ve gönderen: Marketplace satıcı</p>
        <p class="buy__sku">Ref: {{ product.sku }}</p>

        <ul class="buy__perks">
          <li v-for="perk in perks" :key="perk.id">
            <button type="button" class="buy__perk-btn" @click="toggleAccordion(`perk-${perk.id}`)">
              <span>{{ perk.title }}</span>
              <span class="buy__chevron" :class="{ open: openAccordion === `perk-${perk.id}` }">
                +
              </span>
            </button>
            <div
              class="buy__perk-body"
              :class="{ open: openAccordion === `perk-${perk.id}` }"
            >
              <p>{{ perk.body }}</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>

    <section class="details" aria-label="Ürün bilgileri">
      <div
        v-for="panel in [
          {
            id: 'description',
            title: 'Açıklama',
            body: product.description,
          },
          {
            id: 'tech',
            title: 'Teknik özellikler',
            body: `Marka: ${product.brand}\nKategori: ${product.categoryName || '—'}\nSpor: ${product.sportName || '—'}\nSKU: ${product.sku}`,
          },
          {
            id: 'care',
            title: 'Kullanım ve bakım',
            body: 'Ürünü kullanım kılavuzuna uygun şekilde kullanın. Nemli bir bezle temizleyebilir, doğrudan ısı ve kesici yüzeylerden uzak tutabilirsiniz.',
          },
        ]"
        :key="panel.id"
        class="details__item"
      >
        <button type="button" class="details__btn" @click="toggleAccordion(panel.id)">
          <h2>{{ panel.title }}</h2>
          <span class="buy__chevron" :class="{ open: openAccordion === panel.id }">+</span>
        </button>
        <div class="details__body" :class="{ open: openAccordion === panel.id }">
          <p class="details__text">{{ panel.body }}</p>
        </div>
      </div>
    </section>

    <ProductGrid title="Benzer Ürünler" :products="product.related" />

    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Medya galerisi"
        @click.self="closeLightbox"
      >
        <button type="button" class="lightbox__close" aria-label="Kapat" @click="closeLightbox">
          ×
        </button>
        <button
          type="button"
          class="lightbox__nav lightbox__nav--prev"
          aria-label="Önceki"
          @click="stepLightbox(-1)"
        >
          ‹
        </button>
        <img
          :key="galleryImages[activeImage]?.url"
          class="lightbox__img"
          :src="galleryImages[activeImage]?.url"
          :alt="product.name"
        />
        <button
          type="button"
          class="lightbox__nav lightbox__nav--next"
          aria-label="Sonraki"
          @click="stepLightbox(1)"
        >
          ›
        </button>
        <p class="lightbox__count">{{ activeImage + 1 }} / {{ galleryImages.length }}</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.pdp {
  padding-block: var(--space-4) var(--space-7);
  display: grid;
  gap: var(--space-7);
}
.pdp__crumbs ol {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0 0 var(--space-3);
  padding: 0;
  font-size: 13px;
  color: var(--color-muted);
}
.pdp__crumbs a {
  color: var(--color-muted);
  text-decoration: none;
}
.pdp__crumbs a:hover {
  color: var(--color-ink);
  text-decoration: underline;
}
.pdp__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: var(--space-6);
  align-items: start;
}

.gallery {
  display: grid;
  gap: var(--space-3);
}
.gallery__mosaic {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.gallery__mosaic--single {
  grid-template-columns: 1fr;
}
.gallery__tile {
  position: relative;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--color-canvas-soft);
  overflow: hidden;
  cursor: zoom-in;
  aspect-ratio: 1;
}
.gallery__tile--wide {
  grid-column: 1 / -1;
  aspect-ratio: 16 / 10;
}
.gallery__tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 420ms cubic-bezier(0.3, 0, 0.1, 1), opacity 220ms ease;
}
.gallery__tile:hover img,
.gallery__tile--active img {
  transform: scale(1.03);
}
.gallery__open {
  justify-self: start;
  border: 0;
  background: transparent;
  color: var(--color-brand);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.buy {
  position: sticky;
  top: 12px;
  display: grid;
  gap: var(--space-4);
  align-content: start;
}
.buy__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.buy__deal-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 8px;
  background: var(--color-brand-soft);
  color: var(--color-brand);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.buy__new-badge {
  display: inline-flex;
  padding: 4px 8px;
  background: var(--color-brand);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.buy__brand {
  display: inline-block;
  margin: 0 0 6px;
  font-weight: 700;
  font-size: 14px;
  color: var(--color-ink);
  text-decoration: none;
  text-transform: uppercase;
}
.buy__brand:hover {
  text-decoration: underline;
}
.buy__title-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.buy__title-row h1 {
  margin: 0;
  flex: 1;
  font-size: clamp(22px, 2.4vw, 32px);
  line-height: 1.15;
  font-weight: 700;
}
.buy__wish {
  flex: none;
  width: 44px;
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: #fff;
  color: var(--color-ink);
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, color 180ms ease;
}
.buy__wish:hover {
  border-color: var(--color-brand);
  color: var(--color-brand);
  transform: scale(1.06);
}
.buy__meta {
  margin-top: 8px;
}
.buy__desc {
  margin: 12px 0 0;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.45;
}
.buy__options {
  display: grid;
  gap: 10px;
}
.buy__option {
  display: flex;
  gap: 8px;
  margin: 0;
  font-size: 14px;
}
.buy__option-label {
  font-weight: 700;
}
.buy__option-value {
  color: var(--color-muted);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chips button {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease;
}
.chips button.active {
  border-color: var(--color-brand);
  color: var(--color-brand);
  font-weight: 700;
}

.buy__qty {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  overflow: hidden;
}
.buy__qty button,
.buy__qty input {
  height: 40px;
  border: 0;
  background: #fff;
  font-size: 16px;
}
.buy__qty button {
  width: 40px;
  cursor: pointer;
  transition: background 140ms ease;
}
.buy__qty button:hover:not(:disabled) {
  background: var(--color-canvas-soft);
}
.buy__qty button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.buy__qty input {
  width: 48px;
  text-align: center;
  font-weight: 600;
  -moz-appearance: textfield;
}
.buy__qty input::-webkit-outer-spin-button,
.buy__qty input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.buy__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
}
.buy__price-main {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 2px 6px;
  background: var(--color-brand);
  color: #fff;
  border-radius: 2px;
}
.buy__price--sale .buy__price-main {
  background: var(--color-brand);
}
.buy__price-current {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
}
.buy__price-unit {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}
.buy__price-side {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: baseline;
}
.buy__price-compare {
  color: var(--color-muted);
  text-decoration: line-through;
  font-size: 14px;
}
.buy__price-save {
  color: var(--color-danger);
  font-weight: 700;
  font-size: 14px;
}
.buy__installment {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
}
.buy__installment-link {
  border: 0;
  background: transparent;
  color: var(--color-brand);
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.buy__stock {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
}
.buy__cta {
  min-height: 48px;
  font-size: 16px;
  transition: transform 180ms ease, background 180ms ease;
}
.buy__cta--flash {
  animation: cta-flash 1.2s ease;
}
@keyframes cta-flash {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.02);
    background: #027a58;
  }
  100% {
    transform: scale(1);
  }
}
.buy__seller,
.buy__sku {
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
}
.buy__perks {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--color-border);
}
.buy__perks > li {
  border-bottom: 1px solid var(--color-border);
}
.buy__perk-btn,
.details__btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
}
.buy__chevron {
  display: inline-flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  transition: transform 220ms ease;
  font-size: 18px;
  line-height: 1;
}
.buy__chevron.open {
  transform: rotate(45deg);
}
.buy__perk-body,
.details__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 280ms cubic-bezier(0.3, 0, 0.1, 1);
}
.buy__perk-body.open,
.details__body.open {
  grid-template-rows: 1fr;
}
.buy__perk-body > p,
.details__body > .details__text {
  overflow: hidden;
  margin: 0;
  padding-bottom: 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.45;
  white-space: pre-line;
}
.buy__perk-body.open > p,
.details__body.open > .details__text {
  padding-bottom: 14px;
}

.details {
  border-top: 1px solid var(--color-border);
}
.details__item {
  border-bottom: 1px solid var(--color-border);
}
.details__btn h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.ok {
  color: var(--color-success);
  font-weight: 600;
  margin: 0;
}
.err {
  color: var(--color-danger);
  font-weight: 600;
  margin: 0;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  background: rgba(16, 16, 16, 0.72);
  animation: fade-in 180ms ease;
  padding: 48px 24px;
}
.lightbox__img {
  max-width: min(920px, 92vw);
  max-height: 82vh;
  object-fit: contain;
  background: #fff;
  animation: zoom-in 220ms cubic-bezier(0.3, 0, 0.1, 1);
}
.lightbox__close,
.lightbox__nav {
  position: absolute;
  border: 0;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-ink);
  cursor: pointer;
  border-radius: 999px;
}
.lightbox__close {
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  font-size: 28px;
  line-height: 1;
}
.lightbox__nav {
  top: 50%;
  translate: 0 -50%;
  width: 44px;
  height: 44px;
  font-size: 28px;
}
.lightbox__nav--prev {
  left: 16px;
}
.lightbox__nav--next {
  right: 16px;
}
.lightbox__count {
  position: absolute;
  bottom: 18px;
  left: 50%;
  translate: -50% 0;
  margin: 0;
  color: #fff;
  font-weight: 600;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 900px) {
  .pdp__grid {
    grid-template-columns: 1fr;
  }
  .buy {
    position: static;
  }
  .gallery__mosaic {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
