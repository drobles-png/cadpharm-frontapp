<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminFilterChips from '@/components/admin/AdminFilterChips.vue'
import AdminOrdersTable from '@/components/admin/AdminOrdersTable.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import { useAdminOrders } from '@/composables/useAdminOrders'
import { orderStatus, ordersCopy as copy } from '@/config/admin.copy'
import type { OrderStatus } from '@/types'

const { status, q, page, pages, orders, loading, counts, statuses } = useAdminOrders()

const chipOptions = computed(() => [
  { value: '', label: copy.all },
  ...statuses.map((s) => ({ value: s, label: orderStatus[s].label })),
])

const statusModel = computed({
  get: () => status.value as string,
  set: (v: string) => (status.value = v as OrderStatus | ''),
})
</script>

<template>
  <div class="orders-view">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="orders-view__tools">
      <label class="orders-view__search">
        <span class="visually-hidden">{{ copy.search }}</span>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input v-model="q" type="search" :placeholder="copy.search" enterkeyhint="search" />
        <Transition name="fade">
          <button v-if="q" type="button" class="orders-view__clear" :aria-label="copy.clear" @click="q = ''">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </Transition>
      </label>
      <AdminFilterChips v-model="statusModel" :options="chipOptions" :counts="counts" />
    </div>

    <AdminOrdersTable v-if="loading || orders.length" :orders="orders" :loading="loading" />
    <div v-else class="orders-view__empty">
      <AdminEmptyState icon="fa-solid fa-box-open" :title="copy.emptyTitle" :text="copy.emptyText" />
    </div>

    <AdminPagination v-model="page" :pages="pages" />
  </div>
</template>

<style scoped lang="scss">
.orders-view {
  &__tools {
    @include flex(column, stretch, flex-start, 0.9rem);
    margin-bottom: 1.1rem;
  }

  &__search {
    position: relative;
    margin: 0;
    max-width: 520px;

    > i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      pointer-events: none;
    }

    input {
      padding: 0.85rem 2.8rem;
      border-radius: $radius-pill;
      font-size: 1rem;

      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }

  &__clear {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: rgba($ink, 0.06);
      color: $ink;
    }
  }

  &__empty {
    @include card;
  }
}
</style>
