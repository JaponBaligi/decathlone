import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useCatalogStore } from './stores/catalog'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)
const cart = useCartStore(pinia)
const catalog = useCatalogStore(pinia)

Promise.all([auth.bootstrap(), cart.fetchCart(), catalog.loadNav()]).finally(() => {
  app.mount('#app')
})
