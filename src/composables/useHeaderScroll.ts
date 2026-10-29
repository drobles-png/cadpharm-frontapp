import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Estado del header según el scroll: `scrolled` cuando deja el tope (fondo
 * translúcido) y `hidden` al bajar, para devolverle pantalla al contenido.
 */
export function useHeaderScroll(threshold = 24) {
  const scrolled = ref(false)
  const hidden = ref(false)
  let lastY = 0
  let ticking = false

  function update() {
    const y = window.scrollY
    scrolled.value = y > threshold
    const delta = y - lastY
    if (Math.abs(delta) > 6) hidden.value = delta > 0 && y > 320
    lastY = y
    ticking = false
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  onMounted(() => {
    lastY = window.scrollY
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  return { scrolled, hidden }
}
