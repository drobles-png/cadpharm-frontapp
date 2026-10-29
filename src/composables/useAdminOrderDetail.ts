import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { orderDetailCopy, orderNextStep, orderStatus } from '@/config/admin.copy'
import { useAdminBadges } from '@/composables/useAdminBadges'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order, OrderStatus } from '@/types'

const FINISHED: OrderStatus[] = ['delivered', 'cancelled', 'failed']

export function useAdminOrderDetail() {
  const route = useRoute()
  const toast = useToastStore()
  const { refreshBadges } = useAdminBadges()

  const order = ref<Order | null>(null)
  const loading = ref(true)
  const notFound = ref(false)
  const updating = ref(false)

  async function load() {
    loading.value = true
    try {
      order.value = await adminService.order(String(route.params.id))
    } catch (e) {
      const err = e as ApiError
      if (err.status === 404) notFound.value = true
      else toast.error(err.message)
    } finally {
      loading.value = false
    }
  }

  const nextStep = computed(() => (order.value ? orderNextStep[order.value.status] : undefined))
  const canCancel = computed(() => !!order.value && !FINISHED.includes(order.value.status))

  async function changeStatus(status: OrderStatus, note?: string) {
    if (!order.value || updating.value) return false
    updating.value = true
    try {
      order.value = await adminService.updateOrderStatus(order.value._id, status, note?.trim())
      toast.success(orderDetailCopy.updated(orderStatus[status].label))
      refreshBadges()
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      updating.value = false
    }
  }

  onMounted(load)

  return { order, loading, notFound, updating, nextStep, canCancel, changeStatus }
}
