<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

/** Esqueleto con la misma forma y alto que ProductCard: cero saltos al cargar. */
</script>

<template>
  <div class="card-skeleton" aria-hidden="true">
    <SkeletonBlock class="card-skeleton__stage" height="auto" radius="0" />
    <div class="card-skeleton__body">
      <SkeletonBlock width="40%" height="0.7rem" />
      <SkeletonBlock width="70%" height="1.5rem" />
      <SkeletonBlock width="90%" height="0.85rem" />
      <SkeletonBlock width="6rem" height="0.85rem" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-skeleton {
  @include flex(column, stretch, flex-start);
  background: $forest-raised;
  border: 1px solid $cream-line;
  border-radius: $radius-md;
  opacity: 0.6;

  &__stage {
    aspect-ratio: 1 / 1;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.65rem);
    padding: 1.1rem 1.25rem 1.3rem;
  }
}
</style>
