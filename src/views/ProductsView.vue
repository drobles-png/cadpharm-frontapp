<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { site } from '@/config/site'
import { catalogCopy as copy } from '@/config/info.copy'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import { prefersReducedMotion } from '@/composables/useGsap'
import BannerCarousel from '@/components/product/BannerCarousel.vue'
import CategoryChips from '@/components/product/CategoryChips.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

gsap.registerPlugin(Flip)

const route = useRoute()
const router = useRouter()
const { products, loading, error, load } = useCatalog()
const { rescan } = useReveal()
const grid = ref<HTMLElement | null>(null)

const validKeys = site.categories.map((c) => c.key as string)
const readQuery = () => {
  const value = String(route.query.categoria ?? '')
  return validKeys.includes(value) ? value : ''
}
const category = ref(readQuery())

const counts = computed(() => {
  const map: Record<string, number> = { '': products.value.length }
  products.value.forEach((p) => (map[p.category] = (map[p.category] ?? 0) + 1))
  return map
})
const visibleCount = computed(() => counts.value[category.value] ?? 0)
const isVisible = (key: string) => !category.value || key === category.value

// La URL manda: los chips escriben en ?categoria= y el filtro la lee.
function setCategory(key: string) {
  router.replace({ query: key ? { categoria: key } : {} })
}

watch(
  () => route.query.categoria,
  async () => {
    const next = readQuery()
    if (next === category.value) return
    const cells = grid.value?.querySelectorAll('.catalog__cell')
    const animate = !!cells?.length && !prefersReducedMotion()
    const state = animate ? Flip.getState(cells!) : null
    category.value = next
    await nextTick()
    if (!state) return
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      scale: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35 }),
    })
  },
)

onMounted(async () => {
  await load()
  await nextTick()
  rescan()
})
</script>

<template>
  <div class="catalog">
    <BannerCarousel />

    <section class="catalog__head">
      <div class="catalog__intro">
        <span class="eyebrow-cream">{{ copy.eyebrow }}</span>
        <h1 class="catalog__title">{{ copy.title }}</h1>
      </div>
      <p class="catalog__text">{{ copy.text }}</p>
    </section>

    <section class="catalog__body" aria-labelledby="catalog-list" aria-live="polite">
      <h2 id="catalog-list" class="visually-hidden">{{ copy.listTitle }}</h2>
      <CategoryChips
        class="catalog__chips"
        :model-value="category"
        :counts="counts"
        @update:model-value="setCategory"
      />

      <div v-if="loading" class="catalog__grid">
        <ProductCardSkeleton v-for="n in 4" :key="n" />
      </div>

      <div v-else-if="error" class="catalog__empty">
        <i class="fa-solid fa-plug-circle-exclamation" aria-hidden="true"></i>
        <h2>{{ copy.errorTitle }}</h2>
        <p>{{ error }}</p>
        <button type="button" class="btn btn--cream" @click="load(true)">{{ copy.errorCta }}</button>
      </div>

      <template v-else>
        <div ref="grid" class="catalog__grid">
          <div
            v-for="product in products"
            v-show="isVisible(product.category)"
            :key="product._id"
            class="catalog__cell"
            :data-flip-id="product._id"
          >
            <ProductCard :product="product" eager />
          </div>
        </div>

        <Transition name="rise">
          <div v-if="!visibleCount" class="catalog__empty">
            <i class="fa-solid fa-seedling" aria-hidden="true"></i>
            <h2>{{ copy.emptyTitle }}</h2>
            <p>{{ copy.emptyText }}</p>
            <button type="button" class="btn btn--cream" @click="setCategory('')">
              {{ copy.emptyCta }}
            </button>
          </div>
        </Transition>

        <p class="catalog__note">{{ copy.note }}</p>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  overflow-x: clip;
  padding-bottom: $space-section;

  &__head {
    @include container(1280px);
    @include flex(column, flex-start, flex-start, 1rem);
    padding-block: 3.5rem 2rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 3rem;
      padding-top: 5rem;
    }
  }

  &__intro {
    @include flex(column, flex-start, flex-start, 0.85rem);
  }

  &__title {
    @include display($display-md, 700);
    color: $cream;
  }

  &__text {
    max-width: 30rem;
    color: $cream-soft;
  }

  &__body {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.75rem);
  }

  &__grid {
    position: relative;
    @include flex-cards(100%, 1.25rem);

    > * {
      @include from('sm') {
        flex: 0 0 calc(50% - 0.625rem);
      }

      @include from('lg') {
        flex: 0 0 calc(25% - 0.9375rem);
      }
    }
  }

  &__cell {
    display: flex;

    > * {
      flex: 1;
    }
  }

  &__empty {
    @include flex(column, center, center, 0.8rem);
    text-align: center;
    padding: 4rem 1.5rem;
    border-radius: $radius-md;
    border: 1px dashed $cream-line;

    > i {
      font-size: 2rem;
      color: $cream-soft;
    }

    h2 {
      font-size: $text-xl;
      font-weight: 800;
    }

    p {
      color: $cream-soft;
      max-width: 40ch;
    }
  }

  &__note {
    padding-top: 1.25rem;
    border-top: 1px solid $cream-line;
    font-size: $text-sm;
    color: $cream-muted;
    max-width: 70ch;
  }
}
</style>
