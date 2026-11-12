<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Live visual-link-list / media-stack (Framer Motion):
 * - active card front; next 2 fan up-right; offset 3 pre-staged at opacity 0
 * - previous tucked left (-25%); far cards off to the right
 * - transform 600ms easeIn [.3,0,.1,1]; autoplay every 2s while in view
 * - hover/focus pauses autoplay permanently (live behavior)
 */
const sports = [
  {
    label: 'Hiking & Trekking',
    to: '/tum-sporlar',
    image:
      'https://contents.mediadecathlon.com/s1068532/k$91edf6d42d5b98a2f30e978b9f2eeac8/1590x0/557pt528/1113xcr1056/1068532_default.jpg?format=auto&f=1200x0',
  },
  {
    label: 'Fitness & Kardiyo',
    to: '/kategori/fitness-ekipman',
    image:
      'https://contents.mediadecathlon.com/p3160165/k$6b246272d449b21d2c07bb45f88080f5/7008x0/4161pt2336/5694xcr4672/3160165_default.jpg?format=auto&f=1200x0',
  },
  {
    label: 'Doğa Gözlem',
    to: '/tum-sporlar',
    image:
      'https://contents.mediadecathlon.com/p3177588/k$0be817c403027a02f815500f0ccc868e/1024x0/594pt418/860xcr701/3177588_default.jpg?format=auto&f=1200x0',
  },
  {
    label: 'Kış Sporları',
    to: '/tum-sporlar',
    image:
      'https://contents.mediadecathlon.com/p222946/k$eeeb9687db2ab34bef4bda0a2d28bb2c/2848x0/1424pt2056/2848xcr2757/222946_default.jpg?format=auto&f=1200x0',
  },
  {
    label: 'Raket Sporları',
    to: '/kategori/tenis-ekipman',
    image:
      'https://contents.mediadecathlon.com/p3127763/k$b503714b25e1410117764b41457d2d68/7008x0/3163pt2336/6325xcr4672/3127763_default.jpg?format=auto&f=1200x0',
  },
  {
    label: 'Yelken',
    to: '/tum-sporlar',
    image:
      'https://contents.mediadecathlon.com/p3026264/k$9df7012bc2b1bfa5d6dd9effb3518b5b/3168x0/1584pt2131/3168xcr2471/3026264_default.jpg?format=auto&f=1200x0',
  },
]

const active = ref(0)
const paused = ref(false)
const inView = ref(false)
const rootEl = ref(null)

let autoplayId = 0
let observer = null

function offsetOf(i) {
  const n = sports.length
  return (i - active.value + n) % n
}

/** Signed stack offset: previous → -1 (live Framer notActive), else 0..n-1 */
function signedOffset(i) {
  const off = offsetOf(i)
  return off === sports.length - 1 ? -1 : off
}

function cardStyle(i) {
  const offset = signedOffset(i)

  if (offset === 0) {
    return {
      zIndex: 10,
      opacity: 1,
      transform: 'translate(0, 0) scale(1)',
    }
  }
  if (offset === -1) {
    return {
      zIndex: 1,
      opacity: 0,
      transform: 'translateX(-25%) scale(0.8)',
    }
  }
  if (offset === 1) {
    return {
      zIndex: 9,
      opacity: 1,
      transform: 'translateX(70%) translateY(calc(-10% - 40px)) scale(0.9)',
    }
  }
  if (offset === 2) {
    return {
      zIndex: 8,
      opacity: 1,
      transform: 'translateX(calc(100% + 24px)) translateY(calc(-20% - 88px)) scale(0.8)',
    }
  }
  if (offset === 3) {
    return {
      zIndex: 7,
      opacity: 0,
      transform: 'translateX(150%) translateY(calc(-30% - 152px)) scale(0.7)',
    }
  }
  return {
    zIndex: 10 - Math.min(offset, 9),
    opacity: 0,
    transform: 'translateX(150%) scale(0.7)',
  }
}

function setActive(index, fromAuto = false) {
  if (!inView.value) return
  active.value = index
  if (!fromAuto) {
    paused.value = true
    stopAutoplay()
  }
}

function onUserSelect(index) {
  setActive(index, false)
}

function tick() {
  setActive((active.value + 1) % sports.length, true)
}

function stopAutoplay() {
  if (autoplayId) {
    clearInterval(autoplayId)
    autoplayId = 0
  }
}

function startAutoplay() {
  stopAutoplay()
  if (paused.value || !inView.value) return
  autoplayId = window.setInterval(tick, 2000)
}

const cards = computed(() =>
  sports.map((sport, i) => ({
    ...sport,
    style: cardStyle(i),
    isActive: i === active.value,
    offset: signedOffset(i),
  }))
)

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
      if (entry.isIntersecting) startAutoplay()
      else stopAutoplay()
    },
    { rootMargin: '-33% 0%' }
  )
  if (rootEl.value) observer.observe(rootEl.value)
})

onUnmounted(() => {
  stopAutoplay()
  observer?.disconnect()
})
</script>

