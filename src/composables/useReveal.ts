import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Revela con una transición todo lo que tenga [data-reveal] dentro de la vista
 * cuando entra en pantalla. data-reveal-delay="0.1" escalona elementos hermanos.
 * Un solo IntersectionObserver por vista: barato aunque haya decenas.
 */
export function useReveal(root?: () => HTMLElement | null | undefined) {
  let observer: IntersectionObserver | null = null
  // El contenido que llega del API suele entrar con <Transition mode="out-in">,
  // o sea después del nextTick en que la vista llama rescan(). Vigilar el DOM
  // evita que esos elementos se queden invisibles para siempre.
  let mutations: MutationObserver | null = null
  let pending = 0

  function scheduleScan() {
    if (pending) return
    pending = requestAnimationFrame(() => {
      pending = 0
      scan()
    })
  }

  function scan() {
    const scope = root?.() ?? document
    scope.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => {
      const delay = el.dataset.revealDelay
      if (delay) el.style.setProperty('--reveal-delay', `${delay}s`)
      observer?.observe(el)
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    scan()
    mutations = new MutationObserver(scheduleScan)
    mutations.observe(root?.() ?? document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    mutations?.disconnect()
    if (pending) cancelAnimationFrame(pending)
  })

  // Para contenido que llega después (cuando el API responde)
  return { rescan: scan }
}
