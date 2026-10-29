<script setup lang="ts">
import { ref } from 'vue'
import { cartCopy } from '@/config/checkout.copy'

/**
 * Stepper de cantidad. En 1, el botón "menos" se vuelve papelera: así quitar
 * un producto no exige buscar otro botón. El número sube o baja según la
 * dirección del cambio para que se sienta físico.
 */
const props = withDefaults(defineProps<{ modelValue: number; max?: number; label: string }>(), {
  max: 20,
})
const emit = defineEmits<{ 'update:modelValue': [value: number]; remove: [] }>()

const direction = ref<'up' | 'down'>('up')

function change(delta: number) {
  const next = props.modelValue + delta
  if (next > props.max) return
  if (next < 1) {
    emit('remove')
    return
  }
  direction.value = delta > 0 ? 'up' : 'down'
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="stepper" role="group" :aria-label="`${cartCopy.quantity}: ${label}`">
    <button
      type="button"
      class="stepper__btn"
      :aria-label="modelValue === 1 ? cartCopy.remove(label) : cartCopy.decrease"
      @click="change(-1)"
    >
      <i :class="modelValue === 1 ? 'fa-solid fa-trash-can' : 'fa-solid fa-minus'"></i>
    </button>
    <span class="stepper__value" aria-live="polite">
      <Transition :name="`num-${direction}`">
        <span :key="modelValue" class="stepper__num">{{ modelValue }}</span>
      </Transition>
    </span>
    <button
      type="button"
      class="stepper__btn"
      :aria-label="cartCopy.increase"
      :disabled="modelValue >= max"
      @click="change(1)"
    >
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  @include flex(row, center, flex-start, 0.15rem);
  background: $paper;
  border: 1px solid $line;
  border-radius: $radius-pill;
  padding: 0.2rem;

  &__btn {
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: $ink-soft;
    font-size: 0.72rem;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      transform 0.15s ease;
    @include focus-ring;

    &:hover:not(:disabled) {
      background: $surface;
      color: $accent-deep;
      box-shadow: $shadow-sm;
    }

    &:active:not(:disabled) {
      transform: scale(0.88);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__value {
    position: relative;
    width: 1.8rem;
    height: 1.4rem;
    overflow: hidden;
    text-align: center;
  }

  &__num {
    position: absolute;
    inset: 0;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1.4rem;
    color: $ink;
  }
}

.num-up-enter-active,
.num-up-leave-active,
.num-down-enter-active,
.num-down-leave-active {
  transition:
    transform 0.28s $ease,
    opacity 0.28s ease;
}
.num-up-enter-from,
.num-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.num-up-leave-to,
.num-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
