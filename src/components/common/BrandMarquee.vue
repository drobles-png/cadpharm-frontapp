<script setup lang="ts">
import { brandsCopy as copy } from '@/config/info.copy'

/**
 * Barra de marcas que corre hacia la izquierda en bucle. La lista va dos veces
 * seguidas y se desplaza la mitad del ancho: al terminar, la segunda copia
 * ocupa el lugar exacto de la primera y el salto no se nota. Se detiene con el
 * cursor encima o mientras se mantiene presionada, y no se mueve con "reducir
 * movimiento".
 */
const loops = [0, 1]
</script>

<template>
  <section class="brands" aria-labelledby="brands-title">
    <h2 id="brands-title" class="brands__title">{{ copy.title }}</h2>

    <div class="brands__viewport">
      <!-- El touchstart vacío hace que Safari en iPhone aplique :active al mantener el dedo -->
      <div class="brands__track" @touchstart.passive="() => {}">
        <ul
          v-for="loop in loops"
          :key="loop"
          class="brands__list"
          :aria-hidden="loop === 1 ? 'true' : undefined"
        >
          <li v-for="brand in copy.items" :key="brand.slug">
            <RouterLink
              :to="`/productos/${brand.slug}`"
              class="brands__tile"
              :tabindex="loop === 1 ? -1 : undefined"
            >
              <strong class="brands__name" :class="{ 'brands__name--italic': brand.italic }">
                <span v-for="part in brand.parts" :key="part.text" :style="{ color: part.color }">{{
                  part.text
                }}</span>
              </strong>
              <span class="brands__text">{{ brand.text }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.brands {
  padding-block: 3.5rem 2.5rem;
  border-block: 1px solid $cream-line;
  text-align: center;
  @include flex(column, stretch, flex-start, 1.75rem);

  &__title {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 800;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: $cream;
  }

  &__viewport {
    overflow: hidden;
    user-select: none;
    -webkit-touch-callout: none;
    // Bordes que se desvanecen para que las marcas entren y salgan suave
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }

  &__track {
    display: flex;
    width: max-content;
    animation: brands-loop 32s linear infinite;

    // Mantener presionado (dedo o mouse) la detiene
    &:active {
      animation-play-state: paused;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        animation-play-state: paused;
      }
    }

    @include reduced-motion {
      animation: none;
    }
  }

  &__list {
    list-style: none;
    display: flex;

    li {
      width: clamp(15rem, 70vw, 22rem);
      border-inline-end: 1px solid $cream-line;

      @include from('md') {
        width: clamp(16rem, 25vw, 24rem);
      }
    }
  }

  &__tile {
    height: 100%;
    padding: 1.5rem 1.25rem;
    @include flex(column, center, center, 0.6rem);
    transition: opacity 0.2s ease;

    @media (hover: hover) and (pointer: fine) {
      &:hover .brands__name {
        transform: translateY(-2px);
      }
    }
  }

  &__name {
    font-family: $font-display;
    font-size: clamp(1.5rem, 1.1rem + 1.4vw, 2.3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);

    &--italic {
      font-style: italic;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $cream-soft;
    line-height: 1.5;
    max-width: 24ch;
  }
}

@keyframes brands-loop {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
