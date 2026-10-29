import { computed, onMounted, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { leadStatus, leadsCopy } from '@/config/admin.copy'
import { useAdminBadges } from '@/composables/useAdminBadges'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Lead, LeadStatus, LeadType } from '@/types'

const STATUSES = Object.keys(leadStatus) as LeadStatus[]

export function useAdminLeads() {
  const toast = useToastStore()
  const { refreshBadges } = useAdminBadges()

  const type = ref<LeadType | ''>('')
  const status = ref<LeadStatus | ''>('')
  const page = ref(1)
  const leads = ref<Lead[]>([])
  const pages = ref(1)
  const loading = ref(true)
  const counts = ref<Record<string, number>>({})
  const selectedId = ref<string | null>(null)
  const saving = ref(false)

  const selected = computed(() => leads.value.find((l) => l._id === selectedId.value) || null)

  let requestId = 0

  async function load() {
    const id = ++requestId
    loading.value = true
    try {
      const res = await adminService.leads({
        type: type.value,
        status: status.value,
        page: page.value,
      })
      if (id !== requestId) return
      leads.value = res.items
      pages.value = Math.max(1, res.pages)
    } catch (e) {
      if (id === requestId) toast.error((e as ApiError).message)
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  /** Conteo por estado dentro del tipo elegido, leyendo el total de cada consulta. */
  async function loadCounts() {
    const results = await Promise.allSettled(
      ['', ...STATUSES].map((s) =>
        adminService.leads({ type: type.value, status: s as LeadStatus | '', limit: 1 }),
      ),
    )
    const next: Record<string, number> = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') next[i === 0 ? 'all' : STATUSES[i - 1]!] = r.value.total
    })
    counts.value = next
  }

  watch(type, () => {
    page.value = 1
    load()
    loadCounts()
  })
  watch(status, () => {
    page.value = 1
    load()
  })
  watch(page, load)

  function replace(updated: Lead) {
    leads.value = leads.value.map((l) => (l._id === updated._id ? updated : l))
  }

  async function update(lead: Lead, input: { status?: LeadStatus; note?: string }) {
    if (saving.value) return false
    saving.value = true
    try {
      replace(await adminService.updateLead(lead._id, input))
      if (input.status) {
        toast.success(leadsCopy.statusChanged(leadStatus[input.status].label))
        loadCounts()
        refreshBadges()
      } else toast.success(leadsCopy.noteSaved)
      return true
    } catch (e) {
      toast.error((e as ApiError).message)
      return false
    } finally {
      saving.value = false
    }
  }

  onMounted(() => {
    load()
    loadCounts()
  })

  return {
    type,
    status,
    page,
    pages,
    leads,
    loading,
    counts,
    statuses: STATUSES,
    selected,
    selectedId,
    saving,
    update,
  }
}
