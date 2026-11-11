<script setup lang="ts">
import { site } from '@/config/site'
import { catalogCopy } from '@/config/info.copy'

/** Filtro por categoría. '' = todas. */
defineProps<{ modelValue: string; counts: Record<string, number> }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  { key: '', label: catalogCopy.all, icon: 'fa-solid fa-border-all' },
  ...site.categories.map((c) => ({ key: c.key, label: c.label, icon: c.icon })),
]
</script>

<template>
  <div class="chips" role="group" aria-label="Filtrar por categoría">
    <button
      v-for="opt in options"
      :key="opt.key"
      type="button"
      class="chips__chip"
      :class="{ 'chips__chip--active': modelValue === opt.key }"
      :aria-pressed="modelValue === opt.key"
      @click="$emit('update:modelValue', opt.key)"
    >
      <i :class="opt.icon" aria-hidden="true"></i>
      {{ opt.label }}
      <span class="chips__count">{{ counts[opt.key] ?? 0 }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.5rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.25rem 1.25rem 0.5rem;
  margin-inline: -1.25rem;

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
    padding-inline: 0;
    margin-inline: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__chip {
    flex-shrink: 0;
    min-height: 2.75rem;
    @include flex(row, center, center, 0.5rem);
    padding: 0.6rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $cream-line;
    font-size: $text-sm;
    font-weight: 600;
    color: $cream-soft;
    white-space: nowrap;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease,
      transform 0.16s ease-out;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-color: $cream;
        color: $cream;
      }
    }

    &:active {
      transform: scale(0.97);
    }

    &--active {
      background: $cream;
      border-color: $cream;
      color: $forest;

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          color: $forest;
        }
      }

      .chips__count {
        background: $forest;
        color: $cream;
      }
    }
  }

  &__count {
    min-width: 1.4rem;
    padding: 0.05rem 0.4rem;
    border-radius: $radius-pill;
    background: $cream-line;
    font-size: $text-xs;
    font-weight: 700;
    text-align: center;
  }
}
</style>
