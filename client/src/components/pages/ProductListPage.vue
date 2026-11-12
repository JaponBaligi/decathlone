<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { api } from '@/services/api'
import { getCollectionTitle } from '@/data/collectionPages'
import { getDealsPage } from '@/data/dealsPages'
import FilterSidebar from '@/components/organisms/FilterSidebar.vue'
import ProductGrid from '@/components/organisms/ProductGrid.vue'

const props = defineProps({
  mode: { type: String, default: 'all' },
  slug: String,
  q: String,
})

const route = useRoute()
const router = useRouter()
const loading = ref(false)
/** Live /deals: filters closed on load */
const showFilters = ref(false)
const chipsExpanded = ref(false)
const result = ref({ items: [], total: 0, page: 1, totalPages: 1 })
const filters = ref({})
const state = reactive({
  brand: '',
  gender: '',
  color: '',
  size: '',
  sport: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: 'popular',
  page: 1,
})

const pageSize = computed(() => (props.mode === 'deals' ? 40 : 24))

const dealsPage = computed(() =>
  props.mode === 'deals' ? getDealsPage(props.slug || '') : null,
)

const title = computed(() => {
  if (props.mode === 'search') return `Arama: “${props.q || route.query.q || ''}”`
  if (props.mode === 'deals') return dealsPage.value?.title || 'Fırsatlar'
  if (props.mode === 'collection') {
    return getCollectionTitle(props.slug)
  }
  if (props.mode === 'category') {
    const map = {
      erkek: 'Erkek',
      kadin: 'Kadın',
      cocuk: 'Çocuk',
      ekipman: 'Ekipmanlar',
    }
    return map[props.slug] || props.slug
  }
  if (props.mode === 'sport') return props.slug
  return 'Decathlon Ürünleri'
})

const dealChips = computed(() => dealsPage.value?.chips || [])
const chipCollapseAt = computed(() => dealsPage.value?.chipCollapseAt ?? 7)
const chipsCanCollapse = computed(
  () => dealChips.value.length > chipCollapseAt.value,
)

/**
 * Live visual-grid keeps item classes stable; only parent `.chips--open` changes.
 * visible | first-invisible (under +) | invisible
 */
function chipVisibilityClass(index) {
  if (!chipsCanCollapse.value) return 'chip--visible'
  if (index < chipCollapseAt.value) return 'chip--visible'
  if (index === chipCollapseAt.value) return 'chip--first-invisible'
  return 'chip--invisible'
}

function applyDealsDefaults() {
  if (props.mode !== 'deals') return
  const page = dealsPage.value
  const defaults = page?.filters || {}
  state.brand = ''
  state.color = ''
  state.size = ''
  state.sport = ''
  state.minPrice = ''
  state.maxPrice = ''
  state.gender = defaults.gender || ''
  state.category = defaults.category || ''
  state.sort = defaults.sort || 'popular'
  chipsExpanded.value = false
  // Live: filters open only on hub `/deals`; closed on `/deals/:slug`
  showFilters.value = Boolean(page?.filtersOpenDefault)
}

function queryParams() {
  const params = new URLSearchParams()
  params.set('page', String(state.page))
  params.set('pageSize', String(pageSize.value))
  params.set('sort', state.sort)
  if (props.mode === 'category' && props.slug) params.set('category', props.slug)
  else if (state.category) params.set('category', state.category)
  if (props.mode === 'sport' && props.slug) params.set('sport', props.slug)
  else if (state.sport) params.set('sport', state.sport)
  if (props.mode === 'deals') params.set('deal', '1')
  if (props.mode === 'collection' && props.slug) params.set('collection', props.slug)
  if (props.mode === 'search') {
    const q = props.q || route.query.q || ''
    if (q) params.set('q', q)
  }
  if (state.brand) params.set('brand', state.brand)
  if (state.gender) params.set('gender', state.gender)
  if (state.color) params.set('color', state.color)
  if (state.size) params.set('size', state.size)
  if (state.minPrice) params.set('minPrice', String(state.minPrice))
  if (state.maxPrice) params.set('maxPrice', String(state.maxPrice))
  return params
}

