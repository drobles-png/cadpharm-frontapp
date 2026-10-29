<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminFilterChips from '@/components/admin/AdminFilterChips.vue'
import AdminLeadItem from '@/components/admin/AdminLeadItem.vue'
import AdminLeadPanel from '@/components/admin/AdminLeadPanel.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminLeads } from '@/composables/useAdminLeads'
import { leadStatus, leadType, leadsCopy as copy } from '@/config/admin.copy'
import type { LeadStatus, LeadType } from '@/types'

const { type, status, page, pages, leads, loading, counts, statuses, selected, selectedId, saving, update } =
  useAdminLeads()

const typeOptions = [
  { value: '', label: copy.allTypes },
  ...(Object.keys(leadType) as LeadType[]).map((t) => ({ value: t, label: leadType[t].label, icon: leadType[t].icon })),
]
const statusOptions = [
  { value: '', label: copy.allStatus },
  ...statuses.map((s) => ({ value: s, label: leadStatus[s].label })),
]

const typeModel = computed({
  get: () => type.value as string,
  set: (v: string) => (type.value = v as LeadType | ''),
})
const statusModel = computed({
  get: () => status.value as string,
  set: (v: string) => (status.value = v as LeadStatus | ''),
})

function onUpdate(input: { status?: LeadStatus; note?: string }) {
  if (selected.value) update(selected.value, input)
}

const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (selectedId.value = null)
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="leads">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="leads__filters">
      <AdminFilterChips v-model="typeModel" :options="typeOptions" />
      <AdminFilterChips v-model="statusModel" :options="statusOptions" :counts="counts" />
    </div>

    <div v-if="loading" class="leads__list">
      <div v-for="n in 5" :key="n" class="leads__skeleton">
        <SkeletonBlock width="42px" height="42px" radius="12px" />
        <div class="leads__skeleton-text">
          <SkeletonBlock width="45%" height="1rem" />
          <SkeletonBlock width="30%" height="0.7rem" />
          <SkeletonBlock width="85%" height="0.8rem" />
        </div>
        <SkeletonBlock width="80px" height="1.5rem" radius="99px" />
      </div>
    </div>

    <TransitionGroup v-else-if="leads.length" tag="div" name="leads" class="leads__list" appear>
      <AdminLeadItem
        v-for="(l, i) in leads"
        :key="l._id"
        :lead="l"
        :active="selectedId === l._id"
        :style="{ '--i': i }"
        @open="selectedId = l._id"
      />
    </TransitionGroup>

    <div v-else class="leads__empty">
      <AdminEmptyState icon="fa-solid fa-envelope-open" :title="copy.emptyTitle" :text="copy.emptyText" />
    </div>

    <AdminPagination v-model="page" :pages="pages" />

    <AdminLeadPanel :lead="selected" :saving="saving" @close="selectedId = null" @update="onUpdate" />
  </div>
</template>

<style scoped lang="scss">
.leads {
  &__filters {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-bottom: 1.1rem;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__skeleton {
    @include card;
    @include flex(row, flex-start, flex-start, 0.85rem);
    padding: 1rem 1.1rem;
  }

  &__skeleton-text {
    @include flex(column, stretch, flex-start, 0.45rem);
    flex: 1;
  }

  &__empty {
    @include card;
  }
}

.leads-enter-active {
  transition:
    opacity 0.45s $ease,
    transform 0.45s $ease;
  transition-delay: calc(var(--i, 0) * 0.04s);
}

.leads-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
