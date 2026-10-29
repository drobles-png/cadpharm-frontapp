<script setup lang="ts">
/** Selector de cantidad − n +. El tope coincide con el del carrito (20). */
const model = defineModel<number>({ required: true })
withDefaults(defineProps<{ max?: number; label?: string }>(), { max: 20, label: 'Cantidad' })
</script>

<template>
  <div class="stepper" role="group" :aria-label="label">
    <button
      type="button"
      class="stepper__btn"
      aria-label="Quitar uno"
      :disabled="model <= 1"
      @click="model = Math.max(1, model - 1)"
    >
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <Transition name="tick" mode="out-in">
      <span :key="model" class="stepper__value" aria-live="polite">{{ model }}</span>
    </Transition>
    <button
      type="button"
      class="stepper__btn"
      aria-label="Agregar uno"
      :disabled="model >= max"
      @click="model = Math.min(max, model + 1)"
    >
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, space-between, 0.25rem);
  padding: 0.3rem;
  border-radius: $radius-pill;
  background: $surface;
  border: 1px solid $line;
  min-width: 8.5rem;

  &__btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink;
    transition:
      background-color 0.25s ease,
      transform 0.2s ease;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $sand;
    }

    &:active:not(:disabled) {
      transform: scale(0.88);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__value {
    min-width: 2ch;
    text-align: center;
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
}

.tick-enter-active,
.tick-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.2s $ease;
}

.tick-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tick-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
