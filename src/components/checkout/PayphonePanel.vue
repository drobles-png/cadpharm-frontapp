<script setup lang="ts">
import { onMounted } from 'vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { usePayphone, PAYPHONE_CONTAINER } from '@/composables/usePayphone'
import { payphoneCopy as copy } from '@/config/checkout.copy'
import { formatCents } from '@/utils/format'
import type { PayphoneSession } from '@/composables/useCheckout'
import type { OrderCustomer } from '@/types'

/**
 * Contenedor propio para la Cajita de Payphone: encabezado, resumen, cuenta
 * regresiva y salida a otro método. Mientras la Cajita carga se ve un esqueleto
 * con la forma del formulario de tarjeta, en el mismo alto: nada salta.
 */
const props = defineProps<{ session: PayphoneSession; customer: OrderCustomer }>()
const emit = defineEmits<{ 'change-method': []; retry: [] }>()

const { ready, failed, expired, countdown, secondsLeft, mount: mountBox } = usePayphone()

function mount() {
  mountBox(props.session.box, props.customer)
}

onMounted(mount)
</script>

<template>
  <section class="pp" aria-labelledby="pp-title">
    <header class="pp__head">
      <span class="pp__lock" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>
      <div>
        <h2 id="pp-title" class="pp__title">{{ copy.title }}</h2>
        <p class="pp__subtitle">{{ copy.subtitle }}</p>
      </div>
    </header>

    <div class="pp__order">
      <span>{{ copy.order(session.order.orderNumber) }}</span>
      <strong>{{ formatCents(session.order.total) }}</strong>
    </div>

    <div
      class="pp__timer"
      :class="{ 'is-urgent': secondsLeft < 120 }"
      role="timer"
      aria-live="off"
    >
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      {{ copy.expiresIn }} <strong>{{ countdown }}</strong>
      <span class="pp__timer-bar" :style="{ '--p': secondsLeft / 600 }"></span>
    </div>

    <div class="pp__stage" aria-live="polite">
      <Transition name="pp-fade">
        <div v-if="expired" class="pp__state">
          <i class="fa-solid fa-hourglass-end" aria-hidden="true"></i>
          <h3>{{ copy.expiredTitle }}</h3>
          <p>{{ copy.expiredText }}</p>
          <button type="button" class="btn btn--primary" @click="emit('retry')">
            <i class="fa-solid fa-rotate-right"></i> {{ copy.retry }}
          </button>
        </div>
        <div v-else-if="failed" class="pp__state">
          <i class="fa-solid fa-plug-circle-exclamation" aria-hidden="true"></i>
          <p>{{ copy.loadError }}</p>
          <button type="button" class="btn btn--dark" @click="mount">{{ copy.reload }}</button>
        </div>
      </Transition>

      <div v-show="!expired && !failed" class="pp__box">
        <Transition name="pp-fade">
          <div v-if="!ready" class="pp__skeleton" aria-hidden="true">
            <SkeletonBlock height="2.6rem" radius="999px" />
            <SkeletonBlock width="40%" height="0.8rem" />
            <SkeletonBlock height="3rem" radius="12px" />
            <div class="pp__skeleton-row">
              <SkeletonBlock width="calc(50% - 0.375rem)" height="3rem" radius="12px" />
              <SkeletonBlock width="calc(50% - 0.375rem)" height="3rem" radius="12px" />
            </div>
            <SkeletonBlock width="40%" height="0.8rem" />
            <SkeletonBlock height="3rem" radius="12px" />
            <SkeletonBlock height="3.3rem" radius="999px" />
          </div>
        </Transition>
        <div :id="PAYPHONE_CONTAINER" class="pp__container" :class="{ 'is-ready': ready }"></div>
      </div>
    </div>

    <footer class="pp__foot">
      <button type="button" class="pp__change" @click="emit('change-method')">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.changeMethod }}
      </button>
      <span class="pp__powered"><i class="fa-solid fa-shield-halved"></i> {{ copy.poweredBy }}</span>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.pp {
  @include card;
  border-radius: $radius-lg;
  padding: 1.25rem;
  @include flex(column, stretch, flex-start, 1rem);

  @include from('md') {
    padding: 1.75rem;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 0.9rem);
  }

  &__lock {
    @include flex(row, center, center);
    flex: 0 0 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, $brand-blue, $accent);
    color: $surface;
    box-shadow: 0 10px 24px rgba($brand-blue, 0.28);
  }

  &__title {
    @include display($text-xl, 700);
    color: $ink;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.5;
    margin-top: 0.2rem;
  }

  &__order {
    @include flex(row, center, space-between, 1rem);
    padding: 0.85rem 1rem;
    border-radius: $radius-md;
    background: $paper;
    font-size: $text-sm;
    color: $ink-soft;

    strong {
      @include display($text-lg, 800);
      color: $ink;
    }
  }

  &__timer {
    position: relative;
    overflow: hidden;
    padding: 0.6rem 0.9rem 0.75rem;
    border-radius: $radius-sm;
    background: $brand-blue-soft;
    color: $brand-blue-deep;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;
    transition: background 0.4s ease, color 0.4s ease;

    i {
      margin-right: 0.3rem;
    }

    &.is-urgent {
      background: $warning-bg;
      color: darken($warning, 22%);
    }
  }

  &__timer-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 100%;
    background: currentColor;
    opacity: 0.5;
    transform-origin: left;
    transform: scaleX(var(--p, 1));
    transition: transform 1s linear;
  }

  &__stage {
    position: relative;
    min-height: 26rem;
  }

  &__box {
    position: relative;
    min-height: 26rem;
  }

  &__skeleton {
    position: absolute;
    inset: 0;
    @include flex(column, stretch, flex-start, 0.85rem);
    padding-top: 0.25rem;
  }

  &__skeleton-row {
    @include flex(row, stretch, flex-start, 0.75rem);
  }

  &__container {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.5s ease,
      transform 0.5s $ease;

    &.is-ready {
      opacity: 1;
      transform: none;
    }
  }

  &__state {
    position: absolute;
    inset: 0;
    @include flex(column, center, center, 0.75rem);
    text-align: center;
    padding: 1rem;
    color: $ink-soft;

    > i {
      font-size: 2.2rem;
      color: $brand-blue;
    }

    h3 {
      @include display($text-lg, 700);
      color: $ink;
    }

    p {
      max-width: 34ch;
      font-size: $text-sm;
      line-height: 1.55;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-top: 0.75rem;
    border-top: 1px solid $line;
  }

  &__change {
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 700;
    font-size: $text-sm;
    color: $brand-blue;
    padding: 0.4rem 0;
    @include focus-ring;

    i {
      transition: transform 0.3s $ease;
    }

    &:hover i {
      transform: translateX(-3px);
    }
  }

  &__powered {
    font-size: $text-xs;
    color: $ink-muted;

    i {
      color: $accent;
      margin-right: 0.2rem;
    }
  }
}

.pp-fade-enter-active,
.pp-fade-leave-active {
  transition: opacity 0.35s ease;
}
.pp-fade-enter-from,
.pp-fade-leave-to {
  opacity: 0;
}
</style>
