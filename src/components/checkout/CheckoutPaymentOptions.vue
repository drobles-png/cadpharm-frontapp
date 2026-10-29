<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { paymentOptions } from '@/config/checkout.copy'
import type { PaymentMethod } from '@/types'

/** Tarjetas de método de pago como radios reales: teclado y lector funcionan solos. */
defineProps<{ payphoneEnabled: boolean; loading: boolean }>()
const method = defineModel<PaymentMethod>({ required: true })

const order: PaymentMethod[] = ['payphone', 'whatsapp']
</script>

<template>
  <fieldset class="pay">
    <legend class="visually-hidden">Método de pago</legend>
    <label
      v-for="key in order"
      :key="key"
      class="pay__option"
      :class="{
        'is-selected': method === key && !(key === 'payphone' && !payphoneEnabled),
        'is-disabled': key === 'payphone' && !payphoneEnabled && !loading,
        'is-wa': key === 'whatsapp',
      }"
    >
      <input
        v-model="method"
        type="radio"
        name="payment-method"
        class="pay__radio"
        :value="key"
        :disabled="key === 'payphone' && (!payphoneEnabled || loading)"
      />
      <span class="pay__icon" aria-hidden="true"><i :class="paymentOptions[key].icon"></i></span>
      <span class="pay__text">
        <span class="pay__title">
          {{ paymentOptions[key].title }}
          <template v-if="key === 'payphone'">
            <SkeletonBlock v-if="loading" width="4.5rem" height="1.1rem" radius="999px" />
            <span v-else-if="!payphoneEnabled" class="pay__tag pay__tag--soon">
              {{ paymentOptions.payphone.soon }}
            </span>
            <span v-else class="pay__tag">{{ paymentOptions.payphone.badge }}</span>
          </template>
        </span>
        <span class="pay__desc">{{ paymentOptions[key].text }}</span>
      </span>
      <span class="pay__check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
    </label>
  </fieldset>
</template>

<style scoped lang="scss">
.pay {
  @include flex(column, stretch, flex-start, 0.75rem);
  width: 100%;
  border: 0;
  padding: 0;
  margin: 0;

  &__option {
    position: relative;
    @include flex(row, center, flex-start, 0.9rem);
    margin: 0;
    padding: 1rem 1.1rem;
    border: 1.5px solid $line;
    border-radius: $radius-md;
    background: $paper;
    cursor: pointer;
    transition:
      border-color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease,
      transform 0.25s $ease;

    &:hover:not(.is-disabled) {
      border-color: darken($line, 10%);
      transform: translateY(-1px);
    }

    &:has(:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 3px;
    }

    &.is-selected {
      border-color: $accent;
      background: $surface;
      box-shadow: 0 10px 30px rgba($accent, 0.14);
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.6;
      filter: grayscale(0.6);
    }
  }

  &__radio {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 2.75rem;
    height: 2.75rem;
    border-radius: $radius-sm + 2px;
    font-size: 1.15rem;
    background: $brand-blue-soft;
    color: $brand-blue;
    transition: transform 0.35s $ease;

    .is-wa & {
      background: $accent-soft;
      color: $accent-deep;
      font-size: 1.4rem;
    }

    .is-selected & {
      transform: rotate(-8deg) scale(1.06);
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.2rem);
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    font-weight: 700;
    font-size: 0.98rem;
    color: $ink;
  }

  &__tag {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.18rem 0.55rem;
    border-radius: $radius-pill;
    background: $lime;
    color: $ink;

    &--soon {
      background: $sand;
      color: $ink-soft;
    }
  }

  &__desc {
    font-size: $text-sm;
    font-weight: 400;
    color: $ink-soft;
    line-height: 1.45;
  }

  &__check {
    @include flex(row, center, center);
    flex: 0 0 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    border: 1.5px solid $line;
    color: transparent;
    font-size: 0.7rem;
    transition:
      background 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease,
      transform 0.35s $ease;

    .is-selected & {
      background: $accent;
      border-color: $accent;
      color: $surface;
      transform: scale(1.1);
    }
  }
}
</style>
