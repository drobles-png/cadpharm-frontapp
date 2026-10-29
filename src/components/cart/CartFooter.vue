<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { cartMessage, waLink } from '@/composables/useCheckoutMessages'
import { cartCopy } from '@/config/checkout.copy'
import AnimatedPrice from './AnimatedPrice.vue'

/** Pie del carrito: subtotal vivo y las dos salidas (checkout o WhatsApp). */
const cart = useCartStore()
const emit = defineEmits<{ checkout: [] }>()

const whatsappHref = computed(() => waLink(cartMessage(cart.lines, cart.subtotal)))
</script>

<template>
  <footer class="cfoot">
    <div class="cfoot__total">
      <span>{{ cartCopy.subtotal }}</span>
      <AnimatedPrice class="cfoot__amount" :cents="cart.subtotal" />
    </div>
    <p class="cfoot__note">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> {{ cartCopy.shippingNote }}
    </p>
    <button type="button" class="btn btn--primary btn--lg btn--block cfoot__cta" @click="emit('checkout')">
      {{ cartCopy.checkout }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
    <a :href="whatsappHref" target="_blank" rel="noopener" class="cfoot__wa">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ cartCopy.whatsapp }}
    </a>
  </footer>
</template>

<style scoped lang="scss">
.cfoot {
  @include flex(column, stretch, flex-start, 0.7rem);
  padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
  border-top: 1px solid $line;
  background: linear-gradient(180deg, $surface, $paper);

  &__total {
    @include flex(row, baseline, space-between);
    font-weight: 600;
    color: $ink-soft;
  }

  &__amount {
    @include display($text-xl, 700);
    color: $ink;
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;

    i {
      color: $brand-blue;
      margin-right: 0.25rem;
    }
  }

  &__cta i {
    transition: transform 0.3s $ease;
  }

  &__cta:hover i {
    transform: translateX(4px);
  }

  &__wa {
    @include flex(row, center, center, 0.5rem);
    padding: 0.8rem;
    border-radius: $radius-pill;
    font-weight: 700;
    font-size: 0.92rem;
    color: $accent-deep;
    border: 1.5px solid rgba($accent, 0.35);
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
    @include focus-ring;

    i {
      font-size: 1.15rem;
    }

    &:hover {
      background: $accent-soft;
      border-color: $accent;
    }
  }
}
</style>
