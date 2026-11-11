import { ref } from 'vue'
import { adminService } from '@/services/admin.service'

/**
 * Contador de mensajes nuevos de la navegación. Estado de módulo: el layout lo
 * pinta y cualquier vista que cambie un estado lo refresca sin pasarse props.
 */
const newLeads = ref(0)

function setNewLeads(count: number) {
  newLeads.value = count || 0
}

async function refreshBadges() {
  try {
    // limit 1: solo interesa el total que trae la paginación.
    const res = await adminService.leads({ status: 'new', limit: 1 })
    setNewLeads(res.total)
  } catch {
    // El badge es un extra: si el API falla, la vista ya muestra su propio error.
  }
}

export function useAdminBadges() {
  return { newLeads, setNewLeads, refreshBadges }
}
