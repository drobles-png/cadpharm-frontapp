<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { detailCopy } from '@/config/info.copy'

/**
 * Ficha técnica resumida para el médico: los datos de registro del producto en
 * un solo bloque, más los dos caminos de contacto.
 */
const props = defineProps<{ product: Product; waHref: string }>()
const copy = detailCopy.pro

// Solo se muestran las filas que el producto tiene cargadas en el panel.
const rows = computed(() =>
  [
    { label: copy.registry, value: props.product.sanitaryRegistry, code: true },
    { label: copy.presentation, value: props.product.presentation, code: false },
    { label: copy.audience, value: props.product.audience, code: false },
    { label: copy.manufacturer, value: props.product.manufacturer, code: false },
    { label: copy.barcode, value: props.product.barcode, code: true },
  ].filter((row) => row.value),
)
</script>

<template>
  <section class="sheet" aria-labelledby="pro-sheet-title">
    <header class="sheet__head">
      <span class="sheet__icon"><i class="fa-solid fa-file-medical" aria-hidden="true"></i></span>
      <div>
        <h2 id="pro-sheet-title" class="sheet__title">{{ copy.title }}</h2>
        <p class="sheet__text">{{ copy.text }}</p>
      </div>
    </header>

    <dl class="sheet__rows">
      <div v-for="row in rows" :key="row.label" class="sheet__row">
        <dt>{{ row.label }}</dt>
        <dd :class="{ 'sheet__code': row.code }">{{ row.value }}</dd>
      </div>
    </dl>

    <div class="sheet__actions">
      <RouterLink
        :to="{ path: '/profesionales', hash: '#contacto', query: { producto: product.slug } }"
        class="btn btn--cream btn--lg"
      >
        <i class="fa-solid fa-user-doctor" aria-hidden="true"></i>{{ copy.cta }}
      </RouterLink>
      <a :href="waHref" class="btn btn--line btn--lg" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ copy.whatsapp }}
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sheet {
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: $radius-md;
  background: $forest-raised;
  border: 1px solid $cream-line;
  color: $cream;
  @include flex(column, stretch, flex-start, 1.5rem);

  &__head {
    @include flex(row, flex-start, flex-start, 1rem);
  }

  &__icon {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    background: $cream;
    color: $forest;
    font-size: 1.2rem;
    @include flex(row, center, center);
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__text {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $cream-soft;
  }

  &__rows {
    @include flex(column, stretch, flex-start, 0);
    border-top: 1px solid $cream-line;
  }

  &__row {
    padding-block: 0.85rem;
    border-bottom: 1px solid $cream-line;
    @include flex(column, stretch, flex-start, 0.2rem);

    @include from('sm') {
      flex-direction: row;
      align-items: baseline;
      justify-content: space-between;
      gap: 1.5rem;
    }

    dt {
      flex-shrink: 0;
      font-size: $text-sm;
      color: $cream-muted;
    }

    dd {
      font-weight: 700;

      @include from('sm') {
        text-align: right;
      }
    }
  }

  // Códigos de registro y de barras: en una línea y con cifras parejas
  &__code {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
