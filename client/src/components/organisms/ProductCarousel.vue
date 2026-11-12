<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ProductCard from '@/components/molecules/ProductCard.vue'

defineProps({
  products: { type: Array, default: () => [] },
  title: String,
})

const scroller = ref(null)
const scrollbar = ref(null)
const canPrev = ref(false)
const canNext = ref(false)
const progress = ref(0) // 0–1 thumb start
const thumbSize = ref(0.25) // 0–1 thumb width
const isDragging = ref(false)
const scrollbarActive = ref(false)

let dragKind = null // 'track' | 'thumb'
let dragStartX = 0
let dragStartScroll = 0
let dragMoved = false
let suppressClick = false
let activePointerId = null

function maxScroll(el = scroller.value) {
  if (!el) return 0
  return Math.max(0, el.scrollWidth - el.clientWidth)
}

function update() {
  const el = scroller.value
  if (!el) return
  const max = maxScroll(el)
  canPrev.value = el.scrollLeft > 2
  canNext.value = el.scrollLeft < max - 2
  if (max <= 0) {
    progress.value = 0
    thumbSize.value = 1
    return
  }
  thumbSize.value = Math.min(1, el.clientWidth / el.scrollWidth)
  progress.value = el.scrollLeft / max
}

function scrollByDir(dir) {
  const el = scroller.value
  if (!el) return
  const amount = Math.max(el.clientWidth * 0.9, 300)
  el.scrollBy({ left: dir * amount, behavior: 'smooth' })
}

function setScrollLeft(next, { smooth = false } = {}) {
  const el = scroller.value
  if (!el) return
  const max = maxScroll(el)
  const left = Math.min(max, Math.max(0, next))
  if (smooth) el.scrollTo({ left, behavior: 'smooth' })
  else el.scrollLeft = left
}

function onTrackPointerDown(e) {
  if (e.button != null && e.button !== 0) return
  const el = scroller.value
  if (!el || maxScroll(el) <= 0) return
  // Ignore interactive controls inside cards (buttons); links handled via click suppress
  if (e.target.closest('button, input, select, textarea, label')) return

  dragKind = 'track'
  isDragging.value = true
  dragMoved = false
  suppressClick = false
  dragStartX = e.clientX
  dragStartScroll = el.scrollLeft
  activePointerId = e.pointerId
  el.setPointerCapture?.(e.pointerId)
  el.classList.add('is-dragging')
}

