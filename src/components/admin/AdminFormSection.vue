<script setup lang="ts">
defineProps<{ id: string; title: string; icon: string; hint?: string }>()
</script>

<template>
  <section :id="id" class="fsec" :data-section="id">
    <header class="fsec__head">
      <span class="fsec__icon"><i :class="icon"></i></span>
      <div>
        <h2 class="fsec__title">{{ title }}</h2>
        <p v-if="hint" class="fsec__hint">{{ hint }}</p>
      </div>
    </header>
    <div class="fsec__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.fsec {
  @include card;
  padding: 1.25rem;
  scroll-margin-top: 5rem;

  @include from('md') {
    padding: 1.6rem;
  }

  &__head {
    @include flex(row, center, flex-start, 0.8rem);
    margin-bottom: 1.2rem;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: $accent-soft;
    color: $accent-deep;
  }

  &__title {
    @include display($text-lg, 700);
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__body {
    @include flex(row, flex-start, flex-start, 1.1rem);
    flex-wrap: wrap;
  }
}
</style>
