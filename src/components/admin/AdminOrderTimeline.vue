<script setup lang="ts">
import { computed } from 'vue'
import { orderDetailCopy as copy, orderStatus } from '@/config/admin.copy'
import { formatDateTime } from '@/utils/format'
import type { Order } from '@/types'

const props = defineProps<{ history: Order['statusHistory'] }>()

/** Lo más reciente arriba: es lo que quien opera quiere ver primero. */
const steps = computed(() => [...props.history].reverse())
</script>

<template>
  <section class="timeline">
    <h2 class="timeline__title">{{ copy.timeline }}</h2>
    <TransitionGroup tag="ol" name="step" class="timeline__list">
      <li
        v-for="(s, i) in steps"
        :key="s.at + s.status"
        class="timeline__step"
        :class="[`timeline__step--${orderStatus[s.status]?.tone || 'muted'}`, { 'timeline__step--current': i === 0 }]"
      >
        <span class="timeline__dot"><i :class="orderStatus[s.status]?.icon"></i></span>
        <div class="timeline__body">
          <strong>{{ orderStatus[s.status]?.label || s.status }}</strong>
          <small>{{ formatDateTime(s.at) }}</small>
          <p v-if="s.note" class="timeline__note">{{ s.note }}</p>
        </div>
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped lang="scss">
.timeline {
  @include card;
  padding: 1.2rem;

  &__title {
    @include display($text-lg, 700);
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
    position: relative;
  }

  &__step {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.85rem);
    padding-bottom: 1.1rem;

    // Línea que une los puntos; el último no la lleva.
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 15px;
      top: 34px;
      bottom: 2px;
      width: 2px;
      background: $line;
    }

    --dot: #{$ink-muted};
    --dot-bg: #{rgba($ink, 0.07)};

    &--warning {
      --dot: #{darken($warning, 14%)};
      --dot-bg: #{$warning-bg};
    }

    &--info {
      --dot: #{$info};
      --dot-bg: #{$info-bg};
    }

    &--blue {
      --dot: #{$brand-blue};
      --dot-bg: #{$brand-blue-soft};
    }

    &--success {
      --dot: #{$accent-deep};
      --dot-bg: #{$success-bg};
    }

    &--danger {
      --dot: #{$danger};
      --dot-bg: #{$danger-bg};
    }

    &--current .timeline__dot {
      background: var(--dot);
      color: $surface;
      box-shadow: 0 0 0 5px var(--dot-bg);
    }
  }

  &__dot {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--dot-bg);
    color: var(--dot);
    font-size: 0.75rem;
    transition:
      background-color 0.4s ease,
      box-shadow 0.4s ease;
  }

  &__body {
    @include flex(column, flex-start, flex-start);
    line-height: 1.35;
    padding-top: 0.2rem;

    small {
      color: $ink-muted;
      font-size: $text-xs;
    }
  }

  &__note {
    margin-top: 0.4rem;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: $paper;
    font-size: $text-sm;
    color: $ink-soft;
  }
}

.step-enter-active {
  transition:
    opacity 0.5s $ease,
    transform 0.5s $ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.step-move {
  transition: transform 0.5s $ease;
}
</style>
