<script setup lang="ts">
import { checkoutCopy } from '@/config/checkout.copy'

/** Sección numerada del checkout: el número se vuelve un check verde al completarse. */
defineProps<{ index: number; title: string; subtitle: string; done?: boolean }>()
</script>

<template>
  <section class="section" :class="{ 'is-done': done }" :aria-labelledby="`checkout-step-${index}`">
    <header class="section__head">
      <span class="section__badge" aria-hidden="true">
        <Transition name="badge" mode="out-in">
          <i v-if="done" key="done" class="fa-solid fa-check"></i>
          <span v-else key="num">{{ index }}</span>
        </Transition>
      </span>
      <div class="section__titles">
        <h2 :id="`checkout-step-${index}`" class="section__title">
          {{ title }}
          <span v-if="done" class="visually-hidden">({{ checkoutCopy.done }})</span>
        </h2>
        <p class="section__subtitle">{{ subtitle }}</p>
      </div>
    </header>
    <div class="section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section {
  @include card;
  border-radius: $radius-lg;
  padding: 1.25rem;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease;

  @include from('md') {
    padding: 1.75rem;
  }

  &.is-done {
    border-color: rgba($accent, 0.35);
    box-shadow: 0 0 0 4px rgba($accent, 0.06);
  }

  &__head {
    @include flex(row, center, flex-start, 0.85rem);
    margin-bottom: 1.25rem;
  }

  &__badge {
    @include flex(row, center, center);
    flex: 0 0 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: $ink;
    color: $surface;
    font-weight: 700;
    font-size: 0.95rem;
    transition:
      background 0.35s ease,
      box-shadow 0.35s ease;

    .is-done & {
      background: $accent;
      box-shadow: 0 0 0 6px rgba($accent, 0.16);
      animation: badge-pop 0.55s $ease;
    }
  }

  &__title {
    @include display($text-lg, 700);
    color: $ink;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-muted;
    margin-top: 0.1rem;
  }

  &__body {
    @include flex(row, flex-start, flex-start);
    flex-wrap: wrap;
    gap: 0.2rem 1rem;
  }
}

.badge-enter-active,
.badge-leave-active {
  transition:
    transform 0.3s $ease,
    opacity 0.2s ease;
}
.badge-enter-from {
  transform: scale(0.2) rotate(-60deg);
  opacity: 0;
}
.badge-leave-to {
  transform: scale(0.4);
  opacity: 0;
}

@keyframes badge-pop {
  40% {
    transform: scale(1.18);
  }
}
</style>
