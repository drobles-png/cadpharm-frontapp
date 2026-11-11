<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/pages.copy'

// Aparece después del primer scroll para no competir con el hero.
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 240
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fab">
    <a
      v-if="site.whatsapp && visible"
      :href="whatsappLink()"
      class="fab"
      target="_blank"
      rel="noopener"
      :aria-label="layoutCopy.fab.label"
    >
      <span class="fab__tooltip" aria-hidden="true">{{ layoutCopy.fab.tooltip }}</span>
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </Transition>
</template>

<style scoped lang="scss">
// Verde WhatsApp sobre el verde profundo del sitio: el aro crema lo separa del
// fondo sin depender del tono.
.fab {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 80;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #25d366;
  color: $surface;
  font-size: 1.75rem;
  @include flex(row, center, center);
  box-shadow:
    0 0 0 3px rgba($cream, 0.9),
    0 12px 28px rgba($forest-deep, 0.55);
  transition: transform 0.2s ease-out;

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.9rem;
    height: 3.9rem;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: scale(1.06);
    }
  }

  &:active {
    transform: scale(0.96);
  }

  &__tooltip {
    position: absolute;
    right: calc(100% + 0.8rem);
    white-space: nowrap;
    background: $cream;
    color: $forest;
    font-size: $text-sm;
    font-weight: 700;
    padding: 0.55rem 0.9rem;
    border-radius: $radius-pill;
    opacity: 0;
    transform: translateX(6px);
    transition:
      opacity 0.2s ease-out,
      transform 0.2s ease-out;
    pointer-events: none;
    display: none;

    @include from('md') {
      display: block;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover &__tooltip {
      opacity: 1;
      transform: none;
    }
  }

  &:focus-visible &__tooltip {
    opacity: 1;
    transform: none;
  }

  @include focus-ring($cream);
}

// En la ficha de producto móvil hay barra inferior fija: el botón sube.
.fab-enter-active,
.fab-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.25s ease-out;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(12px);
}
</style>
