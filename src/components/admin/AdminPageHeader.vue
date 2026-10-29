<script setup lang="ts">
defineProps<{ title: string; subtitle?: string; backTo?: string; backLabel?: string }>()
</script>

<template>
  <header class="page-head">
    <RouterLink v-if="backTo" :to="backTo" class="page-head__back">
      <i class="fa-solid fa-arrow-left"></i> {{ backLabel }}
    </RouterLink>
    <div class="page-head__row">
      <div class="page-head__text">
        <h1 class="page-head__title"><slot name="title">{{ title }}</slot></h1>
        <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="page-head__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(column, stretch, flex-start, 0.6rem);
  margin-bottom: $space-md;

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    align-self: flex-start;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    transition: color 0.2s ease, transform 0.25s $ease;

    &:hover {
      color: $accent-deep;
      transform: translateX(-3px);
    }
  }

  &__row {
    @include flex(column, flex-start, space-between, 1rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__title {
    @include display($display-sm, 700);
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
  }

  &__subtitle {
    margin-top: 0.35rem;
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
