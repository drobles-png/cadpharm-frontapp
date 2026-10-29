<script setup lang="ts">
import AdminPill from '@/components/admin/AdminPill.vue'
import { leadStatus, leadType } from '@/config/admin.copy'
import { formatDate } from '@/utils/format'
import type { Lead } from '@/types'

defineProps<{ lead: Lead; active: boolean }>()
defineEmits<{ open: [] }>()
</script>

<template>
  <button type="button" class="lead" :class="{ 'lead--active': active, 'lead--new': lead.status === 'new' }" @click="$emit('open')">
    <span class="lead__icon" :class="`lead__icon--${lead.type}`">
      <i :class="leadType[lead.type]?.icon || 'fa-solid fa-user'"></i>
    </span>
    <span class="lead__main">
      <span class="lead__top">
        <strong>{{ lead.name }}</strong>
        <small>{{ formatDate(lead.createdAt) }}</small>
      </span>
      <span class="lead__meta">
        {{ leadType[lead.type]?.label || lead.type }}
        <template v-if="lead.institution || lead.specialty"> · {{ lead.institution || lead.specialty }}</template>
        <template v-if="lead.city"> · {{ lead.city }}</template>
      </span>
      <span class="lead__msg">{{ lead.message }}</span>
    </span>
    <AdminPill class="lead__pill" :label="leadStatus[lead.status].label" :tone="leadStatus[lead.status].tone" />
  </button>
</template>

<style scoped lang="scss">
.lead {
  position: relative;
  @include card;
  @include flex(row, flex-start, flex-start, 0.85rem);
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem 1.1rem;
  text-align: left;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s $ease;
  @include focus-ring;

  &:hover {
    box-shadow: $shadow-sm;
    transform: translateY(-1px);
  }

  &--active {
    border-color: $accent;
    box-shadow: 0 0 0 3px rgba($accent, 0.15);
  }

  // Los nuevos llevan una marca lateral para que se encuentren de un vistazo.
  &--new::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 1rem;
    bottom: 1rem;
    width: 4px;
    border-radius: 0 4px 4px 0;
    background: $warning;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 42px;
    height: 42px;
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

  &__main {
    @include flex(column, stretch, flex-start, 0.15rem);
    flex: 1 1 200px;
    min-width: 0;
  }

  &__top {
    @include flex(row, baseline, space-between, 0.6rem);

    strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      flex-shrink: 0;
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-soft;
    font-weight: 600;
  }

  &__msg {
    font-size: $text-sm;
    color: $ink-muted;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__pill {
    margin-left: calc(42px + 0.85rem);

    @include from('md') {
      margin-left: 0;
    }
  }
}
</style>
