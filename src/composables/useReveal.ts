import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Revela con una transición todo lo que tenga [data-reveal] dentro de la vista
 * cuando entra en pantalla. data-reveal-delay="0.1" escalona elementos hermanos.
 * Un solo IntersectionObserver por vista: barato aunque haya decenas.
 */
export function useReveal(root?: () => HTMLElement | null | undefined) {
  let observer: IntersectionObserver | null = null

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
  })

  onBeforeUnmount(() => observer?.disconnect())

  // Para contenido que llega después (cuando el API responde)
  return { rescan: scan }
}
