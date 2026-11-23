<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { professionalsCopy } from '@/config/pages.copy'
import { useGsap } from '@/composables/useGsap'

const copy = professionalsCopy.hero
const root = ref<HTMLElement | null>(null)

// Entrada corta y sin rebotes: solo opacidad y desplazamiento.
useGsap(root, () => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.28 } })
  tl.from('.pro-hero__copy > *', { y: 16, opacity: 0, stagger: 0.05 })
    .from('.pro-hero__photo', { y: 20, opacity: 0 }, 0.05)
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
      <img
        src="/img/professionals/productos.webp"
        alt=""
        width="1600"
        height="800"
        class="pro-hero__photo"
      />
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
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    width: 100%;
    max-width: 40rem;
    margin-inline: auto;

    @include from('lg') {
      flex: 1 1 50%;
    }
  }

  // Foto de la línea completa que mandó el cliente (fondo blanco de estudio).
  &__photo {
    display: block;
    width: 100%;
    height: auto;
    border-radius: $radius-md;
    background: #fff;
  }

  // En celular la foto es chica y las etiquetas tapaban los frascos: van debajo.
  &__badge {
    @include from('md') {
      position: absolute;
    }

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
      top: 4%;
      left: 2%;
    }
  }
}
</style>