function syncPageQuery() {
  const nextQuery = { ...route.query }
  if (state.page > 1) nextQuery.page = String(state.page)
  else delete nextQuery.page
  router.replace({ query: nextQuery })
}

async function load() {
  loading.value = true
  try {
    const params = queryParams()
    const [products, filterData] = await Promise.all([
      api(`/catalog/products?${params}`),
      api(`/catalog/filters?${params}`),
    ])
    result.value = products
    filters.value = filterData
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  state.page = 1
  syncPageQuery()
  load()
}

function resetFilters() {
  state.brand = ''
  state.gender = ''
  state.color = ''
  state.size = ''
  state.sport = ''
  state.category = ''
  state.minPrice = ''
  state.maxPrice = ''
  state.page = 1
  syncPageQuery()
  load()
}

function goPage(next) {
  state.page = next
  syncPageQuery()
}

function onChipClick(event) {
  event.currentTarget?.blur()
}

function onToggleChips(event) {
  event.currentTarget?.blur()
  chipsExpanded.value = !chipsExpanded.value
}

watch(
  () => [props.mode, props.slug],
  () => {
    if (props.mode === 'deals') applyDealsDefaults()
  },
  { immediate: true },
)

watch(
  () => [props.mode, props.slug, props.q, route.query.q, route.query.page],
  () => {
    const fromQuery = Number(route.query.page)
    state.page = Number.isFinite(fromQuery) && fromQuery > 0 ? fromQuery : 1
    if (props.mode !== 'deals' && route.query.gender) state.gender = String(route.query.gender)
    load()
  },
  { immediate: true },
)
</script>

<template>
  <div class="container plp">
    <nav class="crumb" aria-label="Breadcrumb">
      <template v-if="mode === 'deals'">
        <template v-if="slug">
          <RouterLink to="/deals">Fırsatlar</RouterLink>
          <span aria-hidden="true">&gt;</span>
          <span>{{ title }}</span>
        </template>
        <span v-else>Fırsatlar</span>
      </template>
      <template v-else>
        <RouterLink to="/tum-urunler">Tüm Ürünler</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ title }}</span>
      </template>
    </nav>
    <header class="plp__head">
      <h1>{{ title }}</h1>
    </header>

    <div
      v-if="mode === 'deals' && dealChips.length"
      class="chips"
      :class="{ 'chips--open': chipsExpanded, 'chips--collapsible': chipsCanCollapse }"
    >
      <RouterLink
        v-for="(chip, index) in dealChips"
        :key="chip.to + chip.label"
        :to="chip.to"
        class="chip"
        :class="chipVisibilityClass(index)"
        :tabindex="
          !chipsCanCollapse || chipsExpanded || index < chipCollapseAt ? undefined : -1
        "
        :aria-hidden="
          chipsCanCollapse && !chipsExpanded && index >= chipCollapseAt ? 'true' : undefined
        "
        @click="onChipClick"
      >
        <span class="chip__media">
          <img :src="chip.image" :alt="chip.label" width="88" height="88" loading="lazy" />
        </span>
        <span class="chip__label">{{ chip.label }}</span>
      </RouterLink>
      <button
        v-if="chipsCanCollapse"
        type="button"
        class="chip chip--more"
        :aria-expanded="chipsExpanded"
        :tabindex="chipsExpanded ? -1 : 0"
        @click="onToggleChips($event)"
      >
        <span class="chip__media chip__media--more" aria-hidden="true">
          <span class="chip__more-circle">
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path d="M12 4V20M20 12H4" stroke="currentColor" />
            </svg>
          </span>
        </span>
        <span class="chip__label">Daha fazla göster</span>
      </button>
    </div>

    <div class="toolbar" :class="{ 'toolbar--deals': mode === 'deals' }">
      <button
        class="toolbar__filters"
        :class="{ 'toolbar__filters--open': showFilters }"
        type="button"
        @click="showFilters = !showFilters"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 7h16M6 12h12M9 17h6" />
          <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="11" cy="17" r="1.5" fill="currentColor" stroke="none" />
        </svg>
        {{ showFilters ? 'Filtreleri gizle' : 'Filtreler' }}
      </button>
      <div class="toolbar__meta">
        <span class="toolbar__count">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
            <path d="M12 10.5v6M12 7.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          {{ result.total.toLocaleString('tr-TR') }} ürün
        </span>
        <span class="toolbar__sep" aria-hidden="true" />
        <label class="toolbar__sort">
          <select v-model="state.sort" @change="applyFilters">
            <option value="popular">Öne çıkanlar</option>
            <option value="price_asc">Fiyat (artan)</option>
            <option value="price_desc">Fiyat (azalan)</option>
            <option value="rating">Puan</option>
            <option value="newest">En yeni</option>
          </select>
        </label>
      </div>
    </div>

    <div class="plp__layout" :class="{ 'plp__layout--full': !showFilters }">
      <FilterSidebar
        v-if="showFilters"
        v-model="state"
        :filters="filters"
        @apply="applyFilters"
        @reset="resetFilters"
      />
      <div>
        <p v-if="loading" class="loading">Yükleniyor…</p>
        <ProductGrid v-else :products="result.items" :columns="4" />
        <div v-if="result.totalPages > 1" class="pager">
          <button
            type="button"
            class="pager__btn"
            aria-label="Önceki sayfaya git"
            :disabled="state.page <= 1"
            @click="goPage(state.page - 1)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path
                d="M14.5 6.5 9 12l5.5 5.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="pager__label">{{ state.page }} / {{ result.totalPages }}</span>
          <button
            type="button"
            class="pager__btn"
            aria-label="Sonraki sayfaya git"
            :disabled="state.page >= result.totalPages"
            @click="goPage(state.page + 1)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
              <path
                d="M9.5 6.5 15 12l-5.5 5.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plp {
  padding-block: 28px 64px;
}
.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-muted);
  margin-bottom: 12px;
}
.crumb a {
  color: inherit;
  text-decoration: none;
}
.crumb a:hover {
  text-decoration: underline;
  color: var(--color-ink);
}
.plp__head h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  margin: 0 0 32px;
  font-weight: 700;
}
.chips {
  /* Live .visual-grid: 8 columns; expand via opacity / translate / max-block-size */
  --chips-motion-quick: 250ms;
  --chips-motion-moderate: 600ms;
  --chips-motion-delay: 170ms;
  --chips-ease: cubic-bezier(0.42, 0, 0.58, 1);
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0 4px;
  margin-bottom: 32px;
  width: 100%;
  transition:
    gap var(--chips-motion-quick) var(--chips-ease);
}
.chips--open {
  gap: 24px 4px;
}
.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 0 0 calc((100% - 7 * 4px) / 8);
  width: calc((100% - 7 * 4px) / 8);
  max-width: calc((100% - 7 * 4px) / 8);
  padding: 0 12px;
  box-sizing: border-box;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-decoration: none;
  outline: none;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent;
}
.chip--visible {
  position: relative;
  z-index: 2;
}
/* 8th tile sits under absolute “Daha fazla”; fades in after + fades out */
.chip--first-invisible {
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--chips-motion-quick) var(--chips-ease) var(--chips-motion-quick);
}
.chips--open .chip--first-invisible {
  pointer-events: auto;
  opacity: 1;
}
/* Extra rows: collapse height, slide down + fade on open */
.chip--invisible {
  z-index: 1;
  max-block-size: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-50%);
  transition:
    transform var(--chips-motion-moderate) var(--chips-ease),
    opacity var(--chips-motion-quick) var(--chips-ease) var(--chips-motion-delay),
    max-block-size var(--chips-motion-quick) var(--chips-ease);
}
.chips--open .chip--invisible {
  max-block-size: none;
  overflow: visible;
  pointer-events: auto;
  opacity: 1;
  transform: translate(0);
}
.chip:focus,
.chip:focus-visible,
.chip:active {
  outline: none;
  box-shadow: none;
}
.chip__media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  border: 0;
  border-radius: 0;
  outline: none;
  box-shadow: none;
  background: #f5f4f5;
  overflow: hidden;
}
.chip__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 0;
  outline: none;
  display: block;
}
/* Live: more control overlays the 8th column (absolute top-end) */
.chip--more {
  display: none;
}
.chips--collapsible .chip--more {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  z-index: 3;
  display: flex;
  opacity: 1;
  transition: opacity var(--chips-motion-quick) var(--chips-ease);
}
.chips--open .chip--more {
  opacity: 0;
  pointer-events: none;
}
.chip__media--more {
  width: 100%;
  aspect-ratio: 1;
  border: 0;
  border-radius: 0;
  background: transparent;
  outline: none;
  box-shadow: none;
}
.chip__more-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 0.8px solid #949494;
  background: #fff;
  color: #101010;
  box-sizing: border-box;
}
.chip__more-circle svg {
  display: block;
}
.chip__label {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 1.25;
  width: 100%;
}
@media (max-width: 900px) {
  .chip {
    flex: 0 0 calc((100% - 3 * 4px) / 4);
    width: calc((100% - 3 * 4px) / 4);
    max-width: calc((100% - 3 * 4px) / 4);
    padding: 0 8px;
  }
  /* Below live desktop breakpoint, keep more in-flow (no absolute overlay) */
  .chips--collapsible .chip--more {
    position: static;
  }
  .chip--first-invisible,
  .chip--invisible {
    max-block-size: none;
    overflow: visible;
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .chips--collapsible:not(.chips--open) .chip--first-invisible,
  .chips--collapsible:not(.chips--open) .chip--invisible {
    display: none;
  }
  .chips--open .chip--more {
    display: none;
  }
}
@media (max-width: 600px) {
  .chip {
    flex: 0 0 calc((100% - 2 * 4px) / 3);
    width: calc((100% - 2 * 4px) / 3);
    max-width: calc((100% - 2 * 4px) / 3);
  }
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
  /* Live .filter-bar: sticky top 0 once header has scrolled away */
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1010;
}
.toolbar--deals {
  z-index: 1010;
}
.toolbar__filters {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid #e1e0df;
  border-radius: 999px;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}
.toolbar__filters--open {
  border: 2px solid #101010;
}
.toolbar__meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  font-weight: 500;
}
.toolbar__count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-ink);
}
.toolbar__sep {
  width: 1px;
  height: 20px;
  background: var(--color-border);
}
.toolbar__sort select {
  min-height: 40px;
  border: 0;
  border-radius: 0;
  padding: 0 22px 0 0;
  background: #fff
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%23101010' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
    right 0 center / 12px no-repeat;
  appearance: none;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}
.plp__layout {
  display: grid;
  grid-template-columns: 418px 1fr;
  gap: 28px;
  align-items: start;
}
.plp__layout--full {
  grid-template-columns: 1fr;
}
.loading {
  color: var(--color-muted);
}
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  margin-top: 48px;
  margin-bottom: 24px;
}
.pager__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  min-width: 4ch;
  text-align: center;
}
.pager__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid #c4c4c4;
  background: #fff;
  color: var(--color-ink);
  cursor: pointer;
}
.pager__btn:hover:not(:disabled) {
  border-color: #101010;
}
.pager__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
@media (max-width: 1100px) {
  .plp__layout {
    grid-template-columns: 1fr;
  }
}
</style>