<template>
  <section ref="rootEl" class="popular-sports" aria-label="Popüler Sporlar">
    <div class="popular-sports__grid">
      <div class="popular-sports__content">
        <div class="popular-sports__top">
          <h2 class="popular-sports__overline">Popüler Sporlar</h2>
          <ul class="popular-sports__list">
            <li
              v-for="(sport, i) in sports"
              :key="sport.label"
              class="popular-sports__item"
              :class="{ 'popular-sports__item--active': i === active }"
              @mouseenter="onUserSelect(i)"
              @focusin="onUserSelect(i)"
            >
              <RouterLink :to="sport.to" class="popular-sports__link">
                <span class="popular-sports__label">{{ sport.label }}</span>
                <svg
                  class="popular-sports__icon"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke-width="1.5"
                  aria-hidden="true"
                >
                  <path
                    d="M14.3846 18.4668L20.849 12.0024L14.3822 5.53559M20.099 12.0024L3.10003 12.0024"
                    stroke="currentColor"
                    stroke-linecap="square"
                  />
                </svg>
              </RouterLink>
            </li>
          </ul>
        </div>
        <RouterLink to="/tum-sporlar" class="popular-sports__all">
          Tüm Sporları Keşfet!
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
        </RouterLink>
      </div>

      <div class="popular-sports__media" aria-hidden="true">
        <div class="popular-sports__stack">
          <article
            v-for="card in cards"
            :key="card.label"
            class="popular-sports__card"
            :class="{
              'popular-sports__card--active': card.isActive,
              'popular-sports__card--prev': card.offset === -1,
              'popular-sports__card--stage': card.offset === 3,
            }"
            :style="card.style"
          >
            <RouterLink :to="card.to" tabindex="-1" class="popular-sports__card-link">
              <img :src="card.image" :alt="card.label" loading="lazy" />
            </RouterLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.popular-sports__grid {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(320px, 1.5fr);
  gap: 24px;
  min-height: 860px;
  align-items: stretch;
}
.popular-sports__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-block: 8px;
}
.popular-sports__overline {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0;
  text-transform: uppercase;
  font-variation-settings: 'opsz' 14;
}
.popular-sports__list {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.popular-sports__item {
  display: block;
  padding: 4px 0;
  margin: 8px 0;
}
.popular-sports__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink);
  text-decoration: none;
}
.popular-sports__label {
  font-family: var(--font-sans);
  font-size: 48px;
  font-weight: 600;
  line-height: 56px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.popular-sports__icon {
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0);
  transition:
    transform 250ms cubic-bezier(0, 0, 0.58, 1),
    opacity 250ms linear;
}
.popular-sports__item--active .popular-sports__link,
.popular-sports__link:hover {
  color: var(--color-brand);
}
.popular-sports__item--active .popular-sports__icon,
.popular-sports__link:hover .popular-sports__icon {
  opacity: 1;
  transform: scale(1);
}
.popular-sports__all {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin-top: 24px;
  color: var(--color-brand);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-decoration: none;
}
.popular-sports__all:hover {
  text-decoration: underline;
}

.popular-sports__media {
  position: relative;
  min-height: 700px;
  overflow: hidden;
}
.popular-sports__stack {
  position: relative;
  width: 100%;
  max-width: 860px;
  aspect-ratio: 1 / 1;
  margin-top: 88px;
}
.popular-sports__card {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  transform-origin: left bottom;
  overflow: hidden;
  background: #f5f4f5;
  /* Live motion tokens: standard1 .6s + easeIn [.3,0,.1,1] — never display:none */
  transition:
    transform 600ms cubic-bezier(0.3, 0, 0.1, 1),
    opacity 600ms cubic-bezier(0.3, 0, 0.1, 1);
  will-change: transform, opacity;
  pointer-events: none;
}
.popular-sports__card--active {
  /* Live: active opacity is instant */
  transition:
    transform 600ms cubic-bezier(0.3, 0, 0.1, 1),
    opacity 0ms linear;
}
.popular-sports__card--prev {
  /* Live case -1: opacity quick2 (.34s) */
  transition:
    transform 600ms cubic-bezier(0.3, 0, 0.1, 1),
    opacity 340ms cubic-bezier(0.3, 0, 0.1, 1);
}
.popular-sports__card--stage {
  /* Live case 3: opacity instant after standard1 delay */
  transition:
    transform 600ms cubic-bezier(0.3, 0, 0.1, 1),
    opacity 0ms linear 600ms;
}
.popular-sports__card-link {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.popular-sports__card--active .popular-sports__card-link {
  pointer-events: auto;
}
.popular-sports__card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

@media (max-width: 1100px) {
  .popular-sports__label {
    font-size: 32px;
    line-height: 38px;
  }
  .popular-sports__grid {
    min-height: 0;
  }
  .popular-sports__stack {
    margin-top: 48px;
  }
}
@media (max-width: 800px) {
  .popular-sports__grid {
    grid-template-columns: 1fr;
  }
  .popular-sports__media {
    min-height: 360px;
    order: -1;
  }
  .popular-sports__label {
    font-size: 26px;
    line-height: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .popular-sports__card,
  .popular-sports__card--active,
  .popular-sports__card--prev,
  .popular-sports__card--stage,
  .popular-sports__icon {
    transition: none;
  }
}
</style>
