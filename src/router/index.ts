import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

const adminMeta = { requiresAuth: true, requiresAdmin: true, layout: 'admin' } as const

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/productos',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { title: 'Productos' },
  },
  {
    path: '/productos/:slug',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/profesionales',
    name: 'Professionals',
    component: () => import('@/views/ProfessionalsView.vue'),
    meta: { title: 'Profesionales de la salud' },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Nosotros' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra' },
  },
  {
    path: '/pedido/:orderNumber',
    name: 'OrderSuccess',
    component: () => import('@/views/OrderSuccessView.vue'),
    meta: { title: 'Pedido recibido' },
  },
  {
    // URL de respuesta registrada en Payphone Developer: no cambiarla sin avisar.
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando pago' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar', guestOnly: true, layout: 'bare' },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: adminMeta,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { ...adminMeta, title: 'Panel' },
      },
      {
        path: 'pedidos',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { ...adminMeta, title: 'Pedidos' },
      },
      {
        path: 'pedidos/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/AdminOrderDetailView.vue'),
        meta: { ...adminMeta, title: 'Pedido' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { ...adminMeta, title: 'Productos' },
      },
      {
        path: 'productos/nuevo',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { ...adminMeta, title: 'Nuevo producto' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { ...adminMeta, title: 'Editar producto' },
      },
      {
        path: 'mensajes',
        name: 'AdminLeads',
        component: () => import('@/views/admin/AdminLeadsView.vue'),
        meta: { ...adminMeta, title: 'Mensajes' },
      },
    ],
  },
  {
    path: '/cuenta',
    redirect: '/admin',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección (dejando aire para el header fijo); si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 90 }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'Login', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return { name: userStore.isAdmin ? 'AdminDashboard' : 'Home', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title =
    title && title !== site.name ? `${title} — ${site.name}` : `${site.name} Laboratorio`
})

export default router
