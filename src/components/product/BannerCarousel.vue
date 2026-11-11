<script setup lang="ts">
import { computed } from 'vue'
import { productBanners as copy } from '@/config/info.copy'
import { useAutoplay } from '@/composables/useAutoplay'

/**
 * Banners de producto que se deslizan solos hacia la izquierda. Cada banner
 * lleva a la ficha de su producto. Se detienen solo mientras se mantienen
 * presionados (con el mouse encima casi siempre quedaban quietos); se cambian con las flechas o deslizando con el dedo. Todos cargan de entrada (son 4): con lazy, el banner que entra
 * deslizándose aparecía vacío.
 */
const SLIDE_MS = 3000

const slides = copy.slides
const count = computed(() => slides.length)
const { index, next, prev, hold, release } = useAutoplay(count, SLIDE_MS)

// Swipe: un gesto horizontal corto o rápido basta para cambiar.
let startX = 0
let startT = 0
function onTouchStart(e: TouchEvent) {
  startX = e.touches[0]?.clientX ?? 0
  startT = Date.now()
}
function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - startX
  const velocity = Math.abs(dx) / Math.max(Date.now() - startT, 1)
  if (Math.abs(dx) > 50 || velocity > 0.4) (dx < 0 ? next : prev)()
}
</script>

<template>
  <section
    class="banners"
    :aria-label="copy.label"
    aria-roledescription="carrusel"
  >
    <div
      class="banners__viewport"
      @pointerdown="hold"
      @pointerup="release"
      @pointercancel="release"
      @pointerleave="release"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <ul class="banners__track" :style="{ transform: `translateX(-${index * 100}%)` }">
        <li
          v-for="(slide, i) in slides"
          :key="slide.slug"
          class="banners__slide"
          :aria-hidden="i !== index"
          aria-roledescription="diapositiva"
        >
          <RouterLink :to="`/productos/${slide.slug}`" :tabindex="i === index ? 0 : -1">
            <img
              :src="slide.image"
              :alt="slide.alt"
              :fetchpriority="i === 0 ? 'high' : 'low'"
              decoding="async"
            />
          </RouterLink>
        </li>
      </ul>
    </div>

    <button
      type="button"
      class="banners__arrow banners__arrow--prev"
      :aria-label="copy.prev"
      @click="prev"
    >
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
    </button>
    <button
      type="button"
      class="banners__arrow banners__arrow--next"
      :aria-label="copy.next"
      @click="next"
    >
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
    <p class="visually-hidden" aria-live="polite">{{ slides[index]?.name }}</p>
  </section>
</template>

<style scoped lang="scss">
.banners {
  position: relative;
  @include container(1280px);
  padding-top: 1.25rem;

  @include from('md') {
    padding-top: 2rem;
  }

  &__viewport {
    overflow: hidden;
    user-select: none;
    -webkit-touch-callout: none;
    border-radius: $radius-md;
    background: $forest-deep;
    touch-action: pan-y;
  }

  &__track {
    list-style: none;
    display: flex;
    transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);

    @include reduced-motion {
      transition: none;
    }
  }

  &__slide {
    flex: 0 0 100%;
    min-width: 0;

    a {
      display: block;
    }

    img {
      width: 100%;
      aspect-ratio: 16 / 7;
      object-fit: cover;

      // En móvil el banner completo se ve muy chico: se recorta un poco más alto.
      @include until('md') {
        aspect-ratio: 16 / 9;
      }
    }
  }

  // Flechas sobre los bordes del banner; en móvil se cambia deslizando.
  &__arrow {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: rgba($forest, 0.75);
    border: 1px solid rgba($cream, 0.3);
    color: $cream;
    display: none;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    transform: translateY(-50%);
    transition:
      background-color 0.2s ease,
      transform 0.16s ease-out;

    @include from('md') {
      display: flex;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background: $forest;
      }
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }

    &--prev {
      left: 3rem;
    }

    &--next {
      right: 3rem;
    }
  }
}
</style>
