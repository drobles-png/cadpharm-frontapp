<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cartCopy } from '@/config/checkout.copy'

/** Estado vacío ilustrado: una bolsa con hojas que flota, hecha con iconos y CSS. */
withDefaults(defineProps<{ title?: string; text?: string }>(), {
  title: cartCopy.emptyTitle,
  text: cartCopy.emptyText,
})
const emit = defineEmits<{ navigate: [] }>()
</script>

<template>
  <div class="empty">
    <div class="empty__art" aria-hidden="true">
      <span class="empty__ring"></span>
      <span class="empty__blob"></span>
      <i class="fa-solid fa-bag-shopping empty__bag"></i>
      <i class="fa-solid fa-leaf empty__leaf empty__leaf--a"></i>
      <i class="fa-solid fa-droplet empty__leaf empty__leaf--b"></i>
    </div>
    <h3 class="empty__title">{{ title }}</h3>
    <p class="empty__text">{{ text }}</p>
    <RouterLink to="/productos" class="btn btn--primary btn--lg" @click="emit('navigate')">
      {{ cartCopy.emptyCta }} <i class="fa-solid fa-arrow-right"></i>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.75rem);
  text-align: center;
  padding: 2.5rem 1.5rem;

  &__art {
    position: relative;
    width: 9rem;
    height: 9rem;
    @include flex(row, center, center);
    margin-bottom: 0.75rem;
  }

  &__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px dashed rgba($accent, 0.35);
    animation: empty-spin 18s linear infinite;
  }

  &__blob {
    position: absolute;
    inset: 1.1rem;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba($lime, 0.85), rgba($accent, 0.25) 70%);
  }

  &__bag {
    position: relative;
    font-size: 2.8rem;
    color: $ink;
    animation: empty-float 3.2s $ease infinite alternate;
  }

  &__leaf {
    position: absolute;
    font-size: 1.1rem;

    &--a {
      top: 0.6rem;
      right: 0.8rem;
      color: $accent;
      animation: empty-float 2.6s ease-in-out infinite alternate-reverse;
    }

    &--b {
      bottom: 1rem;
      left: 0.6rem;
      color: $brand-blue;
      animation: empty-float 3s ease-in-out infinite alternate;
    }
  }

  &__title {
    @include display($text-xl, 700);
    color: $ink;
  }

  &__text {
    max-width: 30ch;
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.55;
    margin-bottom: 0.75rem;
  }
}

@keyframes empty-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes empty-float {
  to {
    transform: translateY(-8px);
  }
}
</style>
