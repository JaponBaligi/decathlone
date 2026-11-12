<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  options: { type: Array, default: () => [] },
  modelValue: { type: [String, Array], default: '' },
  multiple: Boolean,
  /** Live colorBox facet (swatches) */
  variant: { type: String, default: 'text' },
  /** Live filter accordions start collapsed */
  defaultOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(props.defaultOpen)
const query = ref('')

const COLOR_SWATCH = {
  siyah: '#101010',
  mavi: '#2f6fed',
  beyaz: '#ffffff',
  'cok-renkli': 'conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #e53935)',
  yesil: '#2e7d32',
  gri: '#9e9e9e',
  sari: '#fbc02d',
  kirmizi: '#e53935',
  pembe: '#ec407a',
  mor: '#8e24aa',
  turuncu: '#fb8c00',
  bej: '#d7ccc8',
  kahverengi: '#6d4c41',
  renksiz: '#ffffff',
}

/** Live “Popüler bedenler” order */
const POPULAR_SIZE_SLUGS = ['tek-beden', 's', 'm', 'l', 'xl']

const filteredOptions = computed(() => {
  const q = query.value.trim().toLocaleLowerCase('tr-TR')
  if (!q) return props.options
  return props.options.filter((opt) =>
    String(opt.name || opt.slug || '')
      .toLocaleLowerCase('tr-TR')
      .includes(q)
  )
})

const popularSizeOptions = computed(() => {
  const bySlug = new Map(props.options.map((o) => [o.slug, o]))
  return POPULAR_SIZE_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean)
})

const sizeSections = computed(() => {
  if (props.variant !== 'size') return null
  const q = query.value.trim().toLocaleLowerCase('tr-TR')
  if (q) {
    return [{ key: 'search', title: null, options: filteredOptions.value }]
  }
  return [
    { key: 'popular', title: 'Popüler bedenler', options: popularSizeOptions.value },
    { key: 'all', title: 'Tüm bedenler', options: props.options },
  ]
})

function swatchStyle(slug) {
  const value = COLOR_SWATCH[slug] || '#ccc'
  if (String(value).includes('gradient')) return { background: value }
  return { background: value }
}

function needsBorder(slug) {
  return slug === 'beyaz' || slug === 'renksiz' || slug === 'bej'
}

function isChecked(slug) {
  if (props.multiple) return (props.modelValue || []).includes(slug)
  return props.modelValue === slug
}

function onToggle(slug) {
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(slug)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(slug)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', props.modelValue === slug ? '' : slug)
  }
}
</script>

<template>
  <div class="filter">
    <button
      type="button"
      class="filter__trigger"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span>{{ title }}</span>
      <span class="filter__icon" aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <div v-show="open" class="filter__body">
      <input
        v-if="variant !== 'color' && options.length > 12"
        v-model="query"
        type="search"
        class="filter__search"
        :placeholder="`${title} ara`"
      />
      <template v-if="sizeSections">
        <div
          v-for="section in sizeSections"
          :key="section.key"
          class="filter__section"
        >
          <p v-if="section.title" class="filter__section-title">{{ section.title }}</p>
          <div class="filter__list filter__list--size">
            <label
              v-for="opt in section.options"
              :key="`${section.key}-${opt.slug}`"
              class="filter__option"
              :class="{ 'filter__option--active': isChecked(opt.slug) }"
            >
              <input
                :type="multiple ? 'checkbox' : 'radio'"
                :name="title"
                :checked="isChecked(opt.slug)"
                @change="onToggle(opt.slug)"
              />
              <span>{{ opt.name || opt.slug }}</span>
              <span v-if="opt.count != null" class="filter__count">{{ opt.count }}</span>
            </label>
            <p v-if="!section.options.length" class="filter__empty">Seçenek yok</p>
          </div>
        </div>
      </template>
      <div v-else class="filter__list">
        <label
          v-for="opt in filteredOptions"
          :key="opt.slug"
          class="filter__option"
          :class="{
            'filter__option--color': variant === 'color',
            'filter__option--active': isChecked(opt.slug),
          }"
        >
          <input
            :type="multiple ? 'checkbox' : 'radio'"
            :name="title"
            :checked="isChecked(opt.slug)"
            :class="{ 'filter__input--hidden': variant === 'color' }"
            @change="onToggle(opt.slug)"
          />
          <span
            v-if="variant === 'color'"
            class="filter__swatch"
            :class="{ 'filter__swatch--border': needsBorder(opt.slug) }"
            :style="swatchStyle(opt.slug)"
            aria-hidden="true"
          />
          <span>{{ opt.name || opt.slug }}</span>
          <span v-if="opt.count != null" class="filter__count">{{ opt.count }}</span>
        </label>
        <p v-if="!filteredOptions.length" class="filter__empty">Seçenek yok</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter {
  border-bottom: 1px solid #e1e0df;
}
.filter__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 72px;
  padding: 24px 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #101010;
  cursor: pointer;
  text-align: left;
}
.filter__icon {
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  color: #101010;
}
.filter__body {
  padding: 0 0 20px;
}
.filter__search {
  width: 100%;
  min-height: 40px;
  margin-bottom: 8px;
  padding: 0 12px;
  border: 1px solid #e1e0df;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
}
.filter__list {
  max-height: 320px;
  overflow: auto;
}
.filter__list--size {
  max-height: none;
}
.filter:has(.filter__option--color) .filter__list {
  max-height: none;
}
.filter__section + .filter__section {
  margin-top: 16px;
}
.filter__section-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #101010;
}
.filter__body:has(.filter__section) {
  max-height: 420px;
  overflow: auto;
}
.filter__option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  min-height: 40px;
  cursor: pointer;
  font-size: 14px;
}
.filter__option--color {
  grid-template-columns: auto 1fr auto;
  min-height: 36px;
}
.filter__option input {
  margin: 0;
}
.filter__input--hidden {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}
.filter__option--color.filter__option--active {
  font-weight: 600;
}
.filter__swatch {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  flex-shrink: 0;
}
.filter__swatch--border {
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
}
.filter__count {
  color: var(--color-muted);
  font-size: 0.85rem;
}
.filter__empty {
  margin: 0;
  font-size: 14px;
  color: var(--color-muted);
}
</style>
