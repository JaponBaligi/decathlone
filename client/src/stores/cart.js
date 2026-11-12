import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    itemCount: 0,
    subtotalLabel: '₺0,00',
    subtotalKurus: 0,
    loading: false,
  }),
  actions: {
    async fetchCart() {
      this.loading = true
      try {
        const data = await api('/cart')
        this.items = data.items
        this.itemCount = data.itemCount
        this.subtotalLabel = data.subtotalLabel
        this.subtotalKurus = data.subtotalKurus
      } finally {
        this.loading = false
      }
    },
    async addItem(variantId, quantity = 1) {
      const data = await api('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity }),
      })
      this.items = data.items
      this.itemCount = data.itemCount
      this.subtotalLabel = data.subtotalLabel
      this.subtotalKurus = data.subtotalKurus
      return data
    },
    async updateQty(id, quantity) {
      const data = await api(`/cart/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      })
      this.items = data.items
      this.itemCount = data.itemCount
      this.subtotalLabel = data.subtotalLabel
      this.subtotalKurus = data.subtotalKurus
    },
    async removeItem(id) {
      const data = await api(`/cart/items/${id}`, { method: 'DELETE' })
      this.items = data.items
      this.itemCount = data.itemCount
      this.subtotalLabel = data.subtotalLabel
      this.subtotalKurus = data.subtotalKurus
    },
  },
})
