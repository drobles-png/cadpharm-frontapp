<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminKpiCard from '@/components/admin/AdminKpiCard.vue'
import AdminQuickActions from '@/components/admin/AdminQuickActions.vue'
import AdminRecentLeads from '@/components/admin/AdminRecentLeads.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminDashboard } from '@/composables/useAdminDashboard'
import { dashboardCopy as copy } from '@/config/admin.copy'

const { stats, recentLeads, loading } = useAdminDashboard()
</script>

<template>
  <div class="dash">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle" />

    <div class="dash__kpis">
      <AdminKpiCard
        :label="copy.kpis.published"
        icon="fa-solid fa-capsules"
        :value="stats?.published ?? 0"
        :hint="stats ? copy.kpis.publishedOf(stats.products) : ''"
        :loading="loading"
        to="/admin/productos"
      />
      <AdminKpiCard
        :label="copy.kpis.featured"
        icon="fa-solid fa-star"
        :value="stats?.featured ?? 0"
        tone="lime"
        :loading="loading"
        to="/admin/productos"
      />
      <AdminKpiCard
        :label="copy.kpis.newLeads"
        icon="fa-solid fa-envelope-open-text"
        :value="stats?.newLeads ?? 0"
        tone="warning"
        :loading="loading"
        to="/admin/mensajes?status=new"
      />
      <AdminKpiCard
        :label="copy.kpis.totalLeads"
        icon="fa-solid fa-user-doctor"
        :value="stats?.totalLeads ?? 0"
        tone="blue"
        :loading="loading"
        to="/admin/mensajes"
      />
    </div>

    <div v-if="loading" class="dash__row">
      <div v-for="n in 2" :key="n" class="dash__skeleton-list">
        <SkeletonBlock width="50%" height="1.2rem" />
        <div v-for="m in 3" :key="m" class="dash__skeleton-item">
          <SkeletonBlock circle height="38px" />
          <SkeletonBlock height="0.9rem" />
          <SkeletonBlock width="70px" height="0.9rem" />
        </div>
      </div>
    </div>

    <div v-else class="dash__row">
      <AdminRecentLeads :leads="recentLeads" class="dash__recent" />
      <AdminQuickActions />
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

    @for $i from 1 through 4 {
      > :nth-child(#{$i}) {
        animation-delay: #{$i * 0.06}s;
      }
    }
  }

  &__row {
    @include flex-cards(320px, 1.1rem);
    align-items: flex-start;

    > * {
      animation: kpi-in 0.6s 0.3s $ease both;
    }
  }

  // Los mensajes piden más ancho que los accesos rápidos.
  &__recent {
    @include from('lg') {
      flex-grow: 2 !important;
    }
  }

  &__skeleton-list {
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
