<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { api } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const router = useRouter()
const cart = useCartStore()
const { items, subtotalLabel } = storeToRefs(cart)
const stores = ref([])
const error = ref('')
const form = reactive({
  deliveryType: 'home',
  paymentMethod: 'card',
  storeId: '',
  fullName: '',
  phone: '',
  city: 'İstanbul',
  district: '',
  line1: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
})

onMounted(async () => {
  await cart.fetchCart()
  stores.value = await api('/stores')
  if (stores.value[0]) form.storeId = String(stores.value[0].id)
})

async function placeOrder() {
  error.value = ''
  try {
    const payload = {
      deliveryType: form.deliveryType,
      paymentMethod: form.paymentMethod,
      storeId: form.deliveryType === 'store' ? Number(form.storeId) : null,
      address:
        form.deliveryType === 'home'
          ? {
              fullName: form.fullName,
              phone: form.phone,
              city: form.city,
              district: form.district,
              line1: form.line1,
            }
          : null,
    }
    const order = await api('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    await cart.fetchCart()
    router.push({ name: 'order-success', params: { orderNumber: order.orderNumber } })
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div class="container checkout">
    <h1>Ödeme</h1>
    <p v-if="!items.length">Sepet boş. Önce ürün ekleyin.</p>
    <form v-else class="checkout__grid" @submit.prevent="placeOrder">
      <section>
        <h2>Teslimat</h2>
        <label class="radio"
          ><input v-model="form.deliveryType" type="radio" value="home" /> Adrese teslim</label
        >
        <label class="radio"
          ><input v-model="form.deliveryType" type="radio" value="store" /> Mağazadan teslim</label
        >

        <div v-if="form.deliveryType === 'home'" class="fields">
          <BaseInput v-model="form.fullName" placeholder="Ad Soyad" required />
          <BaseInput v-model="form.phone" placeholder="Telefon" required />
          <BaseInput v-model="form.city" placeholder="Şehir" required />
          <BaseInput v-model="form.district" placeholder="İlçe" required />
          <BaseInput v-model="form.line1" placeholder="Adres" required />
        </div>
        <div v-else class="fields">
          <label>
            Mağaza
            <select v-model="form.storeId" required>
              <option v-for="s in stores" :key="s.id" :value="String(s.id)">
                {{ s.name }} — {{ s.city }}
              </option>
            </select>
          </label>
        </div>

        <h2>Ödeme (mock)</h2>
        <BaseInput v-model="form.cardNumber" placeholder="Kart numarası" required />
        <div class="row">
          <BaseInput v-model="form.cardExpiry" placeholder="AA/YY" required />
          <BaseInput v-model="form.cardCvc" placeholder="CVC" required />
        </div>
      </section>
      <aside>
        <h2>Sipariş özeti</h2>
        <ul>
          <li v-for="item in items" :key="item.id">
            {{ item.product.name }} × {{ item.quantity }} — {{ item.lineTotalLabel }}
          </li>
        </ul>
        <p><strong>Ara toplam: {{ subtotalLabel }}</strong></p>
        <BaseButton type="submit" block>Siparişi Onayla</BaseButton>
        <p v-if="error" class="err">{{ error }}</p>
      </aside>
    </form>
  </div>
</template>

<style scoped>
.checkout {
  padding-block: var(--space-5);
}
.checkout__grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-5);
}
section,
aside {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}
.fields,
.row {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-3) 0 var(--space-4);
}
.row {
  grid-template-columns: 1fr 1fr;
}
.radio {
  display: block;
  margin-bottom: var(--space-2);
}
select {
  display: block;
  width: 100%;
  min-height: 44px;
  margin-top: var(--space-2);
}
.err {
  color: var(--color-danger);
}
@media (max-width: 900px) {
  .checkout__grid {
    grid-template-columns: 1fr;
  }
}
</style>
