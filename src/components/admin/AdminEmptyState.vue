<script setup lang="ts">
defineProps<{ icon: string; title: string; text?: string; compact?: boolean }>()
</script>

<template>
  <div class="empty" :class="{ 'empty--compact': compact }">
    <span class="empty__icon"><i :class="icon"></i></span>
    <p class="empty__title">{{ title }}</p>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.5rem);
  text-align: center;
  padding: $space-lg $space-md;
  animation: empty-in 0.6s $ease both;

  &__icon {
    @include flex(row, center, center);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
    animation: empty-float 4s ease-in-out infinite;
  }

  &__title {
    @include display($text-lg, 700);
  }

  &__text {
    max-width: 38ch;
    color: $ink-muted;
    font-size: $text-sm;
  }

  &--compact {
    padding: $space-md;

    .empty__icon {
      width: 48px;
      height: 48px;
      font-size: 1.1rem;
    }
  }
}

@keyframes empty-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

@keyframes empty-float {
  50% {
    transform: translateY(-5px);
  }
}
</style>
