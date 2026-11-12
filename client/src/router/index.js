import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/pages/HomePage.vue'),
  },
  {
    path: '/tum-urunler',
    name: 'all-products',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: { mode: 'all' },
  },
  {
    path: '/tum-urunler/:slug',
    name: 'all-products-slug',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'collection', slug: r.params.slug }),
  },
  {
    path: '/kategori/:slug',
    name: 'category',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'category', slug: r.params.slug }),
  },
  {
    path: '/ekipmanlar/:slug',
    name: 'equipment',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'collection', slug: r.params.slug }),
  },
  {
    path: '/spor/:slug',
    name: 'sport',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'sport', slug: r.params.slug }),
  },
  {
    path: '/deals',
    name: 'deals',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: { mode: 'deals' },
  },
  {
    path: '/deals/seri-sonu',
    redirect: '/deals',
  },
  {
    path: '/deals/:slug',
    name: 'deals-slug',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'deals', slug: r.params.slug }),
  },
  {
    path: '/arama',
    name: 'search',
    component: () => import('@/components/pages/ProductListPage.vue'),
    props: (r) => ({ mode: 'search', q: r.query.q }),
  },
  {
    path: '/p/:slug',
    name: 'product',
    component: () => import('@/components/pages/ProductDetailPage.vue'),
    props: true,
  },
  {
    path: '/sepet',
    name: 'cart',
    component: () => import('@/components/pages/CartPage.vue'),
  },
  {
    path: '/odeme',
    name: 'checkout',
    component: () => import('@/components/pages/CheckoutPage.vue'),
  },
  {
    path: '/siparis/:orderNumber',
    name: 'order-success',
    component: () => import('@/components/pages/OrderSuccessPage.vue'),
    props: true,
  },
  {
    path: '/giris',
    name: 'login',
    component: () => import('@/components/pages/LoginPage.vue'),
  },
  {
    path: '/kayit',
    name: 'register',
    component: () => import('@/components/pages/RegisterPage.vue'),
  },
  {
    path: '/sifremi-unuttum',
    name: 'forgot-password',
    component: () => import('@/components/pages/ForgotPasswordPage.vue'),
  },
  {
    path: '/hesabim',
    name: 'account',
    component: () => import('@/components/pages/AccountPage.vue'),
  },
  {
    path: '/hesabim/siparisler',
    name: 'orders',
    component: () => import('@/components/pages/OrdersPage.vue'),
  },
  {
    path: '/hesabim/adresler',
    name: 'addresses',
    component: () => import('@/components/pages/AddressesPage.vue'),
  },
  {
    path: '/favoriler',
    name: 'wishlist',
    component: () => import('@/components/pages/WishlistPage.vue'),
  },
  {
    path: '/tum-sporlar',
    name: 'sports',
    component: () => import('@/components/pages/SportsIndexPage.vue'),
  },
  {
    path: '/magazalar',
    name: 'stores',
    component: () => import('@/components/pages/StoreLocatorPage.vue'),
  },
  {
    path: '/magaza/:slug',
    name: 'store-detail',
    component: () => import('@/components/pages/StoreDetailPage.vue'),
    props: true,
  },
  {
    path: '/sayfa/:slug',
    name: 'cms',
    component: () => import('@/components/pages/CmsPage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/components/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
