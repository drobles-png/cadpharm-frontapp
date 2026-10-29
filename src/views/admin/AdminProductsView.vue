<script setup lang="ts">
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminProductCard from '@/components/admin/AdminProductCard.vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminProducts } from '@/composables/useAdminProducts'
import { productsCopy as copy } from '@/config/admin.copy'

const { products, loading, toggle } = useAdminProducts()
</script>

<template>
  <div class="products">
    <AdminPageHeader :title="copy.title" :subtitle="copy.subtitle">
      <template #actions>
        <RouterLink to="/admin/productos/nuevo" class="btn btn--primary">
          <i class="fa-solid fa-plus"></i> {{ copy.add }}
        </RouterLink>
      </template>
    </AdminPageHeader>

    <div v-if="loading" class="products__grid">
      <div v-for="n in 4" :key="n" class="products__skeleton">
        <SkeletonBlock height="190px" radius="0" />
        <div class="products__skeleton-body">
          <SkeletonBlock width="65%" height="1.3rem" />
          <SkeletonBlock width="40%" height="0.7rem" />
          <SkeletonBlock width="50%" height="1rem" />
          <SkeletonBlock height="2.4rem" radius="99px" />
        </div>
      </div>
    </div>

    <TransitionGroup v-else-if="products.length" tag="div" name="cards" class="products__grid" appear>
      <AdminProductCard
        v-for="(p, i) in products"
        :key="p._id"
        :product="p"
        :style="{ '--i': i }"
        @toggle="(field) => toggle(p, field)"
      />
    </TransitionGroup>

    <div v-else class="products__empty">
      <AdminEmptyState icon="fa-solid fa-capsules" :title="copy.emptyTitle" :text="copy.emptyText">
        <RouterLink to="/admin/productos/nuevo" class="btn btn--primary">
          <i class="fa-solid fa-plus"></i> {{ copy.add }}
        </RouterLink>
      </AdminEmptyState>
    </div>
  </div>
</template>

<style scoped lang="scss">
.products {
  &__grid {
    @include flex-cards(250px, 1.1rem);

    // Que la última fila no estire una tarjeta sola a todo el ancho.
    > * {
      max-width: 100%;

      @include from('md') {
        max-width: calc(50% - 0.55rem);
      }

      @include from('xl') {
        max-width: calc(25% - 0.83rem);
      }
    }
  }

  &__skeleton {
    @include card;
    overflow: hidden;
  }

  &__skeleton-body {
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 1rem 1.1rem 1.1rem;
  }

  &__empty {
    @include card;
  }
}

.cards-enter-active {
  transition:
    opacity 0.5s $ease,
    transform 0.5s $ease;
  transition-delay: calc(var(--i, 0) * 0.07s);
}

.cards-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
