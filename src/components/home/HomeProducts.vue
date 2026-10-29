<script setup lang="ts">
import type { Product } from '@/types'
import { homeCopy } from '@/config/home.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'

defineProps<{ products: Product[]; loading: boolean }>()
const copy = homeCopy.products
</script>

<template>
  <section id="productos" class="products">
    <div class="products__head">
      <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" />
      <RouterLink to="/productos" class="products__all" data-reveal data-reveal-delay="0.2">
        {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <div class="products__grid">
      <template v-if="loading">
        <ProductCardSkeleton v-for="n in 4" :key="n" />
      </template>
      <template v-else>
        <div
          v-for="(product, i) in products"
          :key="product._id"
          class="products__cell"
          data-reveal
          :data-reveal-delay="(i * 0.08).toFixed(2)"
        >
          <ProductCard :product="product" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.products {
  @include container(1280px);
  padding-block: $space-section $space-xl;

  &__head {
    @include flex(column, flex-start, space-between, 1.5rem);
    margin-bottom: $space-lg;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__all {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 700;
    color: $accent-deep;
    white-space: nowrap;
    padding: 0.7rem 1.2rem;
    border-radius: $radius-pill;
    border: 1.5px solid rgba($accent, 0.35);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;

    &:hover {
      background: $accent;
      color: $surface;
    }
  }

  // 1 columna en móvil, 2 en tablet, 4 en desktop: nunca una tarjeta huérfana estirada.
  &__grid {
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
}
</style>
