import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/** Registra ScrollTrigger una sola vez para toda la app. */
export function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return { gsap, ScrollTrigger }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Corre animaciones dentro de un gsap.context ligado al componente: todo lo
 * creado ahí (tweens, ScrollTriggers, matchMedia) se revierte al desmontar.
 * `run()` reconstruye el contexto; útil cuando los datos llegan después.
 * Con movimiento reducido no se llama al setup: el DOM ya está en su estado final.
 */
export function useGsap(
  scope: Ref<HTMLElement | null | undefined>,
  setup: () => void,
  options: { immediate?: boolean } = {},
) {
  ensureGsap()
  let ctx: gsap.Context | null = null

  function run() {
    ctx?.revert()
    ctx = null
    if (!scope.value || prefersReducedMotion()) return
    ctx = gsap.context(setup, scope.value)
  }

  if (options.immediate !== false) onMounted(run)
  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
  })

  return { run }
}
