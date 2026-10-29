import { computed, onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useAdminBadges } from '@/composables/useAdminBadges'
import { useToastStore } from '@/stores/toast'
import type { AdminStats, ApiError } from '@/types'

export function useAdminDashboard() {
  const stats = ref<AdminStats | null>(null)
  const loading = ref(true)
  const toast = useToastStore()
  const { applyStats } = useAdminBadges()

  async function load() {
    loading.value = true
    try {
      stats.value = await adminService.stats()
      applyStats(stats.value)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  /** Variación porcentual vs. mes anterior; null si no hay base para comparar. */
  const revenueDelta = computed(() => {
    const s = stats.value
    if (!s || !s.revenuePrevMonth) return null
    return ((s.revenueMonth - s.revenuePrevMonth) / s.revenuePrevMonth) * 100
  })

  const hasSales = computed(() => {
    const s = stats.value
    if (!s) return false
    return s.ordersMonth > 0 || s.salesByDay.some((d) => d.total > 0) || s.recentOrders.length > 0
  })

  onMounted(load)

  return { stats, loading, load, revenueDelta, hasSales }
}
