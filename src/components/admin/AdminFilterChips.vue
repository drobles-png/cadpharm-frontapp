<script setup lang="ts">
/** Chips de filtro con contador. Un solo valor activo; '' significa "todos". */
defineProps<{
  options: { value: string; label: string; icon?: string }[]
  counts?: Record<string, number>
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="chips" role="tablist">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="tab"
      class="chips__item"
      :class="{ 'chips__item--active': model === opt.value }"
      :aria-selected="model === opt.value"
      @click="model = opt.value"
    >
      <i v-if="opt.icon" :class="opt.icon"></i>
      {{ opt.label }}
      <span v-if="counts && counts[opt.value || 'all'] !== undefined" class="chips__count">
        {{ counts[opt.value || 'all'] }}
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-start, 0.45rem);
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    @include flex(row, center, center, 0.45rem);
    flex-shrink: 0;
    padding: 0.5rem 0.95rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition:
      background-color 0.25s ease,
      color 0.25s ease,
      border-color 0.25s ease,
      transform 0.2s $ease;
    @include focus-ring;

    &:hover {
      border-color: rgba($ink, 0.25);
      color: $ink;
    }

    &:active {
      transform: scale(0.96);
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
    background: rgba($ink, 0.07);
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    text-align: center;
    transition: background-color 0.25s ease;
  }
}
</style>
