<script setup lang="ts">
import type { Product } from '@/types'
import { formatCents } from '@/utils/format'
import { productCopy as copy } from '@/config/pages.copy'
import QuantityStepper from './QuantityStepper.vue'

/** Columna de compra de la ficha: nombre, precio, cantidad y los tres caminos de compra. */
defineProps<{ product: Product; waHref: string }>()
const quantity = defineModel<number>('quantity', { required: true })
defineEmits<{ add: []; buy: [] }>()
</script>

<template>
  <div class="buy" :style="{ '--p': product.theme.primary, '--i': product.theme.ink }">
    <RouterLink to="/productos" class="buy__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ copy.back }}
    </RouterLink>
    <RouterLink
      :to="{ path: '/productos', query: { categoria: product.category } }"
      class="buy__category"
    >
      {{ product.categoryLabel }}
    </RouterLink>

    <h1 class="buy__name">
      {{ product.name }} <span>{{ product.nameAccent }}</span>
    </h1>
    <p class="buy__tagline">{{ product.tagline }}</p>
    <p class="buy__description">{{ product.description }}</p>

    <ul class="buy__badges">
      <li><i class="fa-solid fa-box" aria-hidden="true"></i>{{ product.presentation }}</li>
      <li v-if="product.sanitaryRegistry">
        <i class="fa-solid fa-shield-heart" aria-hidden="true"></i>{{ copy.registry }}
        {{ product.sanitaryRegistry }}
      </li>
      <li v-if="product.audience">
        <i class="fa-solid fa-users" aria-hidden="true"></i>{{ product.audience }}
      </li>
    </ul>

    <div class="buy__panel">
      <div class="buy__price-row">
        <p v-if="product.price !== null" class="buy__price">{{ formatCents(product.price) }}</p>
        <p v-else class="buy__price buy__price--ask">{{ copy.askPrice }}</p>
        <QuantityStepper v-if="product.price !== null" v-model="quantity" :label="copy.quantity" />
      </div>

      <template v-if="product.price !== null">
        <button type="button" class="btn btn--primary btn--lg btn--block" @click="$emit('add')">
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ copy.addToCart }}
        </button>
        <button type="button" class="btn btn--dark btn--lg btn--block" @click="$emit('buy')">
          <i class="fa-solid fa-bolt" aria-hidden="true"></i>{{ copy.buyNow }}
        </button>
        <a :href="waHref" class="buy__wa" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ copy.whatsapp }}
        </a>
      </template>
      <a
        v-else
        :href="waHref"
        class="btn btn--dark btn--lg btn--block"
        target="_blank"
        rel="noopener"
      >
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ copy.whatsapp }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.buy {
  @include flex(column, flex-start, flex-start, 0.9rem);

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
    transition: color 0.25s ease;

    &:hover {
      color: $ink;
    }
  }

  &__category {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
    background: color-mix(in srgb, var(--p) 14%, #fff);
    color: var(--i);
  }

  &__name {
    font-size: clamp(2.4rem, 1.6rem + 3.5vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.95;

    span {
      color: var(--p);
    }
  }

  &__tagline {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  &__description {
    color: $ink-soft;
  }

  &__badges {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    li {
      @include flex(row, center, flex-start, 0.45rem);
      font-size: $text-xs;
      font-weight: 700;
      padding: 0.45rem 0.8rem;
      border-radius: $radius-pill;
      background: $surface;
      border: 1px solid $line;
    }

    i {
      color: var(--p);
    }
  }

  &__panel {
    width: 100%;
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-top: 0.6rem;
    padding: 1.3rem;
    border-radius: $radius-lg;
    background: $surface;
    box-shadow: $shadow-md;
  }

  &__price-row {
    @include flex(row, center, space-between, 1rem);
    margin-bottom: 0.3rem;
  }

  &__price {
    font-family: $font-display;
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;

    &--ask {
      font-size: $text-xl;
      color: $ink-soft;
    }
  }

  &__wa {
    @include flex(row, center, center, 0.5rem);
    padding: 0.6rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;
    border-radius: $radius-pill;
    transition: color 0.25s ease;

    i {
      color: #25d366;
      font-size: 1.2rem;
    }

    &:hover {
      color: $ink;
    }
  }
}
</style>
