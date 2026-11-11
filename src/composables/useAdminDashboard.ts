import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminBadges } from '@/composables/useAdminBadges'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Lead } from '@/types'

const RECENT_LEADS = 5

export interface DashboardStats {
  products: number
  published: number
  featured: number
  newLeads: number
  totalLeads: number
}

/**
 * El resumen se arma con los mismos endpoints de productos y mensajes que usa
 * el resto del panel: la web ya no vende, así que no hay métricas de ventas.
 */
export function useAdminDashboard() {
  const stats = ref<DashboardStats | null>(null)
  const recentLeads = ref<Lead[]>([])
  const loading = ref(true)
  const toast = useToastStore()
  const { setNewLeads } = useAdminBadges()

  async function load() {
    loading.value = true
    // allSettled: si un endpoint falla, el resto del resumen igual se muestra.
    const [products, latest, fresh] = await Promise.allSettled([
      adminService.products(),
      adminService.leads({ limit: RECENT_LEADS }),
      adminService.leads({ status: 'new', limit: 1 }),
    ])

    const list = products.status === 'fulfilled' ? products.value : []
    const newLeads = fresh.status === 'fulfilled' ? fresh.value.total : 0
    stats.value = {
      products: list.length,
      published: list.filter((p) => p.isPublished).length,
      featured: list.filter((p) => p.featured).length,
      newLeads,
      totalLeads: latest.status === 'fulfilled' ? latest.value.total : 0,
    }
    recentLeads.value = latest.status === 'fulfilled' ? latest.value.items : []
    if (fresh.status === 'fulfilled') setNewLeads(newLeads)

    const failed = [products, latest, fresh].find((r) => r.status === 'rejected')
    if (failed) toast.error(((failed as PromiseRejectedResult).reason as ApiError).message)
    loading.value = false
  }

  onMounted(load)

  return { stats, recentLeads, loading, load }
}
