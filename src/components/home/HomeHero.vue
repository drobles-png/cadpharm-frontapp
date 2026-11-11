<script setup lang="ts">
import { computed } from 'vue'
import { homeHero as copy } from '@/config/info.copy'
import { useAutoplay } from '@/composables/useAutoplay'

const SLIDE_MS = 3000

const slides = copy.slides
const count = computed(() => slides.length)
// Sin pausa al pasar el mouse: el hero ocupa toda la pantalla y el cursor
// casi siempre está encima, así que nunca cambiaba.
const { index } = useAutoplay(
  count,
  SLIDE_MS,
)
const current = computed(() => slides[index.value]!)
const actions = computed(() =>
  current.value.proFirst
    ? { first: copy.secondary, second: copy.primary, firstIcon: true }
    : { first: copy.primary, second: copy.secondary, firstIcon: false },
)
</script>

<template>
  <section
    class="hero"
    :aria-label="copy.label"
    aria-roledescription="carrusel"
  >
    <div class="hero__media" aria-hidden="true">
      <img
        v-for="(slide, i) in slides"
        :key="slide.image"
        :src="slide.image"
        alt=""
        class="hero__photo"
        :class="{ 'hero__photo--active': i === index }"
        :style="{ '--focus': slide.focus ?? '60% 40%', '--dur': `${SLIDE_MS + 1500}ms` }"
        :fetchpriority="i === 0 ? 'high' : 'low'"
        decoding="async"
      />
      <span class="hero__shade"></span>
    </div>

    <div class="hero__inner">
      <h1 class="visually-hidden">{{ copy.heading }}</h1>
      <!-- Sin aria-live: el cambio automático no debe interrumpir al lector de pantalla. -->
      <Transition name="hero-copy" mode="out-in">
        <div :key="index" class="hero__copy">
          <span class="hero__eyebrow">{{ current.eyebrow }}</span>
          <p class="hero__title">{{ current.title }}</p>
          <p class="hero__text">{{ current.text }}</p>
          <span class="visually-hidden">{{ current.alt }}</span>
        </div>
      </Transition>

      <div class="hero__actions">
        <RouterLink :to="actions.first.to" class="btn btn--cream btn--lg">
          <i v-if="actions.firstIcon" class="fa-solid fa-user-doctor" aria-hidden="true"></i
          >{{ actions.first.label }}
        </RouterLink>
        <RouterLink :to="actions.second.to" class="btn btn--line btn--lg hero__secondary">
          <i v-if="!actions.firstIcon" class="fa-solid fa-user-doctor" aria-hidden="true"></i
          >{{ actions.second.label }}
        </RouterLink>
      </div>

    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: $forest-deep;
  isolation: isolate;
  @include flex(column, stretch, flex-end);

  &__media {
    position: absolute;
    inset: 0;
    z-index: -1;
  }

  &__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: var(--focus);
    opacity: 0;
    transform: scale(1.06);
    // Al salir solo se apaga; el zoom lento corre mientras está activa.
    transition:
      opacity 0.8s ease,
      transform 0s linear 0.8s;

    @include from('md') {
      object-position: center;
    }

    &--active {
      opacity: 1;
      transform: scale(1);
      transition:
        opacity 0.8s ease,
        transform var(--dur) linear;
    }

    @include reduced-motion {
      transform: none;
    }
  }

  // Degradado desde abajo en móvil y desde la izquierda en desktop: el texto
  // siempre queda sobre la zona oscura, sin importar la foto.
  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba($forest-deep, 0.75) 0%, rgba($forest-deep, 0) 22%),
      linear-gradient(
        0deg,
        rgba($forest-deep, 0.95) 0%,
        rgba($forest-deep, 0.7) 40%,
        rgba($forest-deep, 0.1) 75%,
        rgba($forest-deep, 0.2) 100%
      );

    @include from('md') {
      background:
        linear-gradient(
          90deg,
          rgba($forest-deep, 0.88) 0%,
          rgba($forest-deep, 0.55) 38%,
          rgba($forest-deep, 0) 68%
        ),
        linear-gradient(0deg, rgba($forest-deep, 0.6) 0%, transparent 30%),
        linear-gradient(180deg, rgba($forest-deep, 0.5) 0%, transparent 22%);
    }
  }

  &__inner {
    @include container(1280px);
    padding-top: 7rem;
    padding-bottom: 2rem;
    @include flex(column, flex-start, flex-end, 1.75rem);

    @include from('md') {
      min-height: 100svh;
      justify-content: center;
      padding-bottom: 6rem;
    }
  }

  &__copy {
    max-width: 46rem;
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__eyebrow {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: $cream-soft;
  }

  &__title {
    @include display(clamp(2.4rem, 1.6rem + 3.6vw, 4.4rem), 700);
    color: $cream;
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.55;
    color: $cream-soft;
    max-width: 32rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    width: 100%;

    .btn {
      flex: 1 1 auto;

      @include from('sm') {
        flex: 0 0 auto;
      }
    }
  }

  &__secondary {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba($forest-deep, 0.25);
  }

}

.hero-copy-enter-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.hero-copy-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.hero-copy-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.hero-copy-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
