<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { detailCopy as copy, productPhotos } from '@/config/info.copy'
import { useProductDetail } from '@/composables/useProductDetail'
import { useReveal } from '@/composables/useReveal'
import ProductInfo from '@/components/product/ProductInfo.vue'
import ProductProSheet from '@/components/product/ProductProSheet.vue'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { product, loading, notFound, related, fullName, waHref } = useProductDetail(slug)
const { rescan } = useReveal()

const photo = computed(() =>
  product.value
    ? (productPhotos[product.value.slug] ?? product.value.images[0] ?? '/img/placeholder.svg')
    : '',
)

watch([product, () => related.value.length], async () => {
  await nextTick()
  rescan()
})
</script>

<template>
  <div class="detail">
    <div class="detail__inner">
      <RouterLink to="/productos" class="detail__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>{{ copy.back }}
      </RouterLink>

      <Transition name="fade" mode="out-in">
        <ProductDetailSkeleton v-if="loading" />

        <section v-else-if="notFound || !product" class="detail__missing">
          <i class="fa-solid fa-box-open" aria-hidden="true"></i>
          <h1>{{ copy.notFoundTitle }}</h1>
          <p>{{ copy.notFoundText }}</p>
          <RouterLink to="/productos" class="btn btn--cream btn--lg">{{ copy.back }}</RouterLink>
        </section>

        <div v-else :key="product.slug" class="detail__content">
          <div class="detail__top">
            <figure class="detail__photo">
              <img
                :src="photo"
                :alt="`Caja de ${fullName}`"
                fetchpriority="high"
                width="900"
                height="1200"
              />
            </figure>
            <div class="detail__info">
              <ProductInfo :product="product" />
              <ProductProSheet :product="product" :wa-href="waHref" />
            </div>
          </div>

          <section v-if="related.length" class="detail__related">
            <h2 class="detail__related-title" data-reveal>{{ copy.related }}</h2>
            <div class="detail__grid">
              <div
                v-for="(item, i) in related"
                :key="item._id"
                class="detail__cell"
                data-reveal
                :data-reveal-delay="(i * 0.06).toFixed(2)"
              >
                <ProductCard :product="item" compact />
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding-block: 1.5rem $space-section;
  color: $cream;

  @include from('md') {
    padding-top: 2.5rem;
  }

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.5rem);
  }

  &__back {
    align-self: flex-start;
    min-height: 2.75rem;
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 700;
    color: $cream-soft;
    transition: color 0.2s ease;

    &:hover {
      color: $cream;
    }
  }

  &__content {
    @include flex(column, stretch, flex-start, $space-xl);
  }

  &__top {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  // La foto acompaña mientras se lee la ficha en desktop.
  &__photo {
    flex: 0 0 auto;
    background: $cream;
    border-radius: $radius-md;
    overflow: hidden;

    @include from('lg') {
      flex: 0 0 46%;
      align-self: flex-start;
      position: sticky;
      top: 6rem;
    }

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      // Fondo blanco de la foto → crema del recuadro
      mix-blend-mode: multiply;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 2.5rem);
  }

  &__related {
    @include flex(column, stretch, flex-start, 1.5rem);
    padding-top: $space-lg;
    border-top: 1px solid $cream-line;
  }

  &__related-title {
    @include display($display-sm, 700);
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
    @include flex(column, center, center, 1rem);
    text-align: center;
    padding: 5rem 1rem;

    > i {
      font-size: 2.5rem;
      color: $cream-soft;
    }

    p {
      color: $cream-soft;
      max-width: 40ch;
    }
  }
}
</style>
