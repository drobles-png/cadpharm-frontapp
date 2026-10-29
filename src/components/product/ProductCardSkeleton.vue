<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

/** Esqueleto con la misma forma y alto que ProductCard: cero saltos al cargar. */
</script>

<template>
  <div class="card-skeleton" aria-hidden="true">
    <SkeletonBlock class="card-skeleton__stage" height="15.5rem" radius="28px 28px 18px 18px" />
    <div class="card-skeleton__body">
      <SkeletonBlock width="70%" height="1.5rem" />
      <SkeletonBlock width="90%" height="0.85rem" />
      <SkeletonBlock width="45%" height="0.75rem" />
      <div class="card-skeleton__foot">
        <SkeletonBlock width="5rem" height="1.6rem" />
        <SkeletonBlock width="7rem" height="2.6rem" radius="999px" />
      </div>
      <SkeletonBlock width="6rem" height="0.85rem" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-skeleton {
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;

  &__stage {
    margin: 0.5rem 0.5rem 0;
    width: auto !important;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.65rem);
    padding: 1.1rem 1.25rem 1.3rem;
  }

  &__foot {
    @include flex(row, center, space-between, 0.75rem);
    padding-top: 0.6rem;
  }
}
</style>
