<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()
const { user, isAuthenticated } = storeToRefs(auth)

function logout() {
  auth.logout()
  router.push('/giris')
}
</script>

<template>
  <div class="container page">
    <template v-if="isAuthenticated">
      <h1>Hesabım</h1>
      <p>Merhaba, {{ user.firstName }} {{ user.lastName }}</p>
      <div class="links">
        <RouterLink to="/hesabim/siparisler">Siparişlerim</RouterLink>
        <RouterLink to="/hesabim/adresler">Adreslerim</RouterLink>
        <RouterLink to="/favoriler">Favorilerim</RouterLink>
      </div>
      <BaseButton variant="secondary" @click="logout">Çıkış Yap</BaseButton>
    </template>
    <template v-else>
      <h1>Hesabım</h1>
      <p>Devam etmek için giriş yapın.</p>
      <RouterLink to="/giris"><BaseButton>Giriş</BaseButton></RouterLink>
    </template>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.links {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-4) 0;
}
.links a {
  color: var(--color-brand);
  font-weight: 600;
}
</style>
