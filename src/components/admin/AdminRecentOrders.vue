<script setup lang="ts">
import AdminPill from '@/components/admin/AdminPill.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import { dashboardCopy as copy, orderStatus } from '@/config/admin.copy'
import { formatCents, formatDateTime } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ orders: Order[] }>()
</script>

<template>
  <section class="recent">
    <header class="recent__head">
      <h2 class="recent__title">{{ copy.recentTitle }}</h2>
      <RouterLink to="/admin/pedidos" class="recent__all">
        {{ copy.seeAll }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </header>
    <ul v-if="orders.length" class="recent__list">
      <li v-for="(o, i) in orders" :key="o._id" :style="{ '--i': i }">
        <RouterLink :to="`/admin/pedidos/${o._id}`" class="recent__row">
          <span class="recent__avatar">{{ (o.customer.name || '?').charAt(0).toUpperCase() }}</span>
          <span class="recent__who">
            <strong>{{ o.customer.name }}</strong>
            <small>{{ o.orderNumber }} · {{ formatDateTime(o.createdAt) }}</small>
          </span>
          <span class="recent__side">
            <strong>{{ formatCents(o.total) }}</strong>
            <AdminPill :label="orderStatus[o.status].label" :tone="orderStatus[o.status].tone" />
          </span>
        </RouterLink>
      </li>
    </ul>
    <AdminEmptyState v-else compact icon="fa-solid fa-receipt" :title="copy.emptyRecent" />
  </section>
</template>

<style scoped lang="scss">
.recent {
  @include card;
  padding: 1.2rem;

  &__head {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($text-lg, 700);
  }

  &__all {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 700;
    color: $accent-deep;

    i {
      transition: transform 0.25s $ease;
    }

    &:hover i {
      transform: translateX(3px);
    }
  }

  &__list {
    list-style: none;

    li {
      animation: row-in 0.5s $ease both;
      animation-delay: calc(var(--i) * 0.05s);
    }

    li + li {
      border-top: 1px solid $line;
    }
  }

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.75rem 0.4rem;
    margin-inline: -0.4rem;
    border-radius: 10px;
    transition: background-color 0.2s ease;

    &:hover {
      background: $paper;
    }
  }

  &__avatar {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: $brand-blue-soft;
    color: $brand-blue;
    font-weight: 800;
  }

  &__who {
    @include flex(column, flex-start, flex-start);
    flex: 1;
    min-width: 0;
    line-height: 1.3;

    strong {
      font-size: $text-sm;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__side {
    @include flex(column, flex-end, flex-start, 0.25rem);
    flex-shrink: 0;

    strong {
      font-size: $text-sm;
      font-variant-numeric: tabular-nums;
    }
  }
}

@keyframes row-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
