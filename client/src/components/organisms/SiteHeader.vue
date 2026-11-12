<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseLogo from '@/components/atoms/BaseLogo.vue'
import SearchBar from '@/components/molecules/SearchBar.vue'
import PromoBanner from '@/components/molecules/PromoBanner.vue'
import NavMegaMenu from '@/components/molecules/NavMegaMenu.vue'
import { primaryNav } from '@/data/navMenus'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const { isAuthenticated } = storeToRefs(auth)
const { itemCount } = storeToRefs(cart)

/** Live /deals PLP: header scrolls away with the page (no stick-on-scroll-up) */
const stickyEnabled = computed(
  () => route.name !== 'deals' && route.name !== 'deals-slug',
)

const secondaryNav = [
  { to: '/sayfa/member-avantajlari', label: 'Mobil Uygulama 📱' },
  { to: '/sayfa/magazadan-teslim', label: 'Servisler' },
  { to: '/sayfa/member-avantajlari', label: 'Decathlon Member' },
]

const openMenuId = ref(null)
const activeMenu = computed(() => primaryNav.find((i) => i.id === openMenuId.value)?.menu || null)
let closeTimer = 0

/** Live horizontal-menu opens on hover (pointer enter), not click-only */
function openMenu(id) {
  clearTimeout(closeTimer)
  openMenuId.value = id
}

function scheduleClose() {
  clearTimeout(closeTimer)
  // Live keeps a short grace period while moving into the panel
  closeTimer = window.setTimeout(() => {
    openMenuId.value = null
  }, 180)
}

function closeMenu() {
  clearTimeout(closeTimer)
  openMenuId.value = null
}

function onDocPointerDown(e) {
  const nav = e.target?.closest?.('.header__nav')
  if (!nav) closeMenu()
}

/**
 * Live Decathlon header scroll behaviour:
 * - At top: relative, under promo
 * - Scroll down: header leaves with the page
 * - Scroll up: fixed + show-header CSS animation (translateY -100% → 0, 600ms)
 * - Scroll down while fixed: hide-header animation, then unpin
 * (Live uses position:sticky; we use fixed so the open animation works inside .layout flex.)
 */
const sticky = ref(false)
const showing = ref(false)
const hiding = ref(false)
const headerEl = ref(null)
const headerH = ref(133)
let lastY = 0
let animTimer = 0
const ANIM_MS = 600

function measure() {
  if (!headerEl.value || sticky.value) return
  headerH.value = headerEl.value.offsetHeight || 133
}

function reset() {
  clearTimeout(animTimer)
  sticky.value = false
  showing.value = false
  hiding.value = false
}

async function openSticky() {
  clearTimeout(animTimer)
  hiding.value = false
  showing.value = false
  measure()
  sticky.value = true
  // Restart show-header keyframes (live: .header--show)
  await nextTick()
  showing.value = true
}

function closeSticky() {
  if (!sticky.value || hiding.value) return
  showing.value = false
  hiding.value = true
  clearTimeout(animTimer)
  animTimer = window.setTimeout(reset, ANIM_MS)
}

function onScroll() {
  if (!stickyEnabled.value) {
    if (sticky.value) reset()
    return
  }

  const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0)
  const delta = y - lastY
  lastY = y

  if (y <= 8) {
    reset()
    return
  }

  if (Math.abs(delta) < 1) return

  const h = headerH.value || 133

  if (delta < 0 && y > h + 48) {
    if (!sticky.value || hiding.value) openSticky()
    return
  }

  if (delta > 0 && sticky.value) {
    closeSticky()
  }
}

watch(stickyEnabled, (enabled) => {
  if (!enabled) reset()
})

