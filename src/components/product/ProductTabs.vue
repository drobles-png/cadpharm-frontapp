<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Product } from '@/types'
import { productCopy as copy } from '@/config/pages.copy'
import ProductNutrition from './ProductNutrition.vue'

const props = defineProps<{ product: Product }>()

type TabKey = keyof typeof copy.tabs
const tabs = computed(() =>
  (Object.keys(copy.tabs) as TabKey[]).filter((key) => {
    if (key === 'nutrition') return props.product.nutrition?.rows.length > 0
    if (key === 'warnings') return props.product.warnings.length > 0
    if (key === 'dosage') return props.product.dosage.length > 0
    return true
  }),
)
const active = ref<TabKey>('benefits')
const list = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0 })

// El indicador se mide contra el botón activo: funciona con cualquier largo de texto.
function measure() {
  const btn = list.value?.querySelector<HTMLElement>('[aria-selected="true"]')
  if (!btn) return
  indicator.value = { left: btn.offsetLeft, width: btn.offsetWidth }
  // Solo desplazamiento horizontal de la lista (scrollIntoView movería la página).
  list.value?.scrollTo({ left: btn.offsetLeft - 24, behavior: 'smooth' })
}

function select(key: TabKey) {
  active.value = key
}

function onKey(event: KeyboardEvent) {
  const i = tabs.value.indexOf(active.value)
  const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!delta) return
  const next = tabs.value[(i + delta + tabs.value.length) % tabs.value.length]
  if (!next) return
  active.value = next
  nextTick(() => list.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus())
}

watch(active, () => nextTick(measure))
watch(
  () => props.product.slug,
  () => (active.value = 'benefits'),
)
onMounted(() => {
  measure()
  document.fonts?.ready.then(measure)
})
</script>

<template>
  <section class="tabs" :style="{ '--p': product.theme.primary }">
    <div ref="list" class="tabs__list" role="tablist" @keydown="onKey">
      <button
        v-for="key in tabs"
        :id="`tab-${key}`"
        :key="key"
        type="button"
        role="tab"
        class="tabs__tab"
        :class="{ 'tabs__tab--active': active === key }"
        :aria-selected="active === key"
        :aria-controls="`panel-${key}`"
        :tabindex="active === key ? 0 : -1"
        @click="select(key)"
      >
        {{ copy.tabs[key] }}
      </button>
      <span
        class="tabs__indicator"
        :style="{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }"
        aria-hidden="true"
      ></span>
    </div>

    <Transition name="rise" mode="out-in">
      <div
        :id="`panel-${active}`"
        :key="active"
        class="tabs__panel"
        role="tabpanel"
        :aria-labelledby="`tab-${active}`"
      >
        <ul v-if="active === 'benefits'" class="tabs__checks">
          <li v-for="b in product.benefits" :key="b">
            <i class="fa-solid fa-check" aria-hidden="true"></i>{{ b }}
          </li>
        </ul>

        <div v-else-if="active === 'ingredients'" class="tabs__stack">
          <h3 class="tabs__subtitle">{{ copy.activeTitle }}</h3>
          <ul class="tabs__actives">
            <li v-for="a in product.activeIngredients" :key="a.name">
              <strong>{{ a.amount }}</strong
              ><span>{{ a.name }}</span>
            </li>
          </ul>
          <h3 class="tabs__subtitle">{{ copy.fullIngredients }}</h3>
          <p class="tabs__text">{{ product.ingredients }}</p>
        </div>

        <div v-else-if="active === 'dosage'" class="tabs__stack">
          <ul class="tabs__dosage">
            <li v-for="d in product.dosage" :key="d.who">
              <span>{{ d.who }}</span
              ><strong>{{ d.dose }}</strong>
            </li>
          </ul>
          <p v-if="product.storage" class="tabs__text">
            <strong>{{ copy.storage }}:</strong> {{ product.storage }}
          </p>
        </div>

        <ProductNutrition v-else-if="active === 'nutrition'" :nutrition="product.nutrition" />

        <ul v-else class="tabs__warnings">
          <li v-for="w in product.warnings" :key="w">
            <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>{{ w }}
          </li>
        </ul>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss">
.tabs {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__list {
    position: relative;
    @include flex(row, center, flex-start, 0.25rem);
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid $line;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    flex-shrink: 0;
    padding: 0.9rem 1rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-muted;
    white-space: nowrap;
    transition: color 0.25s ease;
    @include focus-ring;

    &:hover,
    &--active {
      color: $ink;
    }
  }

  &__indicator {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 3px;
    border-radius: 3px;
    background: var(--p);
    transition:
      transform 0.45s $ease,
      width 0.45s $ease;
  }

  &__panel {
    min-height: 10rem;
  }

  &__stack {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__subtitle {
    @include eyebrow;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.7;
  }

  &__checks,
  &__warnings,
  &__actives,
  &__dosage {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__checks li,
  &__warnings li {
    @include flex(row, flex-start, flex-start, 0.75rem);
    font-weight: 600;

    i {
      flex-shrink: 0;
      width: 1.6rem;
      height: 1.6rem;
      margin-top: 0.05rem;
      border-radius: 50%;
      @include flex(row, center, center);
      font-size: 0.75rem;
      background: color-mix(in srgb, var(--p) 15%, #fff);
      color: var(--p);
    }
  }

  &__warnings li {
    font-weight: 500;
    color: $ink-soft;

    i {
      background: $warning-bg;
      color: $warning;
    }
  }

  &__actives {
    flex-direction: row;
    flex-wrap: wrap;

    li {
      @include flex(column, flex-start, flex-start, 0.1rem);
      flex: 1 1 9rem;
      padding: 0.9rem 1rem;
      border-radius: $radius-md;
      background: color-mix(in srgb, var(--p) 10%, #fff);
    }

    strong {
      font-family: $font-display;
      font-size: 1.5rem;
      letter-spacing: -0.03em;
      color: var(--p);
    }

    span {
      font-size: $text-sm;
      font-weight: 600;
    }
  }

  &__dosage li {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding: 1rem 1.2rem;
    border-radius: $radius-md;
    background: $surface;
    border: 1px solid $line;

    span {
      color: $ink-soft;
      font-weight: 600;
    }
  }
}
</style>
