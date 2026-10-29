<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { professionalsCopy } from '@/config/pages.copy'
import { useGsap } from '@/composables/useGsap'

const copy = professionalsCopy.hero
const root = ref<HTMLElement | null>(null)

const pieces = [
  { src: '/img/cutouts/abcvit-kiddi-frasco.png', cls: 'a' },
  { src: '/img/cutouts/expultox-forte-frasco.png', cls: 'b' },
  { src: '/img/cutouts/somnycad-blister.png', cls: 'c' },
  { src: '/img/cutouts/enzabiox-blister.png', cls: 'd' },
]

useGsap(root, () => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.pro-hero__copy > *', { y: 40, opacity: 0, duration: 1, stagger: 0.09 })
    .from('.pro-hero__disc', { scale: 0.5, opacity: 0, duration: 1.4 }, 0.1)
    .from(
      '.pro-hero__piece',
      { y: 120, opacity: 0, rotate: 25, duration: 1.3, ease: 'back.out(1.4)', stagger: 0.1 },
      0.25,
    )
    .from(
      '.pro-hero__badge',
      { scale: 0.5, opacity: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.12 },
      0.9,
    )
})
</script>

<template>
  <section ref="root" class="pro-hero">
    <div class="pro-hero__copy">
      <p class="pro-hero__eyebrow">
        <i class="fa-solid fa-stethoscope" aria-hidden="true"></i>{{ copy.eyebrow }}
      </p>
      <h1 class="pro-hero__title">{{ copy.title }}</h1>
      <p class="pro-hero__text">{{ copy.text }}</p>
      <div class="pro-hero__actions">
        <a href="#contacto" class="btn btn--primary btn--lg">
          <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>{{ copy.cta }}
        </a>
        <a href="#fichas" class="btn btn--light btn--lg">{{ copy.secondary }}</a>
      </div>
    </div>

    <div class="pro-hero__art" aria-hidden="true">
      <span class="pro-hero__disc"></span>
      <img
        v-for="piece in pieces"
        :key="piece.src"
        :src="piece.src"
        alt=""
        class="pro-hero__piece"
        :class="`pro-hero__piece--${piece.cls}`"
      />
      <span class="pro-hero__badge pro-hero__badge--1"
        ><i class="fa-solid fa-shield-heart"></i>ARCSA</span
      >
      <span class="pro-hero__badge pro-hero__badge--2"
        ><i class="fa-solid fa-file-medical"></i>Fichas técnicas</span
      >
    </div>
  </section>
</template>

<style scoped lang="scss">
.pro-hero {
  @include container(1280px);
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: 2.5rem $space-xl;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    padding-top: 4rem;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.3rem);

    @include from('lg') {
      flex: 1 1 55%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $brand-blue;
    padding: 0.45rem 0.9rem;
    border-radius: $radius-pill;
    background: $brand-blue-soft;
  }

  &__title {
    font-size: clamp(2.4rem, 1.4rem + 4.4vw, 4.8rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.98;
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 36rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__art {
    position: relative;
    width: 100%;
    max-width: 28rem;
    aspect-ratio: 1;
    margin-inline: auto;

    @include from('lg') {
      flex: 1 1 45%;
    }
  }

  &__disc {
    position: absolute;
    inset: 8%;
    border-radius: 50%;
    background: $brand-blue;
    box-shadow:
      0 0 0 1.5rem rgba($brand-blue, 0.08),
      0 0 0 3rem rgba($brand-blue, 0.04);
  }

  &__piece {
    position: absolute;
    filter: drop-shadow(0 24px 22px rgba($ink, 0.3));

    &--a {
      width: 22%;
      left: 22%;
      top: 14%;
      transform: rotate(-8deg);
    }

    &--b {
      width: 22%;
      left: 52%;
      top: 18%;
      transform: rotate(7deg);
    }

    &--c {
      width: 36%;
      left: 8%;
      top: 52%;
      transform: rotate(-14deg);
    }

    &--d {
      width: 36%;
      left: 54%;
      top: 50%;
      transform: rotate(12deg);
    }
  }

  &__badge {
    position: absolute;
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.55rem 0.95rem;
    border-radius: $radius-pill;
    background: $surface;
    box-shadow: $shadow-md;
    font-size: $text-sm;
    font-weight: 700;
    white-space: nowrap;

    i {
      color: $accent;
    }

    &--1 {
      top: 4%;
      right: 2%;
    }

    &--2 {
      bottom: 6%;
      left: 0;
    }
  }
}
</style>
