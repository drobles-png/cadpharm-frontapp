<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { homeCopy, storyLayers } from '@/config/home.copy'
import { parseAmount } from '@/composables/useStoryScroll'
import ProductVisual from '@/components/product/ProductVisual.vue'

/** Un capítulo del storytelling: un producto, su color, sus activos y sus números. */
const props = defineProps<{ product: Product; index: number; total: number }>()
const copy = homeCopy.story

// Solo cifras reales del empaque: los primeros principios activos con su cantidad.
const stats = computed(() =>
  props.product.activeIngredients
    .map((item) => ({ name: item.name, parsed: parseAmount(item.amount), raw: item.amount }))
    .filter((item) => item.parsed)
    .slice(0, 3),
)
const layer = computed(() => storyLayers[props.product.slug])
const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <article
    class="panel"
    :style="{
      '--p': product.theme.primary,
      '--s': product.theme.secondary,
      '--i': product.theme.ink,
    }"
  >
    <div class="panel__inner">
      <div class="panel__copy">
        <p class="panel__count" data-reveal>
          <b>{{ pad(index + 1) }}</b> / {{ pad(total) }} · {{ product.categoryLabel }}
        </p>
        <h3 class="panel__name" data-reveal>
          {{ product.name }} <span>{{ product.nameAccent }}</span>
        </h3>
        <p class="panel__tagline" data-reveal>{{ product.tagline }}</p>
        <ul class="panel__chips" data-reveal>
          <li v-for="h in product.highlights" :key="h" class="panel__chip">{{ h }}</li>
        </ul>

        <div v-if="stats.length" class="panel__stats" data-reveal>
          <p class="panel__stats-label">{{ copy.statsLabel }}</p>
          <dl class="panel__stats-row">
            <div v-for="stat in stats" :key="stat.name" class="panel__stat">
              <dt class="visually-hidden">{{ stat.name }}</dt>
              <dd class="panel__stat-value" :aria-label="stat.raw">
                <span
                  aria-hidden="true"
                  :data-count="stat.parsed!.value"
                  :data-decimals="stat.parsed!.decimals"
                  >{{ stat.parsed!.value.toFixed(stat.parsed!.decimals) }}</span
                ><small aria-hidden="true">{{ stat.parsed!.unit }}</small>
              </dd>
              <dd class="panel__stat-name" aria-hidden="true">{{ stat.name }}</dd>
            </div>
          </dl>
        </div>

        <RouterLink
          :to="`/productos/${product.slug}`"
          class="btn btn--light panel__cta"
          data-reveal
        >
          {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>

      <div class="panel__art" aria-hidden="true">
        <span class="panel__ring"></span>
        <img v-if="layer" :src="layer" alt="" class="panel__layer" loading="lazy" />
        <div class="panel__visual">
          <ProductVisual :product="product" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.panel {
  position: relative;
  color: $surface;
  // Velo oscuro sobre el color del producto: el texto blanco gana contraste en los tonos claros.
  background: linear-gradient(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.16)), var(--p);
  padding-block: 4.5rem;
  overflow: hidden;

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, center, 2.5rem);
    height: 100%;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__copy {
    position: relative;
    z-index: 2;
    @include flex(column, flex-start, flex-start, 1.1rem);

    @include from('lg') {
      flex: 1 1 50%;
    }
  }

  &__count {
    font-size: $text-sm;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);

    b {
      color: $surface;
    }
  }

  &__name {
    font-size: clamp(2.6rem, 1.6rem + 5vw, 5.5rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.92;

    span {
      display: block;
      color: var(--s);
    }
  }

  &__tagline {
    font-size: $text-lg;
    color: rgba(255, 255, 255, 0.86);
    max-width: 30rem;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    list-style: none;
  }

  &__chip {
    font-size: $text-sm;
    font-weight: 700;
    padding: 0.4rem 0.85rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(6px);
  }

  &__stats-label {
    @include eyebrow;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 0.5rem;
  }

  &__stats-row {
    @include flex(row, flex-start, flex-start, 1.6rem);
    flex-wrap: wrap;
  }

  &__stat-value {
    font-family: $font-display;
    font-size: clamp(1.9rem, 1.4rem + 2vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;

    small {
      font-size: 0.45em;
      margin-left: 0.15em;
      letter-spacing: 0;
      opacity: 0.8;
    }
  }

  &__stat-name {
    font-size: $text-xs;
    color: rgba(255, 255, 255, 0.75);
    max-width: 11ch;
    margin-top: 0.3rem;
  }

  &__cta {
    margin-top: 0.4rem;
  }

  &__art {
    position: relative;
    height: 22rem;
    @include flex(row, center, center);

    @include from('lg') {
      flex: 1 1 50%;
      height: 70vh;
    }
  }

  &__ring {
    position: absolute;
    width: min(26rem, 85%);
    aspect-ratio: 1;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      0 0 0 2.5rem rgba(255, 255, 255, 0.05),
      0 0 0 5rem rgba(255, 255, 255, 0.03);
  }

  &__layer {
    position: absolute;
    width: 28%;
    max-width: 10rem;
    right: 6%;
    top: 4%;
    filter: blur(1px) drop-shadow(0 20px 20px rgba(0, 0, 0, 0.3));
  }

  &__visual {
    position: relative;
    width: 70%;
    height: 80%;
    max-width: 24rem;
  }
}

// En modo fijado el color lo pinta el escenario y los paneles se apilan.
// Solo el último selector lleva el scope: el ancestro (de HomeStory) puede ir tal cual.
.story--pinned .panel {
  position: absolute;
  inset: 0;
  background: transparent;
  padding-block: 5rem 3rem;
  @include flex(column, stretch, center);
}
</style>
