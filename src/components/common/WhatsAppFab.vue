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
      <span class="fab__ring" aria-hidden="true"></span>
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </Transition>
</template>

<style scoped lang="scss">
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
  box-shadow: 0 14px 30px rgba(#25d366, 0.4);
  transition: transform 0.35s $ease;

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.9rem;
    height: 3.9rem;
  }

  &:hover {
    transform: scale(1.08) rotate(-6deg);
  }

  &__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid #25d366;
    animation: fab-ring 2.6s $ease infinite;
  }

  &__tooltip {
    position: absolute;
    right: calc(100% + 0.8rem);
    white-space: nowrap;
    background: $ink;
    color: $surface;
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.55rem 0.9rem;
    border-radius: $radius-pill;
    opacity: 0;
    transform: translateX(8px);
    transition:
      opacity 0.3s ease,
      transform 0.3s $ease;
    pointer-events: none;
    display: none;

    @include from('md') {
      display: block;
    }
  }

  &:hover &__tooltip,
  &:focus-visible &__tooltip {
    opacity: 1;
    transform: none;
  }

  @include focus-ring($ink);
}

// En la ficha de producto móvil hay barra inferior fija: el botón sube.
body.has-buybar .fab {
  @include until('lg') {
    bottom: calc(5.5rem + env(safe-area-inset-bottom));
  }
}

.fab-enter-active,
.fab-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.4) translateY(20px);
}

@keyframes fab-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
