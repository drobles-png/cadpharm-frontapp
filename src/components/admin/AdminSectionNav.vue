<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

/** Índice del formulario: marca la sección visible y lleva a cada una con scroll suave. */
const props = defineProps<{ sections: readonly { id: string; label: string; icon: string }[] }>()

const active = ref(props.sections[0]?.id || '')
let observer: IntersectionObserver | null = null

function go(id: string) {
  active.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  // Se considera "activa" la sección que cruza la franja superior de la pantalla.
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) active.value = (e.target as HTMLElement).id
      })
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  props.sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer?.observe(el)
  })
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <nav class="snav" aria-label="Secciones">
    <button
      v-for="s in sections"
      :key="s.id"
      type="button"
      class="snav__item"
      :class="{ 'snav__item--active': active === s.id }"
      @click="go(s.id)"
    >
      <i :class="s.icon"></i>
      <span>{{ s.label }}</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.snav {
  @include flex(row, center, flex-start, 0.35rem);
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.35rem;
  border-radius: $radius-pill;
  background: rgba($surface, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid $line;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('lg') {
    flex-direction: column;
    align-items: stretch;
    border-radius: 16px;
    padding: 0.5rem;
  }

  &__item {
    @include flex(row, center, flex-start, 0.6rem);
    flex-shrink: 0;
    padding: 0.55rem 0.9rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition:
      background-color 0.25s ease,
      color 0.25s ease;

    @include from('lg') {
      border-radius: 10px;
      padding: 0.7rem 0.9rem;
    }

    i {
      width: 16px;
      text-align: center;
      font-size: 0.85rem;
    }

    &:hover {
      color: $ink;
      background: $paper;
    }

    &--active {
      background: $ink;
      color: $surface;

      &:hover {
        background: $ink;
        color: $surface;
      }

      i {
        color: $lime;
      }
    }
  }
}
</style>
