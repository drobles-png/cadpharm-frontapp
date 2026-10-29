<script setup lang="ts">
/**
 * Celebración de compra: un check que se dibuja con stroke y confeti hecho a
 * mano (solo transform y opacity, corre en el compositor). Las posiciones se
 * derivan del índice para que no cambien entre renders.
 */
withDefaults(defineProps<{ confetti?: boolean }>(), { confetti: true })

const COLORS = ['#17a34a', '#b8f05a', '#1f4fa8', '#2f7de1', '#ffc531', '#f0662a']

const pieces = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.3
  const distance = 90 + ((i * 37) % 70)
  return {
    '--x': `${Math.cos(angle) * distance}px`,
    '--y': `${Math.sin(angle) * distance - 40}px`,
    '--r': `${(i * 67) % 360}deg`,
    '--d': `${(i % 7) * 0.03}s`,
    '--c': COLORS[i % COLORS.length],
    '--w': i % 2 ? '8px' : '6px',
    '--h': i % 3 ? '14px' : '6px',
  } as Record<string, string>
})
</script>

<template>
  <div class="celebrate" aria-hidden="true">
    <span class="celebrate__halo"></span>
    <svg class="celebrate__svg" viewBox="0 0 96 96">
      <circle class="celebrate__circle" cx="48" cy="48" r="44" />
      <path class="celebrate__check" d="M28 50 L42 63 L69 34" />
    </svg>
    <template v-if="confetti">
      <span v-for="(style, i) in pieces" :key="i" class="celebrate__bit" :style="style"></span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.celebrate {
  position: relative;
  width: 6.5rem;
  height: 6.5rem;
  @include flex(row, center, center);

  &__halo {
    position: absolute;
    inset: -0.75rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($lime, 0.6), rgba($accent, 0) 70%);
    animation: halo 1.2s $ease 0.35s both;
  }

  &__svg {
    position: relative;
    width: 100%;
    height: 100%;
    animation: pop 0.6s $ease both;
  }

  &__circle {
    fill: $accent;
    stroke: $accent-deep;
    stroke-width: 3;
  }

  &__check {
    fill: none;
    stroke: $surface;
    stroke-width: 7;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 64;
    stroke-dashoffset: 64;
    animation: draw 0.5s $ease 0.35s forwards;
  }

  &__bit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--w);
    height: var(--h);
    margin: calc(var(--h) / -2) 0 0 calc(var(--w) / -2);
    border-radius: 2px;
    background: var(--c);
    opacity: 0;
    animation: burst 1.3s cubic-bezier(0.15, 0.7, 0.3, 1) calc(0.4s + var(--d)) forwards;
  }
}

@keyframes pop {
  from {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    transform: scale(1.08);
    opacity: 1;
  }
  to {
    transform: scale(1);
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes halo {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes burst {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0) scale(0.4);
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), calc(var(--y) + 60px)) rotate(var(--r)) scale(1);
  }
}

@include reduced-motion {
  .celebrate__bit {
    display: none;
  }

  .celebrate__check {
    stroke-dashoffset: 0;
  }
}
</style>
