<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()
const error = ref('')
const form = reactive({ email: 'demo@decathlon.local', password: 'demo1234' })

async function submit() {
  error.value = ''
  try {
    await auth.login(form)
    router.push('/hesabim')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="container page">
    <form class="card" @submit.prevent="submit">
      <h1>Giriş Yap</h1>
      <BaseInput v-model="form.email" type="email" placeholder="E-posta" required />
      <BaseInput v-model="form.password" type="password" placeholder="Şifre" required />
      <BaseButton type="submit" block>Giriş</BaseButton>
      <p v-if="error" class="err">{{ error }}</p>
      <p><RouterLink to="/sifremi-unuttum">Şifremi unuttum</RouterLink></p>
      <p>Hesabın yok mu? <RouterLink to="/kayit">Kayıt ol</RouterLink></p>
    </form>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-6);
  display: grid;
  place-items: center;
}
.card {
  width: min(100%, 420px);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: grid;
  gap: var(--space-3);
}
.err {
  color: var(--color-danger);
}
</style>
