<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { productCopy as copy } from '@/config/pages.copy'
import { useProductDetail } from '@/composables/useProductDetail'
import { useReveal } from '@/composables/useReveal'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductBuyBox from '@/components/product/ProductBuyBox.vue'
import ProductTabs from '@/components/product/ProductTabs.vue'
import ProductProSheet from '@/components/product/ProductProSheet.vue'
import ProductMobileBar from '@/components/product/ProductMobileBar.vue'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { product, loading, notFound, quantity, related, waHref, addToCart, buyNow } =
  useProductDetail(slug)
const { rescan } = useReveal()

// La barra móvil aparece cuando la caja de compra sale de pantalla.
const buyRef = ref<HTMLElement | null>(null)
const buyVisible = ref(true)
let observer: IntersectionObserver | null = null

watch(buyRef, (el) => {
  observer?.disconnect()
  if (!el) return
  observer = new IntersectionObserver(([entry]) => (buyVisible.value = !!entry?.isIntersecting), {
    rootMargin: '0px 0px -10% 0px',
  })
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())

watch([product, () => related.value.length], async () => {
  await nextTick()
  rescan()
})
</script>

<template>
  <div class="detail">
    <div class="detail__inner">
      <Transition name="fade" mode="out-in">
        <ProductDetailSkeleton v-if="loading" />

        <section v-else-if="notFound || !product" class="detail__missing">
          <i class="fa-solid fa-box-open" aria-hidden="true"></i>
          <h1>{{ copy.notFoundTitle }}</h1>
          <p>{{ copy.notFoundText }}</p>
          <RouterLink to="/productos" class="btn btn--primary btn--lg">{{ copy.back }}</RouterLink>
        </section>

        <div v-else :key="product.slug" class="detail__content">
          <div class="detail__top">
            <ProductGallery :product="product" class="detail__gallery" />
            <div ref="buyRef" class="detail__buy">
              <ProductBuyBox
                v-model:quantity="quantity"
                :product="product"
                :wa-href="waHref"
                @add="addToCart"
                @buy="buyNow"
              />
            </div>
          </div>

          <div class="detail__info">
            <ProductTabs :product="product" class="detail__tabs" />
            <ProductProSheet :product="product" class="detail__sheet" />
          </div>

          <section v-if="related.length" class="detail__related">
            <h2 class="detail__related-title" data-reveal>{{ copy.related }}</h2>
            <div class="detail__grid">
              <div
                v-for="(item, i) in related"
                :key="item._id"
                class="detail__cell"
                data-reveal
                :data-reveal-delay="(i * 0.08).toFixed(2)"
              >
                <ProductCard :product="item" />
              </div>
            </div>
          </section>

          <ProductMobileBar
            :product="product"
            :visible="!buyVisible"
            :wa-href="waHref"
            @add="addToCart"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding-block: 2rem $space-section;

  @include from('md') {
    padding-top: 3rem;
  }

  &__inner {
    @include container(1280px);
  }

  &__content {
    @include flex(column, stretch, flex-start, $space-xl);
  }

  &__top {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__gallery {
    @include from('lg') {
      flex: 1 1 52%;
    }
  }

  &__buy {
    @include from('lg') {
      flex: 1 1 48%;
      position: sticky;
      top: 5.5rem;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__tabs {
    min-width: 0;

    @include from('lg') {
      flex: 1 1 58%;
    }
  }

  &__sheet {
    @include from('lg') {
      flex: 1 1 42%;
    }
  }

  &__related-title {
    font-size: $display-sm;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 1.5rem;
  }

  &__grid {
    @include flex-cards(100%, 1.25rem);

    > * {
      @include from('sm') {
        flex: 0 0 calc(50% - 0.625rem);
      }

      @include from('lg') {
        flex: 0 0 calc(33.333% - 0.834rem);
      }
    }
  }

  &__cell {
    display: flex;

    > * {
      flex: 1;
    }
  }

  &__missing {
    @include flex(column, center, center, 0.9rem);
    text-align: center;
    padding-block: 5rem;

    > i {
      font-size: 3rem;
      color: $accent;
    }

    h1 {
      font-size: $display-md;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    p {
      color: $ink-soft;
      max-width: 42ch;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
