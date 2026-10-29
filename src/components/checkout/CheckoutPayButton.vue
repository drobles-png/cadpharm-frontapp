<script setup lang="ts">
import { checkoutCopy } from '@/config/checkout.copy'

/**
 * Botón de pago. Mientras envía no hay spinner: una barra de progreso con
 * brillo recorre el botón y el texto cambia, sin que el botón cambie de tamaño.
 */
defineProps<{ label: string; loading: boolean; icon: string; whatsapp?: boolean }>()
</script>

<template>
  <button
    type="submit"
    class="pay-btn"
    :class="{ 'is-loading': loading, 'pay-btn--wa': whatsapp }"
    :aria-busy="loading"
    :disabled="loading"
  >
    <span class="pay-btn__bar" aria-hidden="true"></span>
    <Transition name="label" mode="out-in">
      <span v-if="loading" key="l" class="pay-btn__label">{{ checkoutCopy.sending }}</span>
      <span v-else key="r" class="pay-btn__label">
        <i :class="icon" aria-hidden="true"></i> {{ label }}
      </span>
    </Transition>
  </button>
</template>

<style scoped lang="scss">
.pay-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 3.6rem;
  @include flex(row, center, center);
  padding: 1rem 1.5rem;
  border-radius: $radius-pill;
  font-family: $font-principal;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: $surface;
  background: linear-gradient(120deg, $accent-deep, $accent 55%, darken($accent, 4%));
  box-shadow: 0 14px 34px rgba($accent, 0.32);
  transition:
    transform 0.25s $ease,
    box-shadow 0.25s ease;
  @include focus-ring($brand-blue);

  &--wa {
    background: linear-gradient(120deg, #128c4a, #1fae5a);
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba($accent, 0.38);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: progress;
  }

  // Brillo que pasa cada tanto en reposo: invita a hacer clic sin gritar.
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba(255, 255, 255, 0.28) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: pay-glint 3.6s ease-in-out 1.2s infinite;
  }

  &__label {
    position: relative;
    z-index: 1;
    @include flex(row, center, center, 0.55rem);
  }

  &__bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: rgba(255, 255, 255, 0.16);
    transform-origin: left;
    transform: scaleX(0);
  }

  &.is-loading &__bar {
    // Avanza rápido al principio y se frena cerca del final: nunca "termina" antes que el API.
    animation: pay-progress 6s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
  }

  &.is-loading::after {
    animation-duration: 1.1s;
    animation-delay: 0s;
  }
}

@keyframes pay-progress {
  to {
    transform: scaleX(0.92);
  }
}

@keyframes pay-glint {
  0%,
  60% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.label-enter-active,
.label-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.label-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.label-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
