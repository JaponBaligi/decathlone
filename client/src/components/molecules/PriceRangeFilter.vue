<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  /** Bounds in whole TL */
  minBound: { type: Number, required: true },
  maxBound: { type: Number, required: true },
  /** Selected min/max in whole TL; empty = full range */
  minValue: { type: [Number, String], default: '' },
  maxValue: { type: [Number, String], default: '' },
  defaultOpen: { type: Boolean, default: false },
})
const emit = defineEmits(['update:minValue', 'update:maxValue', 'change'])

const open = ref(props.defaultOpen)
const minVal = ref(props.minBound)
const maxVal = ref(props.maxBound)
const minText = ref('')
const maxText = ref('')

const span = computed(() => Math.max(1, props.maxBound - props.minBound))

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n))
}

function formatTl(n) {
  return Math.round(n).toLocaleString('tr-TR')
}

function parseTl(raw) {
  const cleaned = String(raw || '')
    .replace(/[₺\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : NaN
}

function syncFromProps() {
  const lo = props.minValue === '' || props.minValue == null ? props.minBound : Number(props.minValue)
  const hi = props.maxValue === '' || props.maxValue == null ? props.maxBound : Number(props.maxValue)
  minVal.value = clamp(lo, props.minBound, props.maxBound)
  maxVal.value = clamp(hi, props.minBound, props.maxBound)
  if (minVal.value > maxVal.value) {
    const t = minVal.value
    minVal.value = maxVal.value
    maxVal.value = t
  }
  minText.value = formatTl(minVal.value)
  maxText.value = formatTl(maxVal.value)
}

watch(
  () => [props.minBound, props.maxBound, props.minValue, props.maxValue],
  syncFromProps,
  { immediate: true }
)

const fillStyle = computed(() => {
  const left = ((minVal.value - props.minBound) / span.value) * 100
  const right = ((maxVal.value - props.minBound) / span.value) * 100
  return {
    background: `linear-gradient(to right,
      #d9d9d9 0%,
      #d9d9d9 ${left}%,
      var(--color-brand) ${left}%,
      var(--color-brand) ${right}%,
      #d9d9d9 ${right}%,
      #d9d9d9 100%)`,
  }
})

function emitRange() {
  const outMin = minVal.value <= props.minBound ? '' : minVal.value
  const outMax = maxVal.value >= props.maxBound ? '' : maxVal.value
  emit('update:minValue', outMin)
  emit('update:maxValue', outMax)
  emit('change')
}

function onMinSlide(e) {
  const v = Number(e.target.value)
  minVal.value = Math.min(v, maxVal.value)
  minText.value = formatTl(minVal.value)
  emitRange()
}

function onMaxSlide(e) {
  const v = Number(e.target.value)
  maxVal.value = Math.max(v, minVal.value)
  maxText.value = formatTl(maxVal.value)
  emitRange()
}

function commitMin() {
  let v = parseTl(minText.value)
  if (!Number.isFinite(v)) v = props.minBound
  minVal.value = clamp(Math.round(v), props.minBound, maxVal.value)
  minText.value = formatTl(minVal.value)
  emitRange()
}

function commitMax() {
  let v = parseTl(maxText.value)
  if (!Number.isFinite(v)) v = props.maxBound
  maxVal.value = clamp(Math.round(v), minVal.value, props.maxBound)
  maxText.value = formatTl(maxVal.value)
  emitRange()
}
</script>

<template>
  <div class="price">
    <button
      type="button"
      class="price__trigger"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span>Fiyat</span>
      <span class="price__icon" aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>
    <div v-show="open" class="price__body">
      <div class="price__slider">
        <div class="price__track" :style="fillStyle" aria-hidden="true" />
        <input
          class="price__range price__range--min"
          type="range"
          :min="minBound"
          :max="maxBound"
          :value="minVal"
          :aria-label="`Minimum fiyat ${minText} lira`"
          @input="onMinSlide"
        />
        <input
          class="price__range price__range--max"
          type="range"
          :min="minBound"
          :max="maxBound"
          :value="maxVal"
          :aria-label="`Maksimum fiyat ${maxText} lira`"
          @input="onMaxSlide"
        />
      </div>
      <div class="price__fields">
        <label class="price__field">
          <span class="price__label">Minimum</span>
          <span class="price__control">
            <span class="price__currency" aria-hidden="true">₺</span>
            <input
              v-model="minText"
              class="price__input"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              @keydown.enter.prevent="commitMin"
              @blur="commitMin"
            />
          </span>
        </label>
        <label class="price__field">
          <span class="price__label">Maksimum</span>
          <span class="price__control">
            <span class="price__currency" aria-hidden="true">₺</span>
            <input
              v-model="maxText"
              class="price__input"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              @keydown.enter.prevent="commitMax"
              @blur="commitMax"
            />
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.price {
  border-bottom: 1px solid #e1e0df;
}
.price__trigger {
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
.price__icon {
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  color: #101010;
}
.price__body {
  padding: 0 0 20px;
}
.price__slider {
  position: relative;
  height: 28px;
  margin: 4px 2px 20px;
}
.price__track {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 4px;
  margin-top: -2px;
  border-radius: 999px;
}
.price__range {
  position: absolute;
  inset: 0;
  width: 100%;
  margin: 0;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}
.price__range--min {
  z-index: 2;
}
.price__range--max {
  z-index: 3;
}
.price__range::-webkit-slider-runnable-track {
  height: 4px;
  background: transparent;
  border: none;
}
.price__range::-moz-range-track {
  height: 4px;
  background: transparent;
  border: none;
}
.price__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  width: 20px;
  height: 20px;
  margin-top: -8px;
  border-radius: 999px;
  border: 5px solid var(--color-brand);
  background: #fff;
  box-shadow: none;
  cursor: pointer;
}
.price__range::-moz-range-thumb {
  pointer-events: auto;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 5px solid var(--color-brand);
  background: #fff;
  box-shadow: none;
  cursor: pointer;
}
.price__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.price__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.price__label {
  font-size: 14px;
  font-weight: 400;
  color: #101010;
}
.price__control {
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  background: #fff;
}
.price__currency {
  font-size: 14px;
  color: #101010;
}
.price__input {
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: #101010;
  outline: none;
}
</style>
