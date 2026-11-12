<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const INTERVAL_MS = 4500
const STORAGE_KEY = 'dct_promo_closed'

const slides = [
  {
    id: 'november',
    tone: 'black',
    to: '/deals/kasim-indirimleri',
    prefix: 'Online Özel Kasım İndirimlerini',
    link: 'Keşfet!',
  },
  {
    id: 'shipping',
    tone: 'brand',
    to: '/tum-urunler',
    prefix: 'Mobil uygulamaya özel 3.000 TL ve üzeri alışverişlerde',
    link: 'kargo ücretsiz!',
  },
  {
    id: 'deals',
    tone: 'sales',
    to: '/deals',
    prefix: 'Tüm indirimli ürünleri',
    link: 'keşfet!',
  },
]

const closed = ref(false)
const paused = ref(false)
const index = ref(0)
let timer = null

const tone = computed(() => slides[index.value].tone)

function next() {
  index.value = (index.value + 1) % slides.length
}

function start() {
  stop()
  if (paused.value || closed.value) return
  timer = window.setInterval(next, INTERVAL_MS)
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function togglePause() {
  paused.value = !paused.value
  if (paused.value) stop()
  else start()
}

function close() {
  closed.value = true
  stop()
  localStorage.setItem(STORAGE_KEY, '1')
}

onMounted(() => {
  closed.value = localStorage.getItem(STORAGE_KEY) === '1'
  if (!closed.value) start()
})

onBeforeUnmount(stop)
</script>

<template>
  <div
    v-if="!closed"
    class="banner"
    :class="`banner--${tone}`"
    role="region"
    aria-label="Duyuru bandı"
  >
    <div class="banner__content">
      <div class="banner__messages">
        <div
          v-for="(slide, i) in slides"
          :key="slide.id"
          class="banner__message"
          :class="i === index ? 'banner__message--displayed' : 'banner__message--hidden'"
          :aria-hidden="i !== index"
          :inert="i !== index"
        >
          <span class="banner__text">{{ slide.prefix }}&nbsp;</span><RouterLink
            :to="slide.to"
            class="banner__link"
            :tabindex="i === index ? 0 : -1"
          >{{ slide.link }}</RouterLink>
        </div>
      </div>

      <div class="banner__actions">
        <button
          type="button"
          class="banner__btn"
          :aria-label="paused ? 'Oynat başlığı' : 'Duraklatma başlığı'"
          :aria-pressed="paused"
          @click="togglePause"
        >
          <!-- Live Decathlon pause: circle + bars -->
          <svg
            v-if="!paused"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M13.5334 9.2222V14.7778M10.4667 9.2222V14.7778M21.1667 12C21.1667 17.0666 17.0667 21.1666 12 21.1666C6.93337 21.1666 2.83337 17.0666 2.83337 12C2.83337 6.93331 6.93337 2.83331 12 2.83331C17.0667 2.83331 21.1667 6.93331 21.1667 12Z"
              stroke="currentColor"
            />
          </svg>
          <!-- Live Decathlon play: circle + triangle -->
          <svg
            v-else
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M21.1667 12C21.1667 17.0666 17.0667 21.1666 12 21.1666C6.93337 21.1666 2.83337 17.0666 2.83337 12C2.83337 6.93331 6.93337 2.83331 12 2.83331C17.0667 2.83331 21.1667 6.93331 21.1667 12Z"
              stroke="currentColor"
            />
            <path
              d="M12.7001 13.5666L10.2001 15.1333V8.86664L12.7001 10.4333L15.2001 12L12.7001 13.5666Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button type="button" class="banner__btn" aria-label="Kapat" @click="close">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M17.7 6.29999L6.30005 17.7M17.7 17.7L6.30005 6.29999" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner {
  color: #fff;
  padding: 0 var(--page-gutter);
  transition: background-color 250ms cubic-bezier(0.65, 0, 0.35, 0.75);
}
.banner--black {
  background: #101010;
}
.banner--brand {
  background: #3643ba;
}
.banner--sales {
  background: #d70321;
}

.banner__content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 8px 0;
  margin: 0 auto;
}

.banner__messages {
  display: grid;
  grid-column: 2;
  place-items: center;
}

.banner__message {
  display: flex;
  grid-area: 1 / 1;
  align-items: center;
  justify-content: center;
  gap: 0;
  text-align: center;
  transition: opacity 250ms cubic-bezier(0.65, 0, 0.35, 0.75);
}
.banner__message--displayed {
  opacity: 1;
}
.banner__message--hidden {
  opacity: 0;
  pointer-events: none;
}

.banner__text,
.banner__link {
  font-family: 'Decathlon VF', Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
.banner__link {
  text-decoration: underline;
  text-underline-offset: 1px;
  text-decoration-thickness: 1px;
  font-weight: 500;
  color: inherit;
}
.banner__link:hover {
  opacity: 0.92;
}

.banner__actions {
  grid-column: 3;
  justify-self: end;
  white-space: nowrap;
  display: block;
}

.banner__btn {
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
  vertical-align: top;
}
.banner__btn svg {
  width: 20px;
  height: 20px;
}
.banner__btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .banner__content {
    grid-template-columns: 1fr auto;
  }
  .banner__messages {
    grid-column: 1;
    justify-self: start;
  }
  .banner__actions {
    grid-column: 2;
  }
  .banner__message {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .banner__text,
  .banner__link {
    font-size: 13px;
  }
}
</style>
