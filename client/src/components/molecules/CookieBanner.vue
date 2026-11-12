<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'

const visible = ref(false)

function showBanner() {
  visible.value = true
}

onMounted(() => {
  visible.value = localStorage.getItem('dct_cookies') !== '1'
  window.addEventListener('decathlon:open-cookie-settings', showBanner)
})

onUnmounted(() => {
  window.removeEventListener('decathlon:open-cookie-settings', showBanner)
})

function accept() {
  localStorage.setItem('dct_cookies', '1')
  visible.value = false
}
</script>

<template>
  <div v-if="visible" class="cookie" role="dialog" aria-label="Çerez bildirimi">
    <p>
      Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Detaylar için
      <RouterLink to="/sayfa/cerez-politikasi">Çerez Politikası</RouterLink>.
    </p>
    <div class="cookie__actions">
      <BaseButton variant="brand" @click="accept">Tümünü Kabul Et</BaseButton>
      <BaseButton variant="secondary" @click="accept">Ayarlar</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.cookie {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 60;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: var(--shadow-md);
}
.cookie p {
  margin: 0;
  color: var(--color-muted);
  font-size: 14px;
  max-width: 70ch;
}
.cookie a {
  color: var(--color-brand);
  text-decoration: underline;
}
.cookie__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
@media (max-width: 800px) {
  .cookie {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
