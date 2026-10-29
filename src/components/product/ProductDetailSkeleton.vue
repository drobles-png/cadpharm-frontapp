<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

/** Esqueleto de la ficha completa: galería, columna de compra y pestañas. */
</script>

<template>
  <div class="detail-skeleton" aria-busy="true" aria-label="Cargando producto">
    <div class="detail-skeleton__top">
      <div class="detail-skeleton__gallery">
        <SkeletonBlock class="detail-skeleton__main" height="auto" radius="28px" />
        <div class="detail-skeleton__thumbs">
          <SkeletonBlock v-for="n in 5" :key="n" width="4.4rem" height="4.4rem" />
        </div>
      </div>
      <div class="detail-skeleton__buy">
        <SkeletonBlock width="9rem" height="0.9rem" />
        <SkeletonBlock width="7rem" height="1.6rem" radius="999px" />
        <SkeletonBlock width="80%" height="3.4rem" />
        <SkeletonBlock width="65%" height="1.4rem" />
        <SkeletonBlock width="100%" height="0.9rem" />
        <SkeletonBlock width="90%" height="0.9rem" />
        <div class="detail-skeleton__row">
          <SkeletonBlock v-for="n in 3" :key="n" width="8rem" height="2rem" radius="999px" />
        </div>
        <SkeletonBlock height="15rem" radius="28px" />
      </div>
    </div>
    <div class="detail-skeleton__tabs">
      <div class="detail-skeleton__row">
        <SkeletonBlock v-for="n in 4" :key="n" width="7rem" height="1.2rem" />
      </div>
      <SkeletonBlock v-for="n in 4" :key="`l${n}`" :width="`${90 - n * 10}%`" height="1rem" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-skeleton {
  @include flex(column, stretch, flex-start, 3rem);

  &__top {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      gap: 3.5rem;
    }
  }

  &__gallery {
    @include flex(column, stretch, flex-start, 0.8rem);

    @include from('lg') {
      flex: 1 1 52%;
    }
  }

  &__main {
    aspect-ratio: 1 / 1.05;
  }

  &__thumbs,
  &__row {
    @include flex(row, center, flex-start, 0.55rem);
    overflow: hidden;
  }

  &__buy {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('lg') {
      flex: 1 1 48%;
    }
  }

  &__tabs {
    @include flex(column, stretch, flex-start, 1rem);
  }
}
</style>
