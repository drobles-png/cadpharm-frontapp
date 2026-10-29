import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats } from '@/types'

/**
 * Contadores de la navegación (pedidos pendientes, mensajes nuevos). Estado de
 * módulo: el layout los pinta y cualquier vista que cambie un estado los
 * refresca sin tener que pasarse props.
 */
const pendingOrders = ref(0)
const newLeads = ref(0)

function applyStats(stats: Pick<AdminStats, 'pendingOrders' | 'newLeads'>) {
  pendingOrders.value = stats.pendingOrders || 0
  newLeads.value = stats.newLeads || 0
}

async function refreshBadges() {
  try {
    applyStats(await adminService.stats())
  } catch {
    // Los badges son un extra: si el API falla, la vista ya muestra su propio error.
  }
}

export function useAdminBadges() {
  return { pendingOrders, newLeads, applyStats, refreshBadges }
}
