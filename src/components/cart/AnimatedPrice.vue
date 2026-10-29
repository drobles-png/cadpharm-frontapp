<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { formatCents } from '@/utils/format'

/**
 * Monto en centavos que cuenta hacia su nuevo valor cuando cambia. Los dígitos
 * usan cifras tabulares para que el ancho no baile mientras cuenta.
 */
const props = withDefaults(defineProps<{ cents: number; duration?: number }>(), {
  duration: 520,
})

const shown = ref(props.cents)
const pulse = ref(false)
let frame = 0

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

watch(
  () => props.cents,
  (to, from) => {
    cancelAnimationFrame(frame)
    if (reduced || from === undefined) {
      shown.value = to
      return
    }
    const start = performance.now()
    const origin = shown.value
    pulse.value = false
    requestAnimationFrame(() => (pulse.value = true))
    const step = (now: number) => {
      const t = Math.min((now - start) / props.duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      shown.value = Math.round(origin + (to - origin) * eased)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  },
)

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <span class="price" :class="{ 'price--pulse': pulse }" @animationend="pulse = false">
    {{ formatCents(shown) }}
  </span>
</template>

<style scoped lang="scss">
.price {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  transform-origin: right center;

  &--pulse {
    animation: price-pop 0.5s $ease;
  }
}

@keyframes price-pop {
  40% {
    transform: scale(1.06);
    color: $accent;
  }
}
</style>
