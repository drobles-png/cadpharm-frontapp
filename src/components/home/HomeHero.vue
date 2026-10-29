<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { homeCopy } from '@/config/home.copy'
import { useGsap } from '@/composables/useGsap'
import MagneticButton from '@/components/common/MagneticButton.vue'
import HeroShowcase from './HeroShowcase.vue'
import HeroBackdrop from './HeroBackdrop.vue'

const copy = homeCopy.hero
const root = ref<HTMLElement | null>(null)

useGsap(root, () => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.8 })
    .from('.hero__word-inner', { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07 }, 0.1)
    .from('.hero__underline', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, 0.8)
    .from('.hero__sub', { y: 24, opacity: 0, duration: 0.9 }, 0.55)
    .from('.hero__actions > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.7)
    .from('.hero__hint', { opacity: 0, duration: 1 }, 1.4)

  // Al salir del hero, el texto sube un poco más lento que el scroll.
  gsap.to('.hero__copy', {
    yPercent: -12,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section ref="root" class="hero">
    <HeroBackdrop />

    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <span class="hero__pulse" aria-hidden="true"></span>{{ copy.eyebrow }}
        </p>
        <h1 class="hero__title">
          <template v-for="(word, i) in copy.title" :key="i">
            <span class="hero__word" :class="{ 'hero__word--accent': word.accent }">
              <span class="hero__word-inner">{{ word.text }}</span>
              <span
                v-if="i === copy.title.length - 1"
                class="hero__underline"
                aria-hidden="true"
              ></span> </span
            >{{ ' ' }}
          </template>
        </h1>
        <p class="hero__sub">{{ copy.subtitle }}</p>
        <div class="hero__actions">
          <MagneticButton>
            <RouterLink :to="copy.primaryCta.to" class="btn btn--primary btn--lg">
              <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ copy.primaryCta.label }}
            </RouterLink>
          </MagneticButton>
          <MagneticButton :strength="0.2">
            <RouterLink :to="copy.secondaryCta.to" class="btn btn--light btn--lg hero__pro">
              <i class="fa-solid fa-user-doctor" aria-hidden="true"></i
              >{{ copy.secondaryCta.label }}
            </RouterLink>
          </MagneticButton>
        </div>
      </div>

      <HeroShowcase class="hero__showcase" />
    </div>

    <p class="hero__hint" aria-hidden="true">
      <span class="hero__mouse"><span></span></span>{{ copy.scrollHint }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  padding: 6.5rem 0 4.5rem;
  background: $paper;
  @include flex(column, stretch, center);

  @include from('lg') {
    padding: 7rem 0 5rem;
  }

  &__inner {
    position: relative;
    @include container(1280px);
    @include flex(column, stretch, center, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.4rem);

    @include from('lg') {
      flex: 1 1 52%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.6rem);
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $accent-deep;
    padding: 0.45rem 0.9rem;
    border-radius: $radius-pill;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba($accent, 0.25);
    backdrop-filter: blur(8px);
  }

  &__pulse {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: $accent;
    animation: pulse 2s ease-out infinite;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.7rem, 1.4rem + 6vw, 6rem);
    font-weight: 800;
    line-height: 0.98;
    letter-spacing: -0.05em;
    color: $ink;
    text-wrap: balance;
    // Contexto propio para que el subrayado (z-index -1) quede tras la palabra y no tras el hero.
    position: relative;
    isolation: isolate;
  }

  &__word {
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: top;
    padding-bottom: 0.1em;
    margin-bottom: -0.1em;

    &--accent {
      color: $accent;
    }

    &:has(.hero__underline) {
      color: $brand-blue;
    }
  }

  &__word-inner {
    display: inline-block;
  }

  &__underline {
    position: absolute;
    left: 0;
    right: 0.25em;
    bottom: 0.08em;
    height: 0.14em;
    border-radius: 99px;
    background: $lime;
    z-index: -1;
    transform-origin: left;
  }

  &__sub {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 34rem;
    line-height: 1.6;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  &__pro {
    box-shadow: $shadow-sm;
  }

  &__showcase {
    @include from('lg') {
      flex: 1 1 48%;
    }
  }

  &__hint {
    position: absolute;
    bottom: 1.4rem;
    left: 50%;
    transform: translateX(-50%);
    @include flex(row, center, center, 0.6rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
    white-space: nowrap;
  }

  &__mouse {
    width: 1.2rem;
    height: 1.9rem;
    border: 2px solid currentColor;
    border-radius: 99px;
    @include flex(row, flex-start, center);
    padding-top: 0.3rem;

    span {
      width: 3px;
      height: 6px;
      border-radius: 3px;
      background: currentColor;
      animation: wheel 1.6s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba($accent, 0.55);
  }
  100% {
    box-shadow: 0 0 0 10px rgba($accent, 0);
  }
}
@keyframes wheel {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  60% {
    transform: translateY(7px);
    opacity: 0;
  }
}
</style>
