<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { site } from '@/config/site'
import { homeCopy } from '@/config/home.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'

const props = defineProps<{ products: Product[] }>()
const copy = homeCopy.needs

// Cada necesidad toma el color del producto que la resuelve (si ya llegó el catálogo).
const needs = computed(() =>
  site.categories.map((cat) => {
    const items = props.products.filter((p) => p.category === cat.key)
    return {
      ...cat,
      color: items[0]?.theme.primary ?? '#17a34a',
      names: items.map((p) => `${p.name} ${p.nameAccent}`.trim()).join(' · '),
    }
  }),
)
</script>

<template>
  <section class="needs">
    <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" />
    <div class="needs__grid">
      <RouterLink
        v-for="(need, i) in needs"
        :key="need.key"
        :to="{ path: '/productos', query: { categoria: need.key } }"
        class="need"
        :style="{ '--c': need.color }"
        data-reveal
        :data-reveal-delay="(i * 0.08).toFixed(2)"
      >
        <span class="need__icon"><i :class="need.icon" aria-hidden="true"></i></span>
        <span class="need__body">
          <span class="need__title">{{ need.label }}</span>
          <span class="need__text">{{ need.description }}</span>
          <span v-if="need.names" class="need__names">{{ need.names }}</span>
        </span>
        <span class="need__cta">
          {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.needs {
  @include container(1280px);
  padding-block: $space-section;
  @include flex(column, stretch, flex-start, $space-lg);

  &__grid {
    @include flex-cards(100%, 1rem);

    > * {
      @include from('sm') {
        flex: 0 0 calc(50% - 0.5rem);
      }

      @include from('lg') {
        flex: 0 0 calc(25% - 0.75rem);
      }
    }
  }
}

.need {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include flex(column, flex-start, flex-start, 1.4rem);
  min-height: 19rem;
  padding: 1.6rem;
  border-radius: $radius-lg;
  background: $surface;
  border: 1px solid $line;
  color: $ink;
  // Incluye opacity: esta transición pisa la de [data-reveal] global.
  transition:
    opacity 0.8s $ease var(--reveal-delay, 0s),
    color 0.45s $ease,
    transform 0.6s $ease,
    border-color 0.45s ease;
  @include focus-ring;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 150%;
    aspect-ratio: 1;
    left: -25%;
    top: 100%;
    border-radius: 50%;
    background: var(--c);
    transition: transform 0.7s $ease;
  }

  &:hover {
    color: $surface;
    transform: translateY(-6px);
    border-color: transparent;

    &::before {
      transform: translateY(-75%);
    }
  }

  &__icon {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: $radius-md;
    @include flex(row, center, center);
    font-size: 2rem;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 12%, #fff);
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__icon {
    transform: rotate(-10deg) scale(1.08);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.4rem);
  }

  &__title {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  &__text {
    font-size: $text-sm;
    opacity: 0.8;
  }

  &__names {
    font-size: $text-xs;
    font-weight: 700;
    opacity: 0.7;
  }

  &__cta {
    margin-top: auto;
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 700;
    font-size: $text-sm;

    i {
      transition: transform 0.35s $ease;
    }
  }

  &:hover &__cta i {
    transform: translateX(6px);
  }
}
</style>
