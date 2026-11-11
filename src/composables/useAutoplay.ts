import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Índice de un carrusel que avanza solo. Se detiene cuando la persona lo pausa,
 * mientras el cursor o el foco están encima (para leer sin que cambie), mientras
 * lo mantiene presionado y con la pestaña oculta. Cada cambio manual reinicia la
 * cuenta: así nunca salta una imagen justo después de que alguien la eligió.
 */
export function useAutoplay(count: Ref<number>, interval = 6000) {
  const index = ref(0)
  const userPaused = ref(false)
  const hovering = ref(false)
  const holding = ref(false)
  const tabHidden = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const running = computed(
    () =>
      !userPaused.value &&
      !hovering.value &&
      !holding.value &&
      !tabHidden.value &&
      count.value > 1,
  )

  function schedule() {
    if (timer) clearTimeout(timer)
    timer = null
    if (running.value) timer = setTimeout(next, interval)
  }

  function go(i: number) {
    const n = count.value
    if (!n) return
    index.value = ((i % n) + n) % n
    schedule()
  }

  const next = () => go(index.value + 1)
  const prev = () => go(index.value - 1)
  const toggle = () => (userPaused.value = !userPaused.value)

  const onVisibility = () => (tabHidden.value = document.hidden)

  watch(running, schedule)
  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibility)
    schedule()
  })
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
    if (timer) clearTimeout(timer)
  })

  // Para el borde de progreso: se reinicia con cada cambio de índice.
  const cycle = computed(() => `${index.value}-${running.value}`)

  return {
    index,
    userPaused,
    running,
    cycle,
    next,
    prev,
    go,
    toggle,
    hoverOn: () => (hovering.value = true),
    hoverOff: () => (hovering.value = false),
    hold: () => (holding.value = true),
    release: () => (holding.value = false),
  }
}
