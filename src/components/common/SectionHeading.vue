<script setup lang="ts">
/** Encabezado de sección: eyebrow + título + bajada, con reveal al entrar. */
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    text?: string
    align?: 'left' | 'center'
    tone?: 'dark' | 'light'
    as?: 'h1' | 'h2'
  }>(),
  { eyebrow: '', text: '', align: 'left', tone: 'dark', as: 'h2' },
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
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: $accent;
    box-shadow: 0 0 0 4px rgba($accent, 0.18);
  }

  &__title {
    @include display($display-md, 800);
    letter-spacing: -0.035em;
    color: $ink;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 40rem;
  }

  &--light {
    .heading__eyebrow {
      color: $lime;
    }

    .heading__dot {
      background: $lime;
      box-shadow: 0 0 0 4px rgba($lime, 0.2);
    }

    .heading__title {
      color: $surface;
    }

    .heading__text {
      color: rgba(255, 255, 255, 0.72);
    }
  }
}
</style>
