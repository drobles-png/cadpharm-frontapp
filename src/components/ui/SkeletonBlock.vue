<script setup lang="ts">
/**
 * Bloque de carga con brillo que recorre. Es la única forma de "cargando" del
 * sitio: nada de spinners, el esqueleto ya dibuja la forma de lo que viene.
 */
withDefaults(
  defineProps<{
    width?: string
    height?: string
    radius?: string
    circle?: boolean
    dark?: boolean
  }>(),
  { width: '100%', height: '1rem', radius: '10px', circle: false, dark: false },
)
</script>

<template>
  <span
    class="skeleton"
    :class="{ 'skeleton--dark': dark }"
    :style="{
      width: circle ? height : width,
      height,
      borderRadius: circle ? '50%' : radius,
    }"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
.skeleton {
  display: block;
  position: relative;
  overflow: hidden;
  background: color-mix(in srgb, #{$ink} 7%, transparent);
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      100deg,
      transparent 20%,
      rgba(255, 255, 255, 0.65) 50%,
      transparent 80%
    );
    animation: skeleton-sweep 1.4s $ease infinite;
  }

  &--dark {
    background: rgba(255, 255, 255, 0.08);

    &::after {
      background: linear-gradient(
        100deg,
        transparent 20%,
        rgba(255, 255, 255, 0.12) 50%,
        transparent 80%
      );
    }
  }
}

@keyframes skeleton-sweep {
  to {
    transform: translateX(100%);
  }
}
</style>
