<script setup lang="ts">
import type { PillTone } from '@/config/admin.copy'

defineProps<{ label: string; tone: PillTone; icon?: string }>()
</script>

<template>
  <span class="pill" :class="`pill--${tone}`">
    <i v-if="icon" :class="icon"></i>
    <span v-else class="pill__dot"></span>
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.pill {
  @include flex(row, center, flex-start, 0.4rem);
  display: inline-flex;
  padding: 0.28rem 0.7rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.3;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  i {
    font-size: 0.7rem;
  }

  &__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 14%);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 8%);
  }

  &--blue {
    background: $brand-blue-soft;
    color: $brand-blue;
  }

  &--success {
    background: $success-bg;
    color: $accent-deep;
  }

  &--danger {
    background: $danger-bg;
    color: $danger;
  }

  &--muted {
    background: rgba($ink, 0.07);
    color: $ink-muted;
  }
}
</style>
