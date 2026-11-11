<script setup lang="ts">
import AdminPill from '@/components/admin/AdminPill.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import { dashboardCopy as copy, leadStatus, leadType } from '@/config/admin.copy'
import { formatDateTime } from '@/utils/format'
import type { Lead } from '@/types'

defineProps<{ leads: Lead[] }>()
</script>

<template>
  <section class="recent">
    <header class="recent__head">
      <h2 class="recent__title">{{ copy.recentTitle }}</h2>
      <RouterLink to="/admin/mensajes" class="recent__all">
        {{ copy.seeAll }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </header>
    <ul v-if="leads.length" class="recent__list">
      <li v-for="(l, i) in leads" :key="l._id" :style="{ '--i': i }">
        <RouterLink :to="{ path: '/admin/mensajes', query: { lead: l._id } }" class="recent__row">
          <span class="recent__icon" :class="`recent__icon--${l.type}`">
            <i :class="leadType[l.type]?.icon || 'fa-solid fa-user'"></i>
          </span>
          <span class="recent__who">
            <strong>{{ l.name }}</strong>
            <small>
              {{ leadType[l.type]?.label || l.type }}
              <template v-if="l.city"> · {{ l.city }}</template>
              · {{ formatDateTime(l.createdAt) }}
            </small>
          </span>
          <AdminPill class="recent__pill" :label="leadStatus[l.status].label" :tone="leadStatus[l.status].tone" />
        </RouterLink>
      </li>
    </ul>
    <AdminEmptyState v-else compact icon="fa-solid fa-envelope-open" :title="copy.emptyRecent" />
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

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: $accent-soft;
    color: $accent-deep;

    &--farmacia {
      background: $brand-blue-soft;
      color: $brand-blue;
    }

    &--distribuidor {
      background: $warning-bg;
      color: darken($warning, 14%);
    }

    &--paciente {
      background: rgba($ink, 0.07);
      color: $ink-soft;
    }
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

  &__pill {
    flex-shrink: 0;
  }
}

@keyframes row-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
