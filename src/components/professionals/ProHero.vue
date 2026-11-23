<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { professionalsCopy } from '@/config/pages.copy'
import { useGsap } from '@/composables/useGsap'

const copy = professionalsCopy.hero
const root = ref<HTMLElement | null>(null)

const pieces = [
  { src: '/img/cutouts/somnycad.png', cls: 'box' },
  { src: '/img/cutouts/abcvit-kiddi-frasco.png', cls: 'bottle' },
  { src: '/img/cutouts/expultox-forte-frasco.png', cls: 'bottle' },
  { src: '/img/cutouts/enzabiox.png', cls: 'box' },
]

// Entrada corta y sin rebotes: solo opacidad y desplazamiento.
useGsap(root, () => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.28 } })
  tl.from('.pro-hero__copy > *', { y: 16, opacity: 0, stagger: 0.05 })
    .from('.pro-hero__shelf', { opacity: 0 }, 0.05)
    .from('.pro-hero__piece', { y: 20, opacity: 0, stagger: 0.05 }, 0.1)
    .from('.pro-hero__badge', { y: 8, opacity: 0, stagger: 0.06 }, 0.25)
})
</script>

<template>
  <section ref="root" class="pro-hero">
    <div class="pro-hero__copy">
      <p class="pro-hero__eyebrow eyebrow-cream">
        <i class="fa-solid fa-stethoscope" aria-hidden="true"></i>{{ copy.eyebrow }}
      </p>
      <h1 class="pro-hero__title">{{ copy.title }}</h1>
      <p class="pro-hero__text">{{ copy.text }}</p>
      <div class="pro-hero__actions">
        <a href="#contacto" class="btn btn--cream btn--lg">
          <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>{{ copy.cta }}
        </a>
        <a href="#fichas" class="btn btn--line btn--lg">{{ copy.secondary }}</a>
      </div>
    </div>

    <div class="pro-hero__art" aria-hidden="true">
      <span class="pro-hero__shelf"></span>
      <div class="pro-hero__row">
      <img
        v-for="piece in pieces"
        :key="piece.src"
        :src="piece.src"
        alt=""
        class="pro-hero__piece"
        :class="`pro-hero__piece--${piece.cls}`"
      />
      </div>
      <span class="pro-hero__badge pro-hero__badge--1"
        ><i class="fa-solid fa-shield-heart"></i>ARCSA</span
      >
      <span class="pro-hero__badge pro-hero__badge--2"
        ><i class="fa-solid fa-file-medical"></i>Composición declarada</span
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
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__title {
    font-size: clamp(2.4rem, 1.4rem + 4.4vw, 4.8rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.98;
    color: $cream;
  }

  &__text {
    font-size: $text-lg;
    line-height: 1.6;
    color: $cream-soft;
    max-width: 36rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__art {
    position: relative;
    width: 100%;
    max-width: 34rem;
    aspect-ratio: 4 / 3;
    margin-inline: auto;

    @include from('lg') {
      flex: 1 1 45%;
    }
  }

  // Panel crema: los empaques a color resaltan sobre él, como una vitrina.
  &__shelf {
    position: absolute;
    inset: 0;
    border-radius: $radius-md;
    background: $cream;
  }

  // Los 4 productos de pie en fila, apoyados en la misma base (pedido del cliente).
  &__row {
    position: absolute;
    inset: 16% 5% 20%;
    @include flex(row, flex-end, center, 0);
  }

  &__piece {
    min-width: 0;
    height: auto;
    filter: drop-shadow(0 14px 14px rgba($forest-deep, 0.3));

    & + & {
      margin-left: -3%;
    }

    &--bottle {
      flex: 0 1 19%;
      position: relative;
      z-index: 1;
    }

    &--box {
      flex: 0 1 34%;
    }
  }

  &__badge {
    position: absolute;
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.55rem 0.95rem;
    border-radius: $radius-pill;
    background: $forest-deep;
    border: 1px solid $cream-line;
    color: $cream;
    font-size: $text-sm;
    font-weight: 700;
    white-space: nowrap;

    i {
      color: $cream-soft;
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
