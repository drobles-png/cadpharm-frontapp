<script setup lang="ts">
import { site } from '@/config/site'
import { productsCopy } from '@/config/pages.copy'

/** Filtro por categoría. '' = todas. */
defineProps<{ modelValue: string; counts: Record<string, number> }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  { key: '', label: productsCopy.all, icon: 'fa-solid fa-border-all' },
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
    @include flex(row, center, center, 0.5rem);
    padding: 0.65rem 1rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 1px solid $line;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease,
      transform 0.3s $ease;
    @include focus-ring;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &:active {
      transform: scale(0.95);
    }

    &--active {
      background: $ink;
      border-color: $ink;
      color: $surface;

      &:hover {
        color: $surface;
      }

      .chips__count {
        background: $lime;
        color: $ink;
      }
    }
  }

  &__count {
    min-width: 1.4rem;
    padding: 0.05rem 0.4rem;
    border-radius: $radius-pill;
    background: $sand;
    font-size: $text-xs;
    font-weight: 700;
    text-align: center;
    transition: background-color 0.3s ease;
  }
}
</style>