onMounted(() => {
  measure()
  lastY = window.scrollY || document.documentElement.scrollTop || 0
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  document.addEventListener('pointerdown', onDocPointerDown, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  document.removeEventListener('pointerdown', onDocPointerDown, true)
  clearTimeout(animTimer)
  clearTimeout(closeTimer)
})
</script>

<template>
  <PromoBanner />

  <!-- Spacer keeps document flow while header is position:fixed -->
  <div class="header-anchor" :style="sticky ? { height: headerH + 'px' } : undefined">
    <header
      ref="headerEl"
      class="header"
      :class="{
        'header--sticky': sticky,
        'header--show': showing,
        'header--hide': hiding,
      }"
    >
    <div class="header__main container">
      <BaseLogo />
      <SearchBar class="header__search" />
      <nav class="header__utils" aria-label="Hızlı erişim">
        <RouterLink to="/magazalar" class="util" aria-label="Tercih edilen mağaza belirle">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M7.79297 12.9664V5.56748L21.2162 5.5675V13.0649L7.79297 13.0649V12.9664ZM7.79297 12.9664V17.9903M7.79297 8.57318L2.78662 8.57321V17.9903H16.2148V12.9664M21.2162 12.9664V18.7783"
              stroke="currentColor"
            />
          </svg>
        </RouterLink>
        <RouterLink to="/sayfa/sss" class="util" aria-label="Yardım">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M11.6 14.7C11.6 14.2 11.7 13.7 12.1 13.3C12.6 12.7 13.3 12.5 13.8 12C14.3 11.5 14.6 10.8 14.6 10.2C14.6 8.79999 13.4 7.59999 12 7.59999C10.6 7.59999 9.50005 8.69999 9.40005 9.99999C9.40005 10.1 9.40005 10.4 9.40005 10.4M21.2001 12C21.2001 17.081 17.0811 21.2 12 21.2C6.91903 21.2 2.80005 17.081 2.80005 12C2.80005 6.91897 6.91903 2.79999 12 2.79999C17.0811 2.79999 21.2001 6.91897 21.2001 12Z"
              stroke="currentColor"
            />
            <path
              d="M11.6001 17.5C12.0971 17.5 12.5001 17.0971 12.5001 16.6C12.5001 16.103 12.0971 15.7 11.6001 15.7C11.103 15.7 10.7001 16.103 10.7001 16.6C10.7001 17.0971 11.103 17.5 11.6001 17.5Z"
              fill="currentColor"
            />
          </svg>
        </RouterLink>
        <RouterLink
          :to="isAuthenticated ? '/hesabim' : '/giris'"
          class="util"
          :aria-label="isAuthenticated ? 'Hesabım' : 'Giriş yap veya kayıt ol'"
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
            <path
              d="M5 22C5 16.1 8.1 12.3 12 12.2C15.9 12.1 19 16 19 21.9M12 2.79999C10.1 2.79999 8.5 4.39999 8.5 6.29999C8.5 8.19999 10.1 9.79999 12 9.79999C13.9 9.79999 15.5 8.19999 15.5 6.29999C15.5 4.39999 13.9 2.79999 12 2.79999Z"
              stroke="currentColor"
            />
          </svg>
        </RouterLink>
        <RouterLink to="/sepet" class="util util--cart" aria-label="Sepetim">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M8.20002 8.49999C8.20002 4.99999 9.90002 2.79999 12 2.79999C14.1 2.79999 15.8 5.09999 15.8 8.49999M5.00002 20.5C5.10002 21 5.50002 21.3 6.00002 21.3H18C18.5 21.3 18.9 21 19 20.5L21.1 10.8H2.90002L5.00002 20.5Z"
              stroke="currentColor"
            />
          </svg>
          <i v-if="itemCount" class="util__badge">{{ itemCount }}</i>
        </RouterLink>
      </nav>
    </div>

    <nav
      class="header__nav"
      aria-label="Ana menü"
      @pointerleave="scheduleClose"
    >
      <div class="container header__nav-inner">
        <div class="header__nav-left">
          <div
            v-for="item in primaryNav"
            :key="item.id"
            class="header__nav-item"
            @pointerenter="openMenu(item.id)"
          >
            <button
              type="button"
              class="header__nav-link"
              :class="{ 'header__nav-link--active': openMenuId === item.id }"
              :aria-expanded="openMenuId === item.id"
              :aria-controls="`mega-${item.id}`"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
        <div class="header__nav-right" @pointerenter="closeMenu">
          <RouterLink v-for="item in secondaryNav" :key="item.label" :to="item.to">
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <div
        v-if="activeMenu"
        class="header__mega-wrap"
        @pointerenter="openMenu(openMenuId)"
      >
        <NavMegaMenu :id="`mega-${openMenuId}`" :menu="activeMenu" />
      </div>
    </nav>
    </header>
  </div>
</template>

<style scoped>
.header-anchor {
  position: relative;
  z-index: 1020;
}

.header {
  position: relative;
  z-index: 1020;
  background: #fff;
  overflow: visible;
  /* Live header.header padding-bottom — white space under category nav */
  padding-bottom: 16px;
}

.header--sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
}

.header--show {
  animation: show-header 600ms cubic-bezier(0.42, 0, 1, 1) forwards;
}

.header--hide {
  animation: hide-header 600ms cubic-bezier(0.42, 0, 1, 1) forwards;
}

@keyframes show-header {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes hide-header {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

.header__main {
  /* Live .header__container ≈ 96px tall */
  display: grid;
  grid-template-columns: 188px 1fr auto;
  align-items: center;
  gap: 24px;
  height: 96px;
  padding: 0;
  box-sizing: border-box;
}
.header__search {
  justify-self: center;
  width: 100%;
  max-width: 888px;
}
.header__utils {
  display: flex;
  align-items: center;
  gap: 0;
}
.util {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  color: var(--color-ink);
}
.util svg {
  width: 24px;
  height: 24px;
}
.util:hover {
  background: var(--color-canvas-soft);
}
.util__badge {
  position: absolute;
  top: 6px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--color-deal);
  color: #fff;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.header__nav {
  position: relative;
  /* Live .horizontal-menu ≈ 21px; header keeps 16px white pad below */
  padding-bottom: 0;
  overflow: visible;
}
.header__nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 0;
  height: 21px;
  overflow: hidden;
}
.header__nav-left,
.header__nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  height: 21px;
}
.header__nav-left::-webkit-scrollbar,
.header__nav-right::-webkit-scrollbar {
  display: none;
}
.header__nav-item {
  flex-shrink: 0;
}
.header__nav-link,
.header__nav-right a {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  color: var(--color-ink);
  text-decoration: none;
}
.header__nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  cursor: pointer;
  /* Underline via shadow so nav stays ~21px like live (no border-box growth) */
  box-shadow: inset 0 -2px 0 transparent;
}
.header__nav-link--active,
.header__nav-link[aria-expanded='true'] {
  box-shadow: inset 0 -2px 0 #101010;
  font-weight: 600;
}
.header__nav-link:hover,
.header__nav-right a:hover {
  text-decoration: underline;
}
.header__mega-wrap {
  position: absolute;
  left: 0;
  right: 0;
  /* Sit under header’s 16px bottom pad (live mega opens below chrome) */
  top: calc(100% + 16px);
  margin-top: -1px;
}
.header__mega-wrap::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -16px;
  height: 16px;
}
@media (max-width: 1100px) {
  .header__main {
    grid-template-columns: auto 1fr auto;
  }
  .header__nav-right {
    display: none;
  }
}
@media (max-width: 760px) {
  .header__main {
    grid-template-columns: auto auto;
    justify-content: space-between;
  }
  .header__search {
    grid-column: 1 / -1;
    justify-self: stretch;
    max-width: none;
  }
}
</style>
