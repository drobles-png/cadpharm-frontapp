<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

/**
 * Esqueleto de la ficha: foto cuadrada a la izquierda y bloques de texto a la
 * derecha (en móvil se apilan), con las mismas proporciones que la ficha real.
 */
</script>

<template>
  <div class="detail-skeleton" aria-busy="true" aria-label="Cargando producto">
    <SkeletonBlock class="detail-skeleton__photo" height="auto" radius="18px" />
    <div class="detail-skeleton__info">
      <SkeletonBlock width="8rem" height="0.8rem" />
      <SkeletonBlock width="75%" height="3rem" />
      <SkeletonBlock width="55%" height="1.3rem" />
      <div class="detail-skeleton__lines">
        <SkeletonBlock width="100%" height="0.9rem" />
        <SkeletonBlock width="94%" height="0.9rem" />
        <SkeletonBlock width="70%" height="0.9rem" />
      </div>
      <div class="detail-skeleton__row">
        <SkeletonBlock v-for="n in 3" :key="n" width="7rem" height="2rem" radius="999px" />
      </div>
      <div class="detail-skeleton__lines">
        <SkeletonBlock width="40%" height="1.1rem" />
        <SkeletonBlock v-for="n in 4" :key="n" :width="`${96 - n * 9}%`" height="0.9rem" />
      </div>
      <div class="detail-skeleton__row">
        <SkeletonBlock width="13rem" height="3.1rem" radius="999px" />
        <SkeletonBlock width="9rem" height="3.1rem" radius="999px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Mismo layout que .detail__top de ProductDetailView para que no salte al cargar.
.detail-skeleton {
  @include flex(column, stretch, flex-start, 2rem);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
  }

  &__photo {
    aspect-ratio: 1 / 1;

    @include from('lg') {
      flex: 0 0 46%;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding-top: 0.4rem;
  }

  &__row {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
