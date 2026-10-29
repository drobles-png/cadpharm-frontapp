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
      <button type="button" class="btn btn--dark" @click="$emit('again')">{{ copy.again }}</button>
      <a :href="whatsappLink()" class="btn btn--ghost" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.success {
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: 3rem 1rem;

  &__title {
    font-size: $display-sm;
    font-weight: 800;
    letter-spacing: -0.04em;
  }

  &__text {
    color: $ink-soft;
    max-width: 36ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  &__burst {
    position: relative;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 2.2rem;
    @include flex(row, center, center);
    margin-bottom: 0.6rem;
    animation: pop 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0.5rem;
      height: 0.5rem;
      margin: -0.25rem;
      border-radius: 50%;
      background: $lime;
      transform: rotate(calc(var(--n) * 45deg)) translateY(0);
      animation: burst 0.9s $ease 0.15s both;
    }
  }
}

@keyframes pop {
  from {
    transform: scale(0);
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
