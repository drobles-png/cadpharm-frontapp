<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Envuelve un botón y lo atrae hacia el cursor unos píxeles. Solo en desktop;
 * en táctil es un contenedor inerte.
 */
const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.3 })

const root = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
let enabled = false

function onMove(event: PointerEvent) {
  if (!root.value || !inner.value) return
  const rect = root.value.getBoundingClientRect()
  const x = (event.clientX - rect.left - rect.width / 2) * props.strength
  const y = (event.clientY - rect.top - rect.height / 2) * props.strength
  inner.value.style.transform = `translate(${x}px, ${y}px)`
}

function onLeave() {
  if (inner.value) inner.value.style.transform = ''
}

onMounted(() => {
  enabled =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!enabled || !root.value) return
  root.value.addEventListener('pointermove', onMove)
  root.value.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  if (!enabled || !root.value) return
  root.value.removeEventListener('pointermove', onMove)
  root.value.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <span ref="root" class="magnetic">
    <span ref="inner" class="magnetic__inner"><slot /></span>
  </span>
</template>

<style scoped lang="scss">
.magnetic {
  display: inline-flex;
  padding: 0.4rem;
  margin: -0.4rem;

  &__inner {
    display: inline-flex;
    transition: transform 0.45s $ease;
  }
}
</style>
