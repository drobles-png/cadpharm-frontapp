<script setup lang="ts">
import { dashboardCopy as copy } from '@/config/admin.copy'
</script>

<template>
  <section class="quick">
    <h2 class="quick__title">{{ copy.actionsTitle }}</h2>
    <ul class="quick__list">
      <li v-for="a in copy.actions" :key="a.to">
        <RouterLink :to="a.to" class="quick__item">
          <span class="quick__icon"><i :class="a.icon"></i></span>
          <span class="quick__text">
            <strong>{{ a.label }}</strong>
            <small>{{ a.text }}</small>
          </span>
          <i class="fa-solid fa-chevron-right quick__arrow"></i>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.quick {
  @include card;
  @include flex(column, stretch, flex-start, 0.6rem);
  padding: 1.2rem;

  &__title {
    @include display($text-lg, 700);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0.8rem;
    border-radius: 12px;
    background: $paper;
    transition:
      background-color 0.2s ease,
      transform 0.25s $ease;

    &:hover {
      background: $accent-soft;
      transform: translateX(2px);

      .quick__arrow {
        color: $accent-deep;
      }
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: $surface;
    color: $accent-deep;
  }

  &__text {
    @include flex(column, flex-start, flex-start);
    flex: 1;
    min-width: 0;
    line-height: 1.3;

    strong {
      font-size: $text-sm;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__arrow {
    flex-shrink: 0;
    font-size: 0.8rem;
    color: $ink-muted;
    transition: color 0.2s ease;
  }
}
</style>
