import { defineStore } from 'pinia'
import { api, getToken, setToken } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false,
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.user),
    displayName: (s) => (s.user ? `${s.user.firstName} ${s.user.lastName}` : ''),
  },
  actions: {
    async bootstrap() {
      if (!getToken()) {
        this.loaded = true
        return
      }
      try {
        const data = await api('/auth/me')
        this.user = data.user
      } catch {
        setToken(null)
        this.user = null
      } finally {
        this.loaded = true
      }
    },
    async login(payload) {
      const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
      setToken(data.token)
      this.user = data.user
      return data.user
    },
    async register(payload) {
      const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
      setToken(data.token)
      this.user = data.user
      return data.user
    },
    logout() {
      setToken(null)
      this.user = null
    },
  },
})
