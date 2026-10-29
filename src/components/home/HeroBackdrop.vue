<script setup lang="ts">
/** Fondo vivo del hero: manchas de color de marca que derivan lento y una trama de puntos. */
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <span class="backdrop__blob backdrop__blob--green"></span>
    <span class="backdrop__blob backdrop__blob--blue"></span>
    <span class="backdrop__blob backdrop__blob--lime"></span>
    <span class="backdrop__dots"></span>
  </div>
</template>

<style scoped lang="scss">
.backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;

  &__blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    will-change: transform;

    &--green {
      width: 34rem;
      height: 34rem;
      background: rgba($accent, 0.42);
      top: -12rem;
      left: -10rem;
      animation: blob-a 18s ease-in-out infinite alternate;
    }

    &--blue {
      width: 30rem;
      height: 30rem;
      background: rgba($brand-blue, 0.32);
      bottom: -10rem;
      right: -6rem;
      animation: blob-b 22s ease-in-out infinite alternate;
    }

    &--lime {
      width: 22rem;
      height: 22rem;
      background: rgba($lime, 0.7);
      top: 30%;
      left: 45%;
      animation: blob-c 16s ease-in-out infinite alternate;
    }
  }

  &__dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba($ink, 0.09) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: radial-gradient(ellipse at 70% 40%, #000 10%, transparent 70%);
  }
}

@keyframes blob-a {
  to {
    transform: translate(12rem, 8rem) scale(1.15);
  }
}
@keyframes blob-b {
  to {
    transform: translate(-14rem, -6rem) scale(1.2);
  }
}
@keyframes blob-c {
  to {
    transform: translate(-10rem, 6rem) scale(0.85);
  }
}
</style>
