<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPill from '@/components/admin/AdminPill.vue'
import AdminOrderCustomer from '@/components/admin/AdminOrderCustomer.vue'
import AdminOrderItems from '@/components/admin/AdminOrderItems.vue'
import AdminOrderTimeline from '@/components/admin/AdminOrderTimeline.vue'
import AdminOrderActions from '@/components/admin/AdminOrderActions.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminOrderDetail } from '@/composables/useAdminOrderDetail'
import { orderDetailCopy as copy, orderStatus } from '@/config/admin.copy'
import { formatDateTime } from '@/utils/format'
import type { OrderStatus } from '@/types'

const { order, loading, notFound, updating, nextStep, canCancel, changeStatus } =
  useAdminOrderDetail()

async function onChange(status: OrderStatus, note: string, done: (ok: boolean) => void) {
  done(await changeStatus(status, note))
}
</script>

<template>
  <div class="detail">
    <template v-if="loading">
      <SkeletonBlock width="140px" height="0.9rem" />
      <SkeletonBlock width="260px" height="2.2rem" />
      <div class="detail__cols">
        <div class="detail__main">
          <div class="detail__skeleton">
            <SkeletonBlock width="35%" height="1.2rem" />
            <div v-for="n in 3" :key="n" class="detail__skeleton-row">
              <SkeletonBlock width="56px" height="56px" radius="12px" />
              <SkeletonBlock height="0.9rem" />
              <SkeletonBlock width="70px" height="0.9rem" />
            </div>
            <SkeletonBlock height="80px" />
          </div>
        </div>
        <div class="detail__aside">
          <SkeletonBlock height="190px" radius="14px" />
          <SkeletonBlock height="260px" radius="14px" />
        </div>
      </div>
    </template>

    <div v-else-if="notFound || !order" class="detail__missing">
      <AdminEmptyState icon="fa-solid fa-magnifying-glass" :title="copy.notFound">
        <RouterLink to="/admin/pedidos" class="btn btn--dark">{{ copy.back }}</RouterLink>
      </AdminEmptyState>
    </div>

    <template v-else>
      <AdminPageHeader
        :title="order.orderNumber"
        :subtitle="formatDateTime(order.createdAt)"
        back-to="/admin/pedidos"
        :back-label="copy.back"
      >
        <template #title>
          {{ order.orderNumber }}
          <Transition name="fade" mode="out-in">
            <AdminPill
              :key="order.status"
              :label="orderStatus[order.status].label"
              :tone="orderStatus[order.status].tone"
              :icon="orderStatus[order.status].icon"
            />
          </Transition>
        </template>
      </AdminPageHeader>

      <div class="detail__cols">
        <div class="detail__main">
          <AdminOrderItems :order="order" />
          <AdminOrderTimeline :history="order.statusHistory" />
        </div>
        <div class="detail__aside">
          <AdminOrderActions
            :status="order.status"
            :next="nextStep"
            :can-cancel="canCancel"
            :updating="updating"
            @change="onChange"
          />
          <AdminOrderCustomer :order="order" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__cols {
    @include flex(column, stretch, flex-start, 1.1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  // En móvil lo urgente (siguiente paso y cliente) va primero.
  &__aside {
    order: -1;
    @include flex(column, stretch, flex-start, 1.1rem);

    @include from('lg') {
      order: 0;
      flex: 0 0 360px;
      position: sticky;
      top: 1.5rem;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.1rem);
    flex: 1;
    min-width: 0;
  }

  &__skeleton {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.2rem;
  }

  &__skeleton-row {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__missing {
    @include card;
  }

  > * {
    animation: detail-in 0.5s $ease both;
  }
}

@keyframes detail-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}
</style>
