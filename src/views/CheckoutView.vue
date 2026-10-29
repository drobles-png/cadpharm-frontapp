<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { checkoutCopy as copy } from '@/config/checkout.copy'
import CheckoutForm from '@/components/checkout/CheckoutForm.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import PayphonePanel from '@/components/checkout/PayphonePanel.vue'
import CartEmpty from '@/components/cart/CartEmpty.vue'

/**
 * Checkout en una sola pantalla: datos, entrega y pago a la vista, sin pasos
 * escondidos. Al elegir tarjeta, el formulario cede su lugar a la Cajita de
 * Payphone en la misma columna, con el resumen siempre al lado.
 */
const cart = useCartStore()
const {
  form,
  config,
  configLoading,
  method,
  submitting,
  formError,
  payphone,
  submit,
  changeMethod,
  retryPayphone,
} = useCheckout()
</script>

<template>
  <div class="checkout">
    <div class="checkout__inner">
      <header class="checkout__head">
        <RouterLink to="/productos" class="checkout__back">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.back }}
        </RouterLink>
        <p class="checkout__eyebrow">
          <i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.eyebrow }}
        </p>
        <h1 class="checkout__title">{{ copy.title }}</h1>
      </header>

      <Transition name="rise" mode="out-in">
        <div v-if="cart.isEmpty && !payphone" key="empty" class="checkout__empty">
          <CartEmpty :title="copy.emptyTitle" :text="copy.emptyText" />
        </div>

        <div v-else key="flow" class="checkout__layout">
          <div class="checkout__aside">
            <CheckoutSummary
              :lines="cart.lines"
              :subtotal="cart.subtotal"
              :shipping-note="config?.shippingNote"
            />
          </div>

          <div class="checkout__main">
            <Transition name="swap" mode="out-in">
              <PayphonePanel
                v-if="payphone"
                :key="payphone.box.clientTransactionId"
                :session="payphone"
                :customer="form.payload()"
                @change-method="changeMethod"
                @retry="retryPayphone"
              />
              <CheckoutForm
                v-else
                v-model:method="method"
                :form="form"
                :total="cart.subtotal"
                :payphone-enabled="!!config?.payphoneEnabled"
                :config-loading="configLoading"
                :submitting="submitting"
                :error="formError"
                @submit="submit"
              />
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout {
  position: relative;
  padding: 1.5rem 0 4rem;
  background:
    radial-gradient(60rem 30rem at 110% -10%, rgba($lime, 0.22), transparent 60%),
    radial-gradient(50rem 30rem at -20% 0%, rgba($brand-blue, 0.08), transparent 60%),
    $paper;

  @include from('md') {
    padding: 2.5rem 0 5rem;
  }

  &__inner {
    @include container(1120px);
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.35rem);
    margin-bottom: 1.5rem;

    @include from('md') {
      margin-bottom: 2rem;
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.6rem;
    transition: color 0.2s ease;

    i {
      transition: transform 0.3s $ease;
    }

    &:hover {
      color: $brand-blue;

      i {
        transform: translateX(-3px);
      }
    }
  }

  &__eyebrow {
    @include eyebrow;

    i {
      margin-right: 0.3rem;
    }
  }

  &__title {
    @include display($display-sm, 800);
    color: $ink;
  }

  &__empty {
    @include card;
    border-radius: $radius-lg;
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 380px;
      position: sticky;
      top: 6rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease;
}
.swap-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
