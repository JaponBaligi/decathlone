<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const auth = useAuthStore()
const addresses = ref([])
const form = reactive({
  title: 'Ev',
  fullName: '',
  phone: '',
  city: '',
  district: '',
  line1: '',
  isDefault: true,
})

async function load() {
  if (!auth.isAuthenticated) return
  addresses.value = await api('/account/addresses')
}

async function addAddress() {
  await api('/account/addresses', { method: 'POST', body: JSON.stringify(form) })
  await load()
}

async function removeAddress(id) {
  await api(`/account/addresses/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(load)
</script>

<template>
  <div class="container page">
    <h1>Adreslerim</h1>
    <p v-if="!auth.isAuthenticated">Giriş yapmanız gerekiyor. <RouterLink to="/giris">Giriş</RouterLink></p>
    <template v-else>
      <ul class="list">
        <li v-for="a in addresses" :key="a.id">
          <div>
            <strong>{{ a.title }}</strong> — {{ a.fullName }}
            <p>{{ a.line1 }}, {{ a.district }}/{{ a.city }}</p>
          </div>
          <BaseButton variant="ghost" @click="removeAddress(a.id)">Sil</BaseButton>
        </li>
      </ul>
      <form class="card" @submit.prevent="addAddress">
        <h2>Yeni adres</h2>
        <BaseInput v-model="form.title" placeholder="Başlık" required />
        <BaseInput v-model="form.fullName" placeholder="Ad Soyad" required />
        <BaseInput v-model="form.phone" placeholder="Telefon" required />
        <BaseInput v-model="form.city" placeholder="Şehir" required />
        <BaseInput v-model="form.district" placeholder="İlçe" required />
        <BaseInput v-model="form.line1" placeholder="Adres satırı" required />
        <BaseButton type="submit">Kaydet</BaseButton>
      </form>
    </template>
  </div>
</template>

<style scoped>
.page {
  padding-block: var(--space-5);
}
.list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-2);
}
.list li {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
}
.card {
  margin-top: var(--space-5);
  display: grid;
  gap: var(--space-3);
  max-width: 480px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
</style>
