<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { catalogCopy, productPhotos } from '@/config/info.copy'

/**
 * Tarjeta informativa: foto de la caja sobre crema, nombre, para qué sirve y
 * presentación. Toda la tarjeta es un solo enlace a la ficha.
 */
const props = withDefaults(
  defineProps<{ product: Product; eager?: boolean; compact?: boolean }>(),
  { eager: false, compact: false },
)

const to = computed(() => `/productos/${props.product.slug}`)
const photo = computed(
  () => productPhotos[props.product.slug] ?? props.product.images[0] ?? '/img/placeholder.svg',
)
const fullName = computed(() => `${props.product.name} ${props.product.nameAccent}`.trim())
</script>

<template>
  <RouterLink :to="to" class="card" :class="{ 'card--compact': compact }">
    <span class="card__photo">
      <img
        :src="photo"
        :alt="`Caja de ${fullName}`"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        width="900"
        height="1200"
      />
    </span>
    <span class="card__body">
      <span class="card__meta">{{ product.presentation }}</span>
      <h3 class="card__name">
        {{ product.name }} <span class="card__accent">{{ product.nameAccent }}</span>
      </h3>
      <p v-if="!compact" class="card__text">{{ product.tagline }}</p>
      <span class="card__more">
        {{ catalogCopy.view }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </span>
    </span>
  </RouterLink>
</template>

<style scoped lang="scss">
.card {
  height: 100%;
  @include flex(column, stretch, flex-start);
  border: 1px solid $cream-line;
  border-radius: $radius-md;
  overflow: hidden;
  background: $forest;
  color: $cream;
  transition:
    border-color 0.2s ease,
    transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: $cream;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &:hover .card__more i {
      transform: translateX(4px);
    }
  }

  &__photo {
    position: relative;
    display: block;
    aspect-ratio: 1 / 1;
    background: $cream;
    overflow: hidden;

    // Las fotos traen fondo blanco: con multiply el blanco toma el crema de la
    // tarjeta y la caja queda "apoyada" sin un rectángulo blanco alrededor.
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      mix-blend-mode: multiply;
      transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    }
  }

  &__body {
    flex: 1;
    padding: 1.25rem 1.25rem 1.4rem;
    @include flex(column, flex-start, flex-start, 0.55rem);
  }

  &__meta {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $cream-muted;
  }

  &__name {
    font-size: $text-xl;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: $cream;
  }

  &__accent {
    font-weight: 600;
    color: $cream-soft;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.6;
    color: $cream-soft;
  }

  &__more {
    margin-top: auto;
    padding-top: 0.5rem;
    font-size: $text-sm;
    font-weight: 700;
    @include flex(row, center, flex-start, 0.45rem);

    i {
      font-size: 0.8em;
      transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
    }
  }

  &--compact &__photo {
    aspect-ratio: 5 / 4;
  }
}
</style>
