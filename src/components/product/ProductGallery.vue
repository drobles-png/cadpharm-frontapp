<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'
import { imageUrl } from '@/utils/format'
import { productCopy } from '@/config/pages.copy'

/**
 * Galería: primero el recorte sobre el color del producto, luego todas las
 * fotos reales. Zoom siguiendo el cursor en desktop y swipe en móvil.
 */
const props = defineProps<{ product: Product }>()

const cutoutOk = ref(true)
const slides = computed(() => {
  const photos = props.product.images.map((src) => ({ src: imageUrl(src), cutout: false }))
  return props.product.cutout && cutoutOk.value
    ? [{ src: props.product.cutout, cutout: true }, ...photos]
    : photos
})
const index = ref(0)
const direction = ref<1 | -1>(1)
const current = computed(() => slides.value[index.value] ?? slides.value[0])
const name = computed(() => `${props.product.name} ${props.product.nameAccent}`.trim())

watch(
  () => props.product.slug,
  () => {
    index.value = 0
    cutoutOk.value = true
  },
)

function go(i: number) {
  const total = slides.value.length
  if (!total) return
  const next = (i + total) % total
  direction.value = next >= index.value ? 1 : -1
  index.value = next
}

// Zoom: el origen de la escala sigue al cursor.
const zoom = ref(false)
const origin = ref('50% 50%')
function onMove(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  origin.value = `${x}% ${y}%`
}

// Swipe en táctil.
let startX = 0
function onTouchStart(event: TouchEvent) {
  startX = event.touches[0]?.clientX ?? 0
}
function onTouchEnd(event: TouchEvent) {
  const dx = (event.changedTouches[0]?.clientX ?? 0) - startX
  if (Math.abs(dx) > 40) go(index.value + (dx < 0 ? 1 : -1))
}
</script>

<template>
  <div class="gallery" :style="{ '--p': product.theme.primary, '--s': product.theme.secondary }">
    <div
      class="gallery__main"
      :class="{ 'gallery__main--zoom': zoom && !current?.cutout }"
      :title="productCopy.zoomHint"
      @mouseenter="zoom = true"
      @mouseleave="zoom = false"
      @mousemove="onMove"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <Transition :name="direction > 0 ? 'slide-next' : 'slide-prev'">
        <img
          v-if="current"
          :key="current.src"
          :src="current.src"
          :alt="`${name}, imagen ${index + 1} de ${slides.length}`"
          class="gallery__img"
          :class="{ 'gallery__img--cutout': current.cutout }"
          :style="{ transformOrigin: origin }"
          draggable="false"
          @error="current.cutout && (cutoutOk = false)"
        />
      </Transition>

      <button
        type="button"
        class="gallery__nav gallery__nav--prev"
        aria-label="Imagen anterior"
        @click="go(index - 1)"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        class="gallery__nav gallery__nav--next"
        aria-label="Imagen siguiente"
        @click="go(index + 1)"
      >
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
      <span class="gallery__counter" aria-hidden="true">{{ index + 1 }} / {{ slides.length }}</span>
    </div>

    <div class="gallery__thumbs" role="tablist" aria-label="Fotos del producto">
      <button
        v-for="(slide, i) in slides"
        :key="slide.src"
        type="button"
        role="tab"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === index, 'gallery__thumb--cutout': slide.cutout }"
        :aria-selected="i === index"
        :aria-label="`Ver imagen ${i + 1}`"
        @click="go(i)"
      >
        <img :src="slide.src" alt="" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.8rem);
  min-width: 0;

  &__main {
    position: relative;
    aspect-ratio: 1 / 1.05;
    border-radius: $radius-lg;
    overflow: hidden;
    background: linear-gradient(
      150deg,
      color-mix(in srgb, var(--p) 20%, #fff),
      color-mix(in srgb, var(--s) 28%, #fff)
    );
    touch-action: pan-y;
    cursor: zoom-in;
  }

  &__img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease-out;
    user-select: none;

    &--cutout {
      object-fit: contain;
      padding: 12%;
      filter: drop-shadow(0 30px 30px rgba($ink, 0.25));
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &__main--zoom &__img {
      transform: scale(2.1);
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 2.6rem;
    height: 2.6rem;
    margin-top: -1.3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: $ink;
    box-shadow: $shadow-sm;
    @include flex(row, center, center);
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s $ease;
    @include focus-ring;

    &--prev {
      left: 0.8rem;
    }

    &--next {
      right: 0.8rem;
    }

    &:focus-visible {
      opacity: 1;
    }

    @media (hover: none) {
      opacity: 1;
    }
  }

  &__main:hover &__nav {
    opacity: 1;
  }

  &__counter {
    position: absolute;
    bottom: 0.9rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    font-size: $text-xs;
    font-weight: 700;
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
    background: rgba($ink, 0.75);
    color: $surface;
  }

  &__thumbs {
    @include flex(row, center, flex-start, 0.55rem);
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0.2rem;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__thumb {
    flex: 0 0 4.4rem;
    height: 4.4rem;
    border-radius: $radius-sm;
    overflow: hidden;
    border: 2px solid transparent;
    opacity: 0.6;
    transition:
      opacity 0.3s ease,
      border-color 0.3s ease,
      transform 0.3s $ease;
    @include focus-ring;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--cutout {
      background: color-mix(in srgb, var(--p) 18%, #fff);

      img {
        object-fit: contain;
        padding: 12%;
      }
    }

    &:hover {
      opacity: 1;
      transform: translateY(-2px);
    }

    &--active {
      opacity: 1;
      border-color: var(--p);
    }
  }
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.55s $ease;
}

.slide-next-enter-from,
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(8%) scale(1.04);
}

.slide-next-leave-to,
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-8%) scale(1.04);
}
</style>
