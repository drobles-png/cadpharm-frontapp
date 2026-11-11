<script setup lang="ts">
import type { Product } from '@/types'
import { detailCopy as copy } from '@/config/info.copy'

/**
 * Ficha informativa del producto, pensada para que un médico la lea de un
 * vistazo: presentación y registro arriba, composición con cantidades, para
 * qué sirve, modo de uso y advertencias.
 */
defineProps<{ product: Product }>()
</script>

<template>
  <div class="info">
    <header class="info__head">
      <h1 class="info__title">
        {{ product.name }} <span>{{ product.nameAccent }}</span>
      </h1>
      <p class="info__tagline">{{ product.tagline }}</p>
    </header>

    <dl class="info__facts">
      <div>
        <dt>{{ copy.presentation }}</dt>
        <dd>{{ product.presentation }}</dd>
      </div>
      <div v-if="product.sanitaryRegistry">
        <dt>{{ copy.registry }}</dt>
        <dd class="info__code">{{ product.sanitaryRegistry }}</dd>
      </div>
      <div>
        <dt>{{ copy.category }}</dt>
        <dd>{{ product.categoryLabel }}</dd>
      </div>
      <div v-if="product.audience">
        <dt>{{ copy.audience }}</dt>
        <dd>{{ product.audience }}</dd>
      </div>
    </dl>

    <section v-if="product.activeIngredients.length" class="info__block">
      <h2>{{ copy.composition }}</h2>
      <ul class="info__rows">
        <li v-for="item in product.activeIngredients" :key="item.name">
          <span>{{ item.name }}</span><strong>{{ item.amount }}</strong>
        </li>
      </ul>
      <details v-if="product.ingredients" class="info__more">
        <summary>{{ copy.ingredients }}</summary>
        <p>{{ product.ingredients }}</p>
      </details>
    </section>

    <section class="info__block">
      <h2>{{ copy.indications }}</h2>
      <p>{{ product.description }}</p>
      <ul v-if="product.benefits.length" class="info__checks">
        <li v-for="b in product.benefits" :key="b">
          <i class="fa-solid fa-check" aria-hidden="true"></i>{{ b }}
        </li>
      </ul>
    </section>

    <section v-if="product.dosage.length" class="info__block">
      <h2>{{ copy.dosage }}</h2>
      <ul class="info__rows">
        <li v-for="d in product.dosage" :key="d.who">
          <span>{{ d.who }}</span><strong>{{ d.dose }}</strong>
        </li>
      </ul>
    </section>

    <section v-if="product.warnings.length || product.storage" class="info__block">
      <h2>{{ copy.warnings }}</h2>
      <ul class="info__list">
        <li v-for="w in product.warnings" :key="w">{{ w }}</li>
        <li v-if="product.storage">
          <strong>{{ copy.storage }}:</strong> {{ product.storage }}
        </li>
      </ul>
    </section>

  </div>
</template>

<style scoped lang="scss">
.info {
  @include flex(column, stretch, flex-start, 1.75rem);
  color: $cream;

  &__head {
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__title {
    @include display($display-md, 800);

    span {
      font-weight: 600;
      color: $cream-soft;
    }
  }

  &__tagline {
    font-size: $text-lg;
    color: $cream-soft;
  }

  &__facts {
    @include flex(row, stretch, flex-start, 0);
    flex-wrap: wrap;
    border-block: 1px solid $cream-line;

    > div {
      flex: 1 1 9rem;
      padding: 0.9rem 1rem 0.9rem 0;
    }

    dt {
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: $cream-muted;
    }

    dd {
      font-weight: 700;
      margin-top: 0.2rem;
    }
  }

  // Un código de registro partido en dos líneas ya no se puede copiar ni leer.
  &__code {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__block {
    @include flex(column, stretch, flex-start, 0.75rem);

    h2 {
      font-size: $text-xs;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: $cream-soft;
    }

    > p {
      color: $cream-soft;
      line-height: 1.7;
    }
  }

  &__rows {
    list-style: none;

    li {
      @include flex(row, baseline, space-between, 1rem);
      padding-block: 0.6rem;
      border-bottom: 1px solid $cream-line;
      font-size: $text-sm;

      span {
        color: $cream-soft;
      }

      strong {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
    }
  }

  &__checks {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);
    font-size: $text-sm;

    li {
      @include flex(row, baseline, flex-start, 0.6rem);
    }

    i {
      font-size: 0.75em;
      color: $cream-soft;
    }
  }

  &__list {
    padding-left: 1.1rem;
    text-wrap: pretty;
    @include flex(column, stretch, flex-start, 0.35rem);
    font-size: $text-sm;
    color: $cream-soft;
  }

  &__more {
    font-size: $text-sm;

    summary {
      cursor: pointer;
      min-height: 2.75rem;
      @include flex(row, center, flex-start);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 0.3em;
      text-decoration-color: $cream-line;
    }

    p {
      color: $cream-soft;
      line-height: 1.7;
    }
  }
}
</style>
