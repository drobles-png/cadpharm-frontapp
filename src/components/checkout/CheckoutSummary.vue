<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import AnimatedPrice from '@/components/cart/AnimatedPrice.vue'
import CheckoutSecureBadge from './CheckoutSecureBadge.vue'
import { useCheckoutCollapse } from '@/composables/useCheckoutCollapse'
import { checkoutCopy } from '@/config/checkout.copy'
import { formatCents, imageUrl } from '@/utils/format'
import type { CartLine } from '@/stores/cart'

/**
 * Resumen del pedido. En móvil va arriba y colapsado ("Ver resumen · $XX"):
 * el formulario manda. En desktop queda abierto y fijo al lado del formulario.
 */
defineProps<{ lines: CartLine[]; subtotal: number; shippingNote?: string }>()

const open = ref(false)
const cart = useCartStore()

const { onEnter, onAfterEnter, onLeave } = useCheckoutCollapse()
</script>

<template>
  <aside class="summary" :class="{ 'is-open': open }">
    <button
      type="button"
      class="summary__toggle"
      :aria-expanded="open"
      aria-controls="checkout-summary-body"
      @click="open = !open"
    >
      <span class="summary__toggle-label">
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        {{ open ? checkoutCopy.summaryHide : checkoutCopy.summaryToggle }}
        <i class="fa-solid fa-chevron-down summary__chevron" aria-hidden="true"></i>
      </span>
      <AnimatedPrice class="summary__toggle-total" :cents="subtotal" />
    </button>

    <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-show="open" id="checkout-summary-body" class="summary__body">
        <div class="summary__inner">
          <div class="summary__head">
            <h2 class="summary__title">{{ checkoutCopy.summaryTitle }}</h2>
            <button type="button" class="summary__edit" @click="cart.open()">
              {{ checkoutCopy.editCart }}
            </button>
          </div>
          <ul class="summary__lines">
            <li v-for="line in lines" :key="line.productId" class="summary__line">
              <span class="summary__media" :style="{ '--tone': line.color }">
                <img :src="imageUrl(line.image)" alt="" width="48" height="48" />
                <span class="summary__qty">{{ line.quantity }}</span>
              </span>
              <span class="summary__name">
                {{ line.name }} {{ line.nameAccent }}
                <small>{{ line.presentation }}</small>
              </span>
              <span class="summary__price">{{ formatCents(line.unitPrice * line.quantity) }}</span>
            </li>
          </ul>
          <dl class="summary__totals">
            <div class="summary__row">
              <dt>{{ checkoutCopy.subtotal }}</dt>
              <dd><AnimatedPrice :cents="subtotal" /></dd>
            </div>
            <div class="summary__row">
              <dt>{{ checkoutCopy.shipping }}</dt>
              <dd class="summary__muted">{{ checkoutCopy.shippingPending }}</dd>
            </div>
            <div class="summary__row summary__row--total">
              <dt>{{ checkoutCopy.total }}</dt>
              <dd><AnimatedPrice :cents="subtotal" /></dd>
            </div>
          </dl>
          <p v-if="shippingNote" class="summary__note">
            <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ shippingNote }}
          </p>
          <CheckoutSecureBadge class="summary__secure" />
        </div>
      </div>
    </Transition>
  </aside>
</template>

<style scoped lang="scss">
.summary {
  @include card;
  border-radius: $radius-lg;
  overflow: hidden;

  &__toggle {
    width: 100%;
    @include flex(row, center, space-between, 1rem);
    padding: 1rem 1.25rem;
    font-weight: 700;
    color: $ink;
    @include focus-ring;

    @include from('lg') {
      display: none;
    }
  }

  &__toggle-label {
    @include flex(row, center, flex-start, 0.55rem);
    color: $brand-blue;
  }

  &__chevron {
    font-size: 0.75rem;
    transition: transform 0.35s $ease;

    .is-open & {
      transform: rotate(180deg);
    }
  }

  &__toggle-total {
    font-family: $font-display;
    font-size: $text-lg;
  }

  &__body {
    overflow: hidden;
    transition: height 0.45s $ease;

    // En desktop siempre visible, gane lo que gane v-show.
    @include from('lg') {
      display: block !important;
      height: auto !important;
    }
  }

  &__inner {
    padding: 0 1.25rem 1.25rem;
    border-top: 1px solid $line;

    @include from('lg') {
      padding: 1.6rem;
      border-top: 0;
    }
  }

  &__head {
    @include flex(row, baseline, space-between);
    padding-top: 1.1rem;

    @include from('lg') {
      padding-top: 0;
    }
  }

  &__title {
    @include display($text-lg, 700);
    color: $ink;
  }

  &__edit {
    font-size: $text-sm;
    font-weight: 600;
    color: $brand-blue;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__lines {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__line {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__media {
    position: relative;
    @include flex(row, center, center);
    flex: 0 0 3.4rem;
    height: 3.4rem;
    border-radius: $radius-sm + 4px;
    background: color-mix(in srgb, var(--tone) 16%, white);

    img {
      width: 82%;
      height: 82%;
      object-fit: contain;
    }
  }

  &__qty {
    position: absolute;
    top: -0.4rem;
    right: -0.4rem;
    @include flex(row, center, center);
    min-width: 1.3rem;
    height: 1.3rem;
    padding: 0 0.3rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
    font-size: 0.7rem;
    font-weight: 700;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;
    line-height: 1.3;

    small {
      display: block;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__price {
    font-weight: 700;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    margin: 0;
    padding-top: 1rem;
    border-top: 1px dashed $line;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__row {
    @include flex(row, baseline, space-between);
    font-size: $text-sm;
    color: $ink-soft;

    dd {
      margin: 0;
      font-weight: 600;
      color: $ink;
    }

    &--total {
      margin-top: 0.35rem;
      font-size: $text-base;
      font-weight: 700;
      color: $ink;

      dd {
        @include display($text-xl, 800);
      }
    }
  }

  &__muted {
    color: $ink-muted !important;
    font-weight: 500 !important;
  }

  &__note {
    margin-top: 0.9rem;
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.5;

    i {
      color: $brand-blue;
      margin-right: 0.25rem;
    }
  }

  &__secure {
    margin-top: 1rem;
  }
}
</style>
