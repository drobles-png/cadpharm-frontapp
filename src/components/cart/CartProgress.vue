<script setup lang="ts">
import { cartCopy } from '@/config/checkout.copy'

/** Barra de pasos motivadora: le dice al cliente que ya casi termina. */
withDefaults(defineProps<{ step?: number }>(), { step: 0 })
</script>

<template>
  <div class="progress">
    <ol class="progress__steps" :aria-label="cartCopy.stepsHint">
      <li
        v-for="(label, i) in cartCopy.steps"
        :key="label"
        class="progress__step"
        :class="{ 'is-done': i < step, 'is-current': i === step }"
        :aria-current="i === step ? 'step' : undefined"
      >
        <span class="progress__dot">
          <i v-if="i < step" class="fa-solid fa-check"></i>
          <template v-else>{{ i + 1 }}</template>
        </span>
        {{ label }}
      </li>
    </ol>
    <div class="progress__track" aria-hidden="true">
      <span class="progress__fill" :style="{ '--p': (step + 0.5) / cartCopy.steps.length }"></span>
    </div>
    <p class="progress__hint">
      <i class="fa-solid fa-bolt"></i>
      {{ cartCopy.stepsHint }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.progress {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__steps {
    @include flex(row, center, space-between, 0.5rem);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__step {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;

    &.is-current {
      color: $ink;
    }

    &.is-done {
      color: $accent-deep;
    }
  }

  &__dot {
    @include flex(row, center, center);
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 50%;
    font-size: 0.68rem;
    background: $sand;
    color: $ink-soft;

    .is-current & {
      background: $ink;
      color: $surface;
    }

    .is-done & {
      background: $accent;
      color: $surface;
    }
  }

  &__track {
    height: 6px;
    border-radius: $radius-pill;
    background: $sand;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    width: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, $accent, $lime, $accent);
    background-size: 200% 100%;
    transform-origin: left;
    transform: scaleX(var(--p, 0));
    animation:
      progress-grow 0.9s $ease both,
      progress-flow 3s linear infinite;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.25rem;
    }
  }
}

@keyframes progress-grow {
  from {
    transform: scaleX(0);
  }
}

@keyframes progress-flow {
  to {
    background-position: -200% 0;
  }
}
</style>
