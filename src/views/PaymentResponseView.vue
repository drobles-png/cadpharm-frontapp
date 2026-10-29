<script setup lang="ts">
import { computed } from 'vue'
import OrderCelebration from '@/components/checkout/OrderCelebration.vue'
import { useCheckoutPaymentResponse } from '@/composables/useCheckoutPaymentResponse'
import { waLink } from '@/composables/useCheckoutMessages'
import { paymentResponseCopy as copy } from '@/config/checkout.copy'

/**
 * Vuelta desde Payphone. La confirmación arranca en onMounted del composable:
 * no se espera a nada más, Payphone reversa el cobro a los 5 minutos.
 */
const { state, message, orderNumber, confirm, retry } = useCheckoutPaymentResponse()

const waHref = computed(() =>
  waLink(copy.whatsappMessage(orderNumber.value || 'de la web')),
)
</script>

<template>
  <div class="presp">
    <div class="presp__card" aria-live="polite" :aria-busy="state === 'confirming'">
      <Transition name="rise" mode="out-in">
        <div v-if="state === 'confirming'" key="c" class="presp__state">
          <div class="presp__pulse" aria-hidden="true">
            <span></span>
            <span></span>
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h1 class="presp__title">{{ copy.confirming }}</h1>
          <p class="presp__text">{{ copy.confirmingText }}</p>
          <div class="presp__bar" aria-hidden="true"><span></span></div>
        </div>

        <div v-else-if="state === 'paid'" key="p" class="presp__state">
          <OrderCelebration />
        </div>

        <div v-else key="f" class="presp__state">
          <span class="presp__icon" :class="{ 'presp__icon--pending': state === 'pending' }" aria-hidden="true">
            <i :class="state === 'pending' ? 'fa-solid fa-hourglass-half' : 'fa-solid fa-credit-card'"></i>
          </span>
          <h1 class="presp__title">
            {{ state === 'pending' ? copy.pendingTitle : copy.failedTitle }}
          </h1>
          <p class="presp__text">{{ message }}</p>
          <div class="presp__actions">
            <button v-if="state === 'pending'" type="button" class="btn btn--primary btn--lg" @click="confirm">
              <i class="fa-solid fa-rotate-right"></i> {{ copy.checkAgain }}
            </button>
            <button v-else type="button" class="btn btn--primary btn--lg" @click="retry">
              <i class="fa-solid fa-rotate-right"></i> {{ copy.retry }}
            </button>
            <a :href="waHref" target="_blank" rel="noopener" class="btn btn--ghost btn--lg">
              <i class="fa-brands fa-whatsapp"></i> {{ copy.whatsapp }}
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.presp {
  @include flex(row, center, center);
  min-height: 70vh;
  padding: 2.5rem 1.25rem 4rem;
  background:
    radial-gradient(36rem 24rem at 50% 0%, rgba($brand-blue, 0.1), transparent 65%),
    $paper;

  &__card {
    @include card;
    width: 100%;
    max-width: 480px;
    min-height: 22rem;
    @include flex(column, center, center);
    padding: 2.25rem 1.5rem;
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    text-align: center;
  }

  &__state {
    @include flex(column, center, center, 0.75rem);
    width: 100%;
  }

  &__pulse {
    position: relative;
    @include flex(row, center, center);
    width: 5.5rem;
    height: 5.5rem;
    margin-bottom: 0.5rem;

    span {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba($accent, 0.25);
      animation: ring 1.8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;

      &:nth-child(2) {
        animation-delay: 0.9s;
      }
    }

    i {
      position: relative;
      @include flex(row, center, center);
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: linear-gradient(135deg, $brand-blue, $accent);
      color: $surface;
      font-size: 1.4rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 4.2rem;
    height: 4.2rem;
    border-radius: 50%;
    background: $danger-bg;
    color: $danger;
    font-size: 1.5rem;
    animation: wobble 0.6s $ease;

    &--pending {
      background: $warning-bg;
      color: darken($warning, 15%);
    }
  }

  &__title {
    @include display($text-xl, 800);
    color: $ink;
  }

  &__text {
    max-width: 36ch;
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.55;
  }

  &__bar {
    width: 70%;
    height: 6px;
    margin-top: 0.75rem;
    border-radius: $radius-pill;
    background: $sand;
    overflow: hidden;

    span {
      display: block;
      width: 40%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, $accent, $lime);
      animation: slide 1.3s ease-in-out infinite;
    }
  }

  &__actions {
    @include flex(column, stretch, center, 0.6rem);
    width: 100%;
    margin-top: 0.75rem;

    .btn {
      padding-inline: 1rem;
    }
  }
}

@keyframes ring {
  from {
    transform: scale(0.65);
    opacity: 1;
  }
  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

@keyframes wobble {
  30% {
    transform: rotate(-10deg) scale(1.08);
  }
  60% {
    transform: rotate(6deg);
  }
}
</style>
