<script setup>
import { computed, reactive, watch } from 'vue'
import FilterGroup from '@/components/molecules/FilterGroup.vue'
import PriceRangeFilter from '@/components/molecules/PriceRangeFilter.vue'

const props = defineProps({
  filters: { type: Object, default: () => ({}) },
  modelValue: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue', 'apply', 'reset'])

const local = reactive({
  brand: [],
  gender: '',
  color: '',
  size: '',
  sport: '',
  category: '',
  minPrice: '',
  maxPrice: '',
})

let syncing = false

const priceBoundMin = computed(() => {
  const n = Number(props.filters?.price?.min)
  return Number.isFinite(n) ? Math.round(n / 100) : 20
})
const priceBoundMax = computed(() => {
  const n = Number(props.filters?.price?.max)
  return Number.isFinite(n) ? Math.round(n / 100) : 179000
})

watch(
  () => props.modelValue,
  (v) => {
    syncing = true
    local.brand = v.brand ? String(v.brand).split(',').filter(Boolean) : []
    local.gender = v.gender || ''
    local.color = v.color || ''
    local.size = v.size || ''
    local.sport = v.sport || ''
    local.category = v.category || ''
    local.minPrice = v.minPrice ? Math.round(Number(v.minPrice) / 100) : ''
    local.maxPrice = v.maxPrice ? Math.round(Number(v.maxPrice) / 100) : ''
    queueMicrotask(() => {
      syncing = false
    })
  },
  { immediate: true, deep: true }
)

function pushModel() {
  if (syncing) return
  emit('update:modelValue', {
    ...props.modelValue,
    brand: local.brand.join(','),
    gender: local.gender,
    color: local.color,
    size: local.size,
    sport: local.sport,
    category: local.category,
    minPrice: local.minPrice !== '' && local.minPrice != null ? Math.round(Number(local.minPrice) * 100) : '',
    maxPrice: local.maxPrice !== '' && local.maxPrice != null ? Math.round(Number(local.maxPrice) * 100) : '',
  })
  emit('apply')
}

function onFacetChange() {
  pushModel()
}

function applyPrice() {
  pushModel()
}

/** Live Renkler labels: Siyah, Çok renkli (not SİYAH) */
function formatColorName(name) {
  const lower = String(name || '').toLocaleLowerCase('tr-TR')
  if (!lower) return ''
  return lower.charAt(0).toLocaleUpperCase('tr-TR') + lower.slice(1)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__row sidebar__row--store">
      <span>Mağaza stok durumu</span>
      <button type="button" class="sidebar__link" @click.prevent>Posta kodunu gir</button>
    </div>

    <FilterGroup
      :model-value="local.category"
      title="Ürün türü"
      :options="(filters.categories || []).map((c) => ({ slug: c.slug, name: c.name, count: c.count }))"
      @update:model-value="(v) => { local.category = v; onFacetChange() }"
    />
    <FilterGroup
      :model-value="local.gender"
      title="Cinsiyet"
      :options="filters.genders || []"
      @update:model-value="(v) => { local.gender = v; onFacetChange() }"
    />
    <FilterGroup
      :model-value="local.color"
      title="Renkler"
      variant="color"
      :options="
        (filters.colors || []).map((c) => ({
          ...c,
          name: formatColorName(c.name || c.slug),
        }))
      "
      @update:model-value="(v) => { local.color = v; onFacetChange() }"
    />
    <FilterGroup
      :model-value="local.size"
      title="Bedenler"
      variant="size"
      :options="filters.sizes || []"
      @update:model-value="(v) => { local.size = v; onFacetChange() }"
    />
    <FilterGroup
      :model-value="local.sport"
      title="Sporlar"
      :options="filters.sports || []"
      @update:model-value="(v) => { local.sport = v; onFacetChange() }"
    />
    <FilterGroup
      :model-value="local.brand"
      title="Markalar"
      :options="filters.brands || []"
      multiple
      @update:model-value="(v) => { local.brand = v; onFacetChange() }"
    />

    <PriceRangeFilter
      :min-bound="priceBoundMin"
      :max-bound="priceBoundMax"
      :min-value="local.minPrice"
      :max-value="local.maxPrice"
      @update:min-value="(v) => { local.minPrice = v }"
      @update:max-value="(v) => { local.maxPrice = v }"
      @change="applyPrice"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 112px;
  background: #fff;
  padding: 0;
  width: 100%;
  max-height: calc(100vh - 128px);
  overflow: auto;
}
.sidebar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 72px;
  padding: 24px 0;
  border-bottom: 1px solid #e1e0df;
  font-size: 16px;
  font-weight: 600;
}
.sidebar__link {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #3643ba;
  cursor: pointer;
  text-decoration: underline;
}
</style>
