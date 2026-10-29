<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { productCopy as copy } from '@/config/pages.copy'

/** Ficha técnica resumida para médicos y farmacias. */
const props = defineProps<{ product: Product }>()

const rows = computed(() =>
  [
    { label: copy.proFields.registry, value: props.product.sanitaryRegistry },
    { label: copy.proFields.presentation, value: props.product.presentation },
    { label: copy.proFields.audience, value: props.product.audience },
    { label: copy.proFields.manufacturer, value: props.product.manufacturer },
    { label: copy.proFields.barcode, value: props.product.barcode },
  ].filter((row) => row.value),
)
</script>

<template>
  <aside class="sheet" data-reveal>
    <div class="sheet__head">
      <span class="sheet__icon"><i class="fa-solid fa-file-medical" aria-hidden="true"></i></span>
      <div>
        <h2 class="sheet__title">{{ copy.proTitle }}</h2>
        <p class="sheet__text">{{ copy.proText }}</p>
      </div>
    </div>
    <dl class="sheet__rows">
      <div v-for="row in rows" :key="row.label" class="sheet__row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>
    <RouterLink to="/profesionales" class="btn btn--light sheet__cta">
      <i class="fa-solid fa-user-doctor" aria-hidden="true"></i>{{ copy.proCta }}
    </RouterLink>
  </aside>
</template>

<style scoped lang="scss">
.sheet {
  position: relative;
  overflow: hidden;
  @include flex(column, stretch, flex-start, 1.4rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  border-radius: $radius-lg;
  background: $ink;
  color: $surface;

  &::after {
    content: '';
    position: absolute;
    width: 20rem;
    height: 20rem;
    right: -8rem;
    top: -8rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($accent, 0.4), transparent 65%);
    pointer-events: none;
  }

  &__head {
    @include flex(row, flex-start, flex-start, 1rem);
  }

  &__icon {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $lime;
    color: $ink;
    font-size: 1.2rem;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  &__text {
    font-size: $text-sm;
    color: rgba(255, 255, 255, 0.7);
  }

  &__rows {
    @include flex-cards(220px, 0.75rem);
  }

  &__row {
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);

    dt {
      font-size: $text-xs;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.55);
    }

    dd {
      font-weight: 700;
      overflow-wrap: anywhere;
    }
  }

  &__cta {
    position: relative;
    z-index: 1;
    align-self: flex-start;
  }
}
</style>
