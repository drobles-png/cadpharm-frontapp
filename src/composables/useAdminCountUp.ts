import { onUnmounted, ref, watch, type Ref } from 'vue'

/**
 * Número que sube desde su valor anterior hasta el nuevo. Da la sensación de
 * que el dato "llega" en vez de aparecer de golpe; con movimiento reducido
 * salta directo al valor final.
 */
export function useAdminCountUp(target: Ref<number>, duration = 1100) {
  const value = ref(0)
  let frame = 0

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function run(to: number) {
    cancelAnimationFrame(frame)
    if (reduced) {
      value.value = to
      return
    }
    const from = value.value
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      value.value = from + (to - from) * eased
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  watch(target, (to) => run(to || 0), { immediate: true })
  onUnmounted(() => cancelAnimationFrame(frame))

  return value
}
