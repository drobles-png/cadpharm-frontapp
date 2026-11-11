<script setup lang="ts">
/**
 * Encabezado de sección: eyebrow + título + bajada, con reveal al entrar.
 * `tone="light"` (por defecto) es texto crema para el fondo verde de la web
 * pública; `tone="dark"` es texto verde para superficies crema.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    text?: string
    align?: 'left' | 'center'
    tone?: 'dark' | 'light'
    as?: 'h1' | 'h2'
  }>(),
  { eyebrow: '', text: '', align: 'left', tone: 'light', as: 'h2' },
)
</script>

<template>
  <header class="heading" :class="[`heading--${align}`, `heading--${tone}`]">
    <p v-if="eyebrow" class="heading__eyebrow" data-reveal>
      <span class="heading__dot" aria-hidden="true"></span>{{ eyebrow }}
    </p>
    <component :is="as" class="heading__title" data-reveal data-reveal-delay="0.08">
      {{ title }}
    </component>
    <p v-if="text" class="heading__text" data-reveal data-reveal-delay="0.16">{{ text }}</p>
    <slot />
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, flex-start, 0.9rem);
  max-width: 46rem;

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: currentColor;
  }

  &__title {
    @include display($display-md, 700);
    letter-spacing: -0.035em;
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.6;
    max-width: 40rem;
  }

  &--light {
    .heading__eyebrow,
    .heading__text {
      color: $cream-soft;
    }

    .heading__title {
      color: $cream;
    }
  }

  &--dark {
    .heading__eyebrow,
    .heading__text {
      color: rgba($forest, 0.78);
    }

    .heading__title {
      color: $forest;
    }
  }
}
</style>
