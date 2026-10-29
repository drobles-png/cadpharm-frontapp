<script setup lang="ts">
import { leadStatus, leadsCopy as copy } from '@/config/admin.copy'
import type { LeadStatus } from '@/types'

defineProps<{ status: LeadStatus; disabled?: boolean }>()
const emit = defineEmits<{ change: [status: LeadStatus] }>()

const statuses = Object.keys(leadStatus) as LeadStatus[]
</script>

<template>
  <div class="lstatus">
    <p class="lstatus__label">{{ copy.status }}</p>
    <div class="lstatus__seg" role="radiogroup" :aria-label="copy.status">
      <button
        v-for="s in statuses"
        :key="s"
        type="button"
        role="radio"
        :aria-checked="status === s"
        class="lstatus__opt"
        :class="[`lstatus__opt--${leadStatus[s].tone}`, { 'lstatus__opt--on': status === s }]"
        :disabled="disabled"
        @click="status !== s && emit('change', s)"
      >
        {{ leadStatus[s].label }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lstatus {
  &__label {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
    margin-bottom: 0.4rem;
  }

  &__seg {
    @include flex(row, stretch, flex-start, 0.3rem);
    padding: 0.3rem;
    border-radius: $radius-pill;
    background: $paper;
    border: 1px solid $line;
  }

  &__opt {
    flex: 1;
    padding: 0.55rem 0.5rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-muted;
    transition:
      background-color 0.3s $ease,
      color 0.3s ease,
      box-shadow 0.3s ease;

    &:hover:not(.lstatus__opt--on) {
      color: $ink;
    }

    &:disabled {
      cursor: wait;
    }

    &--on {
      background: $surface;
      box-shadow: $shadow-sm;

      &.lstatus__opt--warning {
        color: darken($warning, 16%);
      }

      &.lstatus__opt--info {
        color: $info;
      }

      &.lstatus__opt--success {
        color: $accent-deep;
      }
    }
  }
}
</style>
