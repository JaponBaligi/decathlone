<script setup>
import { ref } from 'vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const email = ref('')
const sent = ref(false)

function submit() {
  sent.value = true
}
</script>

<template>
  <div class="container page">
    <form class="card" @submit.prevent="submit">
      <h1>Şifremi Unuttum</h1>
      <p>E-posta adresine sıfırlama bağlantısı gönderilir (stub).</p>
      <BaseInput v-model="email" type="email" placeholder="E-posta" required />
      <BaseButton type="submit" block>Gönder</BaseButton>
      <p v-if="sent" class="ok">Talep alındı. (Gerçek e-posta gönderilmez.)</p>
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
.ok {
  color: var(--color-success);
}
</style>
