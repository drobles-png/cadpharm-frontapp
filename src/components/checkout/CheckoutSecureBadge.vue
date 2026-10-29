<script setup lang="ts">
import { checkoutCopy } from '@/config/checkout.copy'

/** Sello de "Pago seguro": tranquiliza justo donde aparece el total. */
</script>

<template>
  <div class="secure">
    <span class="secure__icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></span>
    <span>
      <strong>{{ checkoutCopy.secureTitle }}</strong>
      {{ checkoutCopy.secureText }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.secure {
  @include flex(row, flex-start, flex-start, 0.75rem);
  padding: 0.85rem 1rem;
  border-radius: $radius-md;
  background: $accent-soft;
  font-size: $text-xs;
  line-height: 1.5;
  color: $ink-soft;

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 0.9rem;
  }

  strong {
    display: block;
    color: $ink;
    font-size: $text-sm;
  }
}
</style>
