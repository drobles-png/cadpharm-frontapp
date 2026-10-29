<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { gsap } from 'gsap'
import { homeCopy } from '@/config/home.copy'
import { useGsap } from '@/composables/useGsap'

/**
 * Composición flotante del hero: cajas al frente, frascos y blísters detrás.
 * Cada pieza tiene tres capas: posición (CSS), parallax del mouse (GSAP) y
 * flotación suave (keyframes), para que los tres movimientos no se pisen.
 */
const copy = homeCopy.hero
const stage = ref<HTMLElement | null>(null)
let detach: (() => void) | null = null

useGsap(stage, () => {
  gsap.from('.piece__parallax', {
    opacity: 0,
    y: 140,
    scale: 0.5,
    rotate: (i: number) => (i % 2 ? 20 : -20),
    duration: 1.3,
    ease: 'back.out(1.5)',
    stagger: 0.12,
    delay: 0.35,
  })
  gsap.from('.chip', {
    opacity: 0,
    scale: 0.6,
    y: 20,
    duration: 0.8,
    ease: 'back.out(2)',
    stagger: 0.15,
    delay: 1.3,
  })
  gsap.from('.showcase__disc', { scale: 0.6, opacity: 0, duration: 1.6, ease: 'expo.out' })
  gsap.from('.showcase__orbit', { opacity: 0, duration: 2 })

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const pieces = gsap.utils.toArray<HTMLElement>('.piece__parallax')
  const movers = pieces.map((el) => ({
    depth: Number(el.dataset.depth) || 1,
    x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
  }))
  const onMove = (event: PointerEvent) => {
    const nx = event.clientX / window.innerWidth - 0.5
    const ny = event.clientY / window.innerHeight - 0.5
    movers.forEach((m) => {
      m.x(nx * 46 * m.depth)
      m.y(ny * 34 * m.depth)
    })
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  detach = () => window.removeEventListener('pointermove', onMove)
})

onBeforeUnmount(() => detach?.())
</script>

<template>
  <div ref="stage" class="showcase">
    <span class="showcase__orbit" aria-hidden="true"></span>
    <span class="showcase__disc" aria-hidden="true"></span>

    <div
      v-for="(item, i) in copy.showcase"
      :key="item.src"
      class="piece"
      :class="{ 'piece--back': item.back }"
      :style="{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.w}%`,
        zIndex: i + 1,
        '--r': `${item.rotate}deg`,
        '--float': `${5 + (i % 3) * 1.3}s`,
        '--delay': `${-i * 0.9}s`,
      }"
    >
      <div class="piece__parallax" :data-depth="item.depth">
        <div class="piece__float">
          <RouterLink v-if="item.slug" :to="`/productos/${item.slug}`" class="piece__link">
            <img
              :src="item.src"
              :alt="item.alt"
              class="piece__img"
              fetchpriority="high"
              draggable="false"
            />
          </RouterLink>
          <img v-else :src="item.src" alt="" class="piece__img" draggable="false" />
        </div>
      </div>
    </div>

    <span v-for="(chip, i) in copy.chips" :key="chip.label" class="chip" :class="`chip--${i}`">
      <span class="chip__body">
        <span class="chip__icon"><i :class="chip.icon" aria-hidden="true"></i></span
        >{{ chip.label }}
      </span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.showcase {
  position: relative;
  width: 100%;
  max-width: 30rem;
  aspect-ratio: 1 / 0.98;
  margin-inline: auto;

  @include from('lg') {
    max-width: 40rem;
  }

  &__disc {
    position: absolute;
    inset: 12% 10%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.9),
      0 40px 100px rgba($brand-blue, 0.15);
  }

  &__orbit {
    position: absolute;
    inset: 3%;
    border-radius: 50%;
    border: 1.5px dashed rgba($ink, 0.14);
    animation: spin 60s linear infinite;
  }
}

.piece {
  position: absolute;

  &__parallax {
    will-change: transform;
  }

  &__float {
    animation: float var(--float) ease-in-out var(--delay) infinite alternate;
  }

  &__link {
    display: block;
    border-radius: $radius-sm;
    @include focus-ring;
  }

  &__img {
    width: 100%;
    height: auto;
    transform: rotate(var(--r));
    filter: drop-shadow(0 26px 24px rgba($ink, 0.28));
    transition: transform 0.6s cubic-bezier(0.34, 1.5, 0.64, 1);
    user-select: none;
  }

  &__link:hover .piece__img {
    transform: rotate(calc(var(--r) * -0.4)) scale(1.06);
  }

  &--back .piece__img {
    filter: blur(1.5px) drop-shadow(0 16px 16px rgba($ink, 0.18));
    opacity: 0.92;
  }
}

.chip {
  position: absolute;
  z-index: 20;

  &__body {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.4rem 0.85rem 0.4rem 0.4rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(10px);
    box-shadow: $shadow-md;
    font-size: 0.72rem;
    font-weight: 700;
    color: $ink;
    white-space: nowrap;
    animation: float 4.5s ease-in-out infinite alternate;

    @include from('md') {
      font-size: $text-sm;
    }
  }

  &__icon {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $accent;
    color: $surface;
    font-size: 0.75rem;
  }

  &--0 {
    top: 2%;
    right: 0;
  }

  &--1 {
    top: 46%;
    left: -2%;

    .chip__body {
      animation-delay: -1.5s;
    }

    .chip__icon {
      background: $brand-blue;
    }
  }

  &--2 {
    bottom: -2%;
    right: 4%;

    .chip__body {
      animation-delay: -3s;
    }

    .chip__icon {
      background: $lime;
      color: $ink;
    }
  }
}

@keyframes float {
  from {
    transform: translateY(-8px);
  }
  to {
    transform: translateY(10px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
