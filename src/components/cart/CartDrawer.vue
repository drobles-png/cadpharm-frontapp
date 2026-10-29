<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useCheckoutFocusTrap } from '@/composables/useCheckoutFocusTrap'
import { cartCopy } from '@/config/checkout.copy'
import CartLineItem from './CartLineItem.vue'
import CartEmpty from './CartEmpty.vue'
import CartProgress from './CartProgress.vue'
import CartFooter from './CartFooter.vue'

/**
 * Carrito lateral. Se abre desde cualquier "Agregar" y deja al cliente a un
 * clic del checkout o de WhatsApp, sin salir de la página donde estaba.
 */
const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const panel = ref<HTMLElement | null>(null)
const isOpen = computed(() => cart.isOpen)

useBodyScroll(isOpen)
useCheckoutFocusTrap(isOpen, panel, () => cart.close())

// Navegar (por un link del carrito o con "atrás") siempre cierra el panel.
watch(
  () => route.fullPath,
  () => cart.close(),
)

function goCheckout() {
  cart.close()
  router.push({ name: 'Checkout' })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="cart-fade">
      <div v-if="cart.isOpen" class="cart-overlay" aria-hidden="true" @click="cart.close()"></div>
    </Transition>
    <Transition name="cart-slide">
      <aside
        v-if="cart.isOpen"
        ref="panel"
        class="cart"
        role="dialog"
        aria-modal="true"
        :aria-label="cartCopy.title"
        tabindex="-1"
      >
        <header class="cart__head">
          <div class="cart__title-row">
            <h2 class="cart__title">
              {{ cartCopy.title }}
              <span v-if="!cart.isEmpty" class="cart__count">{{ cartCopy.items(cart.count) }}</span>
            </h2>
            <button type="button" class="cart__close" :aria-label="cartCopy.close" @click="cart.close()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <CartProgress v-if="!cart.isEmpty" :step="0" />
        </header>

        <div class="cart__body">
          <Transition name="cart-swap" mode="out-in">
            <CartEmpty v-if="cart.isEmpty" @navigate="cart.close()" />
            <TransitionGroup v-else tag="div" name="cart-line" class="cart__lines">
              <CartLineItem
                v-for="line in cart.lines"
                :key="line.productId"
                :line="line"
                @quantity="cart.setQuantity(line.productId, $event)"
                @remove="cart.remove(line.productId)"
                @navigate="cart.close()"
              />
            </TransitionGroup>
          </Transition>
        </div>

        <Transition name="cart-foot">
          <CartFooter v-if="!cart.isEmpty" @checkout="goCheckout" />
        </Transition>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: $overlay;
  backdrop-filter: blur(4px);
}

.cart {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 260;
  width: 100%;
  @include flex(column, stretch, flex-start);
  background: $surface;
  box-shadow: $shadow-lg;
  outline: none;

  @include from('sm') {
    width: min(440px, 100vw);
    border-radius: $radius-lg 0 0 $radius-lg;
  }

  &__head {
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.15rem 1.25rem 1rem;
    border-bottom: 1px solid $line;
  }

  &__title-row {
    @include flex(row, center, space-between, 1rem);
  }

  &__title {
    @include display($text-xl, 700);
    @include flex(row, baseline, flex-start, 0.6rem);
    color: $ink;
  }

  &__count {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0;
    color: $accent-deep;
    background: $accent-soft;
    padding: 0.2rem 0.6rem;
    border-radius: $radius-pill;
  }

  &__close {
    @include flex(row, center, center);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: $paper;
    color: $ink;
    transition:
      transform 0.3s $ease,
      background 0.2s ease;
    @include focus-ring;

    &:hover {
      background: $sand;
      transform: rotate(90deg);
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 1.25rem;
  }

  &__lines {
    position: relative;
  }
}

.cart-fade-enter-active,
.cart-fade-leave-active {
  transition: opacity 0.35s ease;
}
.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
}

.cart-slide-enter-active {
  transition: transform 0.55s $ease;
}
.cart-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.55, 0, 0.75, 0.2);
}
.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateX(100%);
}

.cart-swap-enter-active,
.cart-swap-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s $ease;
}
.cart-swap-enter-from,
.cart-swap-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

// Al quitar una línea se desliza a la derecha y las de abajo suben a ocupar su lugar.
.cart-line-move,
.cart-line-enter-active,
.cart-line-leave-active {
  transition:
    transform 0.45s $ease,
    opacity 0.35s ease;
}
.cart-line-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.cart-line-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
.cart-line-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}

.cart-foot-enter-active,
.cart-foot-leave-active {
  transition:
    transform 0.4s $ease,
    opacity 0.3s ease;
}
.cart-foot-enter-from,
.cart-foot-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