function onThumbPointerDown(e) {
  if (e.button != null && e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  const el = scroller.value
  if (!el || maxScroll(el) <= 0) return

  dragKind = 'thumb'
  isDragging.value = true
  scrollbarActive.value = true
  dragMoved = false
  dragStartX = e.clientX
  dragStartScroll = el.scrollLeft
  activePointerId = e.pointerId
  e.currentTarget.setPointerCapture?.(e.pointerId)
}

function onPointerMove(e) {
  if (!isDragging.value || dragKind == null) return
  if (activePointerId != null && e.pointerId !== activePointerId) return
  const el = scroller.value
  if (!el) return

  const dx = e.clientX - dragStartX
  if (Math.abs(dx) > 3) dragMoved = true

  if (dragKind === 'track') {
    // Drag content: grab-n-slide (finger/mouse moves opposite to scroll)
    setScrollLeft(dragStartScroll - dx)
    return
  }

  // Drag scrollbar thumb: map thumb travel to full scroll range
  const bar = scrollbar.value
  if (!bar) return
  const max = maxScroll(el)
  const thumbRatio = thumbSize.value
  const travel = bar.clientWidth * (1 - thumbRatio)
  if (travel <= 0) return
  setScrollLeft(dragStartScroll + (dx / travel) * max)
}

function endDrag(e) {
  if (!isDragging.value) return
  if (activePointerId != null && e?.pointerId != null && e.pointerId !== activePointerId) return

  if (dragKind === 'track' && dragMoved) {
    suppressClick = true
    // Clear on next tick so the trailing click is swallowed
    window.setTimeout(() => {
      suppressClick = false
    }, 0)
  }

  scroller.value?.classList.remove('is-dragging')
  isDragging.value = false
  scrollbarActive.value = false
  dragKind = null
  activePointerId = null
  dragMoved = false
  update()
}

function onTrackClickCapture(e) {
  if (!suppressClick) return
  e.preventDefault()
  e.stopPropagation()
  suppressClick = false
}

function onScrollbarTrackClick(e) {
  if (e.target.closest('.shelf__scrollbar-thumb')) return
  const el = scroller.value
  const bar = scrollbar.value
  if (!el || !bar || maxScroll(el) <= 0) return
  const rect = bar.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  const thumb = thumbSize.value
  // Center thumb on click point
  setScrollLeft((ratio - thumb / 2) * el.scrollWidth, { smooth: true })
}

onMounted(async () => {
  await nextTick()
  update()
  window.addEventListener('resize', update, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', endDrag, { passive: true })
  window.addEventListener('pointercancel', endDrag, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
})

const thumbStyle = computed(() => ({
  width: `${thumbSize.value * 100}%`,
  left: `${progress.value * (1 - thumbSize.value) * 100}%`,
}))
</script>

<template>
  <section class="shelf">
    <div class="shelf__header">
      <h2 v-if="title" class="shelf__title">{{ title }}</h2>
      <div class="shelf__nav" aria-label="Ürün kaydırma">
        <button
          type="button"
          class="shelf__btn"
          aria-label="Önceki ürün"
          :disabled="!canPrev"
          @click="scrollByDir(-1)"
        >
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M15 6L9 12L15 18" stroke="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="shelf__btn"
          aria-label="Sonraki ürün"
          :disabled="!canNext"
          @click="scrollByDir(1)"
        >
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M9 18L15 12L9 6" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="scroller"
      class="shelf__track"
      :class="{ 'shelf__track--dragging': isDragging }"
      @scroll.passive="update"
      @pointerdown="onTrackPointerDown"
      @click.capture="onTrackClickCapture"
    >
      <article v-for="p in products" :key="p.id" class="shelf__slide">
        <ProductCard :product="p" />
      </article>
    </div>

    <div
      ref="scrollbar"
      class="shelf__scrollbar"
      :class="{ 'shelf__scrollbar--dragging': scrollbarActive }"
      @click="onScrollbarTrackClick"
    >
      <div class="shelf__scrollbar-track" aria-hidden="true" />
      <div
        class="shelf__scrollbar-thumb"
        role="slider"
        tabindex="0"
        aria-label="Kaydırma konumu"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="Math.round(progress * 100)"
        :style="thumbStyle"
        @pointerdown="onThumbPointerDown"
      />
    </div>
  </section>
</template>

<style scoped>
.shelf__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  min-height: 48px;
}
.shelf__title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 32px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.shelf__nav {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.shelf__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid #949494;
  background: #fff;
  color: var(--color-ink);
  cursor: pointer;
  padding: 0;
}
.shelf__btn:hover:not(:disabled) {
  border-color: var(--color-ink);
}
.shelf__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.shelf__track {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}
.shelf__track::-webkit-scrollbar {
  display: none;
}
.shelf__track--dragging,
.shelf__track.is-dragging {
  cursor: grabbing;
  scroll-snap-type: none;
}
.shelf__track--dragging :deep(a),
.shelf__track.is-dragging :deep(a) {
  pointer-events: none;
}
.shelf__slide {
  flex: 0 0 calc((100% - 12px) / 4);
  min-width: 0;
  scroll-snap-align: start;
}
/* Live carousel-scrollbar: 6px hit area, 2px rail → 6px pill thumb on hover/drag */
.shelf__scrollbar {
  position: relative;
  height: 6px;
  margin-top: 24px;
  cursor: pointer;
}
.shelf__scrollbar-track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 2px;
  background: #e1e0df;
  z-index: 0;
  pointer-events: none;
}
.shelf__scrollbar-thumb {
  position: absolute;
  left: 0;
  bottom: 4px;
  height: 2px;
  background: #101010;
  z-index: 1;
  cursor: grab;
  touch-action: none;
  transition:
    height 160ms ease,
    bottom 160ms ease,
    border-radius 160ms ease;
}
.shelf__scrollbar-thumb::after {
  /* Larger grab target without changing visuals */
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(50% - 24px);
  height: 48px;
}
.shelf__scrollbar:hover .shelf__scrollbar-thumb,
.shelf__scrollbar--dragging .shelf__scrollbar-thumb {
  bottom: 2px;
  height: 6px;
  border-radius: 999px;
  cursor: grab;
}
.shelf__scrollbar--dragging .shelf__scrollbar-thumb,
.shelf__scrollbar--dragging:hover .shelf__scrollbar-thumb {
  cursor: grabbing;
}
@media (max-width: 1100px) {
  .shelf__slide {
    flex-basis: calc((100% - 4px) / 2);
  }
}
@media (max-width: 700px) {
  .shelf__slide {
    flex-basis: 85%;
  }
  .shelf__title {
    font-size: 26px;
    line-height: 32px;
  }
}
</style>
