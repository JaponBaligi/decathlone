import { defineStore } from 'pinia'
import { api } from '@/services/api'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [],
    sports: [],
    cmsNav: null,
  }),
  actions: {
    async loadNav() {
      const [categories, sports, cmsNav] = await Promise.all([
        api('/catalog/categories'),
        api('/catalog/sports'),
        api('/cms'),
      ])
      this.categories = categories
      this.sports = sports
      this.cmsNav = cmsNav
    },
  },
})
