import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { orderStatus } from '@/config/admin.copy'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order, OrderStatus } from '@/types'

const PAGE_SIZE = 15
const STATUSES = Object.keys(orderStatus) as OrderStatus[]

/**
 * Lista de pedidos con filtros. Los filtros viven en la URL: al volver desde
 * el detalle, la lista queda exactamente como estaba.
 */
export function useAdminOrders() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const status = ref<OrderStatus | ''>((route.query.status as OrderStatus) || '')
  const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
  const page = ref(Number(route.query.page) || 1)

  const orders = ref<Order[]>([])
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(true)
  const counts = ref<Record<string, number>>({})

  let requestId = 0
  let debounce: ReturnType<typeof setTimeout> | undefined

  async function load() {
    const id = ++requestId
    loading.value = true
    try {
      const res = await adminService.orders({
        status: status.value,
        q: q.value.trim(),
        page: page.value,
        limit: PAGE_SIZE,
      })
      // Una respuesta lenta de una búsqueda vieja no debe pisar la nueva.
      if (id !== requestId) return
      orders.value = res.items
      total.value = res.total
      pages.value = Math.max(1, res.pages)
    } catch (e) {
      if (id === requestId) toast.error((e as ApiError).message)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  /** El API no trae conteos por estado: se piden con limit=1 y se lee el total. */
  async function loadCounts() {
    const search = q.value.trim()
    const results = await Promise.allSettled(
      ['', ...STATUSES].map((s) =>
        adminService.orders({ status: s as OrderStatus | '', q: search, limit: 1 }),
      ),
    )
    const next: Record<string, number> = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') next[i === 0 ? 'all' : STATUSES[i - 1]!] = r.value.total
    })
    counts.value = next
  }

  function syncUrl() {
    const query: Record<string, string> = {}
    if (status.value) query.status = status.value
    if (q.value.trim()) query.q = q.value.trim()
    if (page.value > 1) query.page = String(page.value)
    router.replace({ query })
  }

  watch(status, () => {
    page.value = 1
    syncUrl()
    load()
  })

  watch(page, () => {
    syncUrl()
    load()
  })

  watch(q, () => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      const changedPage = page.value !== 1
      page.value = 1
      if (!changedPage) {
        syncUrl()
        load()
      }
      loadCounts()
    }, 350)
  })

  onMounted(() => {
    load()
    loadCounts()
  })
  onUnmounted(() => clearTimeout(debounce))

  return { status, q, page, pages, total, orders, loading, counts, statuses: STATUSES, load }
}
