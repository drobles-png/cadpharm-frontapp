<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { site, whatsappLink } from '@/config/site'
import { productsCopy as copy } from '@/config/pages.copy'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import { prefersReducedMotion } from '@/composables/useGsap'
import SectionHeading from '@/components/common/SectionHeading.vue'
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
    <section class="catalog__hero">
      <span class="catalog__blob" aria-hidden="true"></span>
      <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" as="h1" />
      <CategoryChips :model-value="category" :counts="counts" @update:model-value="setCategory" />
    </section>

    <section class="catalog__body" aria-live="polite">
      <div v-if="loading" class="catalog__grid">
        <ProductCardSkeleton v-for="n in 4" :key="n" />
      </div>

      <div v-else-if="error" class="catalog__empty">
        <i class="fa-solid fa-plug-circle-exclamation" aria-hidden="true"></i>
        <h2>{{ copy.errorTitle }}</h2>
        <p>{{ error }}</p>
        <button type="button" class="btn btn--dark" @click="load(true)">{{ copy.errorCta }}</button>
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
            <div class="catalog__empty-actions">
              <button type="button" class="btn btn--dark" @click="setCategory('')">
                {{ copy.emptyCta }}
              </button>
              <a :href="whatsappLink()" class="btn btn--ghost" target="_blank" rel="noopener">
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp
              </a>
            </div>
          </div>
        </Transition>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  overflow-x: clip;

  &__hero {
    position: relative;
    isolation: isolate;
    @include container(1280px);
    @include flex(column, stretch, flex-start, 2rem);
    padding-block: 3rem 2rem;

    @include from('md') {
      padding-top: 4.5rem;
    }
  }

  &__blob {
    position: absolute;
    z-index: -1;
    width: 26rem;
    height: 26rem;
    right: -6rem;
    top: -8rem;
    border-radius: 50%;
    background: rgba($lime, 0.45);
    filter: blur(70px);
    animation: blob 14s ease-in-out infinite alternate;
  }

  &__body {
    @include container(1280px);
    padding-bottom: $space-section;
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
    border-radius: $radius-lg;
    background: $surface;
    border: 1px dashed $line;

    > i {
      font-size: 2.5rem;
      color: $accent;
    }

    h2 {
      font-size: $text-xl;
      font-weight: 800;
    }

    p {
      color: $ink-soft;
      max-width: 40ch;
    }
  }

  &__empty-actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
}

@keyframes blob {
  to {
    transform: translate(-6rem, 4rem) scale(1.2);
  }
}
</style>
