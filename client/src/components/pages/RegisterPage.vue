<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const router = useRouter()
const error = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
})

async function submit() {
  error.value = ''
  try {
    await auth.register(form)
    router.push('/hesabim')
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="container page">
    <form class="card" @submit.prevent="submit">
      <h1>Üye Ol</h1>
      <BaseInput v-model="form.firstName" placeholder="Ad" required />
      <BaseInput v-model="form.lastName" placeholder="Soyad" required />
      <BaseInput v-model="form.email" type="email" placeholder="E-posta" required />
      <BaseInput v-model="form.phone" placeholder="Telefon" />
      <BaseInput v-model="form.password" type="password" placeholder="Şifre" required />
      <label class="check"
        ><input type="checkbox" required /> Üyelik sözleşmesini ve KVKK metnini okudum.</label
      >
      <BaseButton type="submit" block>Kayıt Ol</BaseButton>
      <p v-if="error" class="err">{{ error }}</p>
      <p>Zaten üye misin? <RouterLink to="/giris">Giriş yap</RouterLink></p>
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
.check {
  font-size: 0.9rem;
}
.err {
  color: var(--color-danger);
}
</style>
