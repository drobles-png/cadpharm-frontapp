<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminKpiCard from '@/components/admin/AdminKpiCard.vue'
import AdminSalesChart from '@/components/admin/AdminSalesChart.vue'
import AdminTopProducts from '@/components/admin/AdminTopProducts.vue'
import AdminRecentOrders from '@/components/admin/AdminRecentOrders.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminDashboard } from '@/composables/useAdminDashboard'
import { dashboardCopy as copy } from '@/config/admin.copy'

const { stats, loading, revenueDelta, hasSales } = useAdminDashboard()
</script>

<template>
  <div class="dash">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="dash__kpis">
      <AdminKpiCard
        :label="copy.kpis.revenue"
        icon="fa-solid fa-sack-dollar"
        :value="stats?.revenueMonth ?? 0"
        money
        :loading="loading"
        :delta="revenueDelta"
        :delta-label="copy.vsPrev"
        :no-delta-label="copy.noPrev"
        class="dash__kpi--wide"
      />
      <AdminKpiCard
        :label="copy.kpis.orders"
        icon="fa-solid fa-bag-shopping"
        :value="stats?.ordersMonth ?? 0"
        tone="blue"
        :loading="loading"
        to="/admin/pedidos"
      />
      <AdminKpiCard
        :label="copy.kpis.ticket"
        icon="fa-solid fa-receipt"
        :value="stats?.avgTicket ?? 0"
        money
        tone="lime"
        :loading="loading"
      />
      <AdminKpiCard
        :label="copy.kpis.pending"
        icon="fa-solid fa-hourglass-half"
        :value="stats?.pendingOrders ?? 0"
        tone="warning"
        :loading="loading"
        to="/admin/pedidos?status=pending"
      />
      <AdminKpiCard
        :label="copy.kpis.leads"
        icon="fa-solid fa-envelope-open-text"
        :value="stats?.newLeads ?? 0"
        tone="blue"
        :loading="loading"
        to="/admin/mensajes"
      />
    </div>

    <template v-if="loading">
      <div class="dash__skeleton-chart">
        <SkeletonBlock width="40%" height="1.2rem" />
        <SkeletonBlock height="220px" radius="14px" />
      </div>
      <div class="dash__row">
        <div v-for="n in 2" :key="n" class="dash__skeleton-list">
          <SkeletonBlock width="50%" height="1.2rem" />
          <div v-for="m in 4" :key="m" class="dash__skeleton-item">
            <SkeletonBlock circle height="38px" />
            <SkeletonBlock height="0.9rem" />
            <SkeletonBlock width="70px" height="0.9rem" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="stats && hasSales">
      <AdminSalesChart :data="stats.salesByDay" class="dash__chart" />
      <div class="dash__row">
        <AdminTopProducts :items="stats.topProducts" />
        <AdminRecentOrders :orders="stats.recentOrders" />
      </div>
    </template>

    <div v-else class="dash__empty">
      <AdminEmptyState icon="fa-solid fa-seedling" :title="copy.emptyTitle" :text="copy.emptyText">
        <RouterLink to="/admin/productos" class="btn btn--primary">
          <i class="fa-solid fa-capsules"></i> {{ copy.emptyCta }}
        </RouterLink>
      </AdminEmptyState>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__kpis {
    @include flex-cards(200px, 0.9rem);

    > * {
      animation: kpi-in 0.55s $ease both;
    }

    @for $i from 1 through 5 {
      > :nth-child(#{$i}) {
        animation-delay: #{$i * 0.06}s;
      }
    }
  }

  &__kpi--wide {
    @include from('md') {
      flex-basis: 260px !important;
    }
  }

  &__chart {
    animation: kpi-in 0.6s 0.25s $ease both;
  }

  &__row {
    @include flex-cards(320px, 1.1rem);
    align-items: flex-start;

    > * {
      animation: kpi-in 0.6s 0.35s $ease both;
    }
  }

  &__skeleton-chart,
  &__skeleton-list,
  &__empty {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.2rem;
  }

  &__skeleton-item {
    @include flex(row, center, flex-start, 0.8rem);
  }
}

@keyframes kpi-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
</style>
