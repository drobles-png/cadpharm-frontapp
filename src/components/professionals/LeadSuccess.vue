<script setup lang="ts">
import { whatsappLink } from '@/config/site'
import { professionalsCopy } from '@/config/pages.copy'

/** Estado de éxito del formulario: un check que salta y suelta puntos alrededor. */
defineProps<{ message: string }>()
defineEmits<{ again: [] }>()
const copy = professionalsCopy.form
</script>

<template>
  <div class="success" role="status">
    <span class="success__burst" aria-hidden="true">
      <span v-for="n in 8" :key="n" :style="{ '--n': n }"></span>
      <i class="fa-solid fa-check"></i>
    </span>
    <h3 class="success__title">{{ copy.successTitle }}</h3>
    <p class="success__text">{{ message }}</p>
    <div class="success__actions">
      <button type="button" class="btn success__primary" @click="$emit('again')">
        {{ copy.again }}
      </button>
      <a :href="whatsappLink()" class="btn success__ghost" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Vive sobre la tarjeta crema del formulario.
.success {
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: 3rem 1rem;
  color: $forest;

  &__title {
    font-size: $display-sm;
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  &__text {
    color: rgba($forest, 0.78);
    max-width: 36ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  &__primary,
  &__ghost {
    min-height: 2.75rem;
    border: 1.5px solid $forest;
    transition: background-color 0.2s ease-out;
  }

  &__primary {
    background: $forest;
    color: $cream;
  }

  &__ghost {
    color: $forest;
  }

  @media (hover: hover) and (pointer: fine) {
    &__primary:hover {
      background: $forest-raised;
    }

    &__ghost:hover {
      background: rgba($forest, 0.06);
    }
  }

  &__burst {
    position: relative;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 50%;
    background: $forest;
    color: $cream;
    font-size: 2.2rem;
    @include flex(row, center, center);
    margin-bottom: 0.6rem;
    animation: pop 0.28s ease-out both;

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0.5rem;
      height: 0.5rem;
      margin: -0.25rem;
      border-radius: 50%;
      background: rgba($forest, 0.45);
      transform: rotate(calc(var(--n) * 45deg)) translateY(0);
      animation: burst 0.28s ease-out 0.12s both;
    }
  }
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}

@keyframes burst {
  0% {
    opacity: 1;
    transform: rotate(calc(var(--n) * 45deg)) translateY(0);
  }
  100% {
    opacity: 0;
    transform: rotate(calc(var(--n) * 45deg)) translateY(-4.5rem);
  }
}
</style>
