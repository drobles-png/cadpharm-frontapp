<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@/types'
import { formatCents } from '@/utils/format'
import { productCopy } from '@/config/pages.copy'
import { useTilt } from '@/composables/useTilt'
import ProductVisual from './ProductVisual.vue'
import AddToCartButton from './AddToCartButton.vue'

/**
 * Tarjeta de producto con el mundo de color de su empaque. En desktop se
 * inclina siguiendo el mouse y el producto "sale" de la tarjeta al hover.
 */
const props = withDefaults(defineProps<{ product: Product; eager?: boolean }>(), {
  eager: false,
})

const card = ref<HTMLElement | null>(null)
useTilt(card, 7)

const to = computed(() => `/productos/${props.product.slug}`)
const vars = computed(() => ({
  '--p': props.product.theme.primary,
  '--s': props.product.theme.secondary,
  '--i': props.product.theme.ink,
}))
</script>

<template>
  <article ref="card" class="card" :style="vars">
    <RouterLink :to="to" class="card__stage" tabindex="-1" aria-hidden="true">
      <span class="card__halo"></span>
      <span class="card__category">{{ product.categoryLabel }}</span>
      <span class="card__visual">
        <ProductVisual :product="product" :lazy="!eager" />
      </span>
    </RouterLink>

    <div class="card__body">
      <h3 class="card__name">
        <RouterLink :to="to" class="card__link">
          {{ product.name }} <span class="card__accent">{{ product.nameAccent }}</span>
        </RouterLink>
      </h3>
      <p class="card__tagline">{{ product.tagline }}</p>
      <p class="card__meta">
        <i class="fa-solid fa-box" aria-hidden="true"></i>{{ product.presentation }}
      </p>

      <div class="card__foot">
        <span v-if="product.price !== null" class="card__price">{{
          formatCents(product.price)
        }}</span>
        <span v-else class="card__price card__price--ask">{{ productCopy.askPrice }}</span>
        <AddToCartButton :product="product" class="card__btn" />
      </div>
      <RouterLink :to="to" class="card__more">
        {{ productCopy.details }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  --rx: 0deg;
  --ry: 0deg;
  --mx: 50%;
  --my: 30%;
  position: relative;
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
  transition:
    transform 0.5s $ease,
    box-shadow 0.5s $ease;

  &:hover {
    box-shadow: 0 30px 60px color-mix(in srgb, var(--p) 26%, transparent);
  }

  &__stage {
    position: relative;
    display: block;
    height: 15.5rem;
    border-radius: $radius-lg $radius-lg $radius-md $radius-md;
    margin: 0.5rem 0.5rem 0;
    background: linear-gradient(
      150deg,
      color-mix(in srgb, var(--p) 22%, #fff) 0%,
      color-mix(in srgb, var(--s) 30%, #fff) 100%
    );
    overflow: hidden;
  }

  &__halo {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mx) var(--my),
      rgba(255, 255, 255, 0.85),
      transparent 55%
    );
    opacity: 0.7;
    transition: opacity 0.4s ease;
  }

  &__category {
    position: absolute;
    top: 0.9rem;
    left: 0.9rem;
    z-index: 2;
    font-size: $text-xs;
    font-weight: 700;
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.8);
    color: var(--i);
    backdrop-filter: blur(6px);
  }

  &__visual {
    position: absolute;
    inset: 2.6rem 1.5rem 1rem;
    transform: translateZ(40px);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__visual {
    transform: translateY(-14px) rotate(-4deg) scale(1.07);
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 1.1rem 1.25rem 1.3rem;
    flex: 1;
  }

  &__name {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  &__link {
    @include focus-ring;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
    }
  }

  &__accent {
    color: var(--p);
  }

  &__tagline {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
  }

  &__foot {
    @include flex(row, center, space-between, 0.75rem);
    margin-top: auto;
    padding-top: 0.7rem;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;

    &--ask {
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 700;
      color: $ink-soft;
      max-width: 8ch;
      line-height: 1.25;
    }
  }

  &__btn {
    position: relative;
    z-index: 1;
    padding: 0.7rem 1.1rem;
  }

  &__more {
    position: relative;
    z-index: 1;
    align-self: flex-start;
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 700;
    color: var(--i);
    margin-top: 0.3rem;

    i {
      transition: transform 0.3s $ease;
    }

    &:hover i {
      transform: translateX(4px);
    }
  }
}
</style>
