import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * Inclinación 3D siguiendo el mouse. Escribe --rx/--ry/--mx/--my en el elemento
 * y el CSS decide qué hacer con ellas; solo en punteros finos (desktop).
 */
export function useTilt(el: Ref<HTMLElement | null>, max = 8) {
  let frame = 0
  let fine = false

  function onMove(event: PointerEvent) {
    const node = el.value
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      node.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`)
      node.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`)
      node.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
      node.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
    })
  }

  function onLeave() {
    cancelAnimationFrame(frame)
    el.value?.style.setProperty('--rx', '0deg')
    el.value?.style.setProperty('--ry', '0deg')
  }

  onMounted(() => {
    fine =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || !el.value) return
    el.value.addEventListener('pointermove', onMove)
    el.value.addEventListener('pointerleave', onLeave)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    if (!fine || !el.value) return
    el.value.removeEventListener('pointermove', onMove)
    el.value.removeEventListener('pointerleave', onLeave)
  })
}
