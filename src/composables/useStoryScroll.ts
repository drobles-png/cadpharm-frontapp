import { nextTick, onMounted, watch, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Product } from '@/types'
import { useGsap } from './useGsap'

/** "195.98 mg" → { value: 195.98, decimals: 2, unit: 'mg' } */
export function parseAmount(amount: string) {
  const match = amount.trim().match(/^([\d.,]+)\s*(.*)$/)
  if (!match?.[1]) return null
  const raw = match[1].replace(',', '.')
  const value = Number(raw)
  if (Number.isNaN(value)) return null
  const decimals = raw.split('.')[1]?.length ?? 0
  return { value, decimals, unit: match[2] ?? '' }
}

function setCount(el: HTMLElement, value: number) {
  el.textContent = value.toFixed(Number(el.dataset.decimals) || 0)
}

function finalCount(el: HTMLElement) {
  setCount(el, Number(el.dataset.count))
}

/** Cuenta desde 0 hasta data-count, una sola vez cuando entra en pantalla. */
function countOnEnter(el: HTMLElement) {
  const target = Number(el.dataset.count)
  const state = { v: 0 }
  setCount(el, 0)
  gsap.to(state, {
    v: target,
    duration: 1.6,
    ease: 'power3.out',
    onUpdate: () => setCount(el, state.v),
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
  })
}

/**
 * Storytelling del home. Desktop: un escenario fijado (pin) donde cada scroll de
 * pantalla cambia de producto, el fondo transiciona a su color y el recorte gira
 * y escala con el scroll. Móvil: paneles apilados con contadores al entrar.
 */
export function useStoryScroll(root: Ref<HTMLElement | null>, products: Ref<Product[]>) {
  const { run } = useGsap(
    root,
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        const section = root.value!
        const stage = section.querySelector<HTMLElement>('.story__stage')!
        const panels = gsap.utils.toArray<HTMLElement>('.panel')
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]')
        const dots = gsap.utils.toArray<HTMLElement>('.story__dot')
        section.classList.add('story--pinned')
        gsap.set(dots[0] ?? [], { scale: 1.8, opacity: 1, backgroundColor: '#ffffff' })

        gsap.set(stage, { backgroundColor: products.value[0]?.theme.primary })
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 60 })
        panels
          .slice(1)
          .forEach((p) =>
            p.querySelectorAll<HTMLElement>('[data-count]').forEach((c) => setCount(c, 0)),
          )
        panels[0]?.querySelectorAll<HTMLElement>('[data-count]').forEach(countOnEnter)

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${window.innerHeight * panels.length}`,
            pin: true,
            // Explícito: el espacio del pin es lo que empuja a las secciones de abajo.
            pinSpacing: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })

        panels.forEach((panel, i) => {
          const visual = panel.querySelector('.panel__visual')
          const layer = panel.querySelector('.panel__layer')
          tl.fromTo(
            visual,
            { rotate: -12, scale: 0.84, yPercent: 8 },
            { rotate: 8, scale: 1.05, yPercent: -6, duration: 1 },
            i,
          )
          tl.fromTo(
            layer,
            { yPercent: 35, rotate: 18 },
            { yPercent: -35, rotate: -12, duration: 1 },
            i,
          )
          if (i === 0) return

          const at = i - 0.2
          const color = products.value[i]?.theme.primary
          tl.to(stage, { backgroundColor: color, duration: 0.35 }, at)
          tl.to(panels[i - 1] ?? [], { autoAlpha: 0, y: -60, duration: 0.3 }, at)
          tl.to(panel, { autoAlpha: 1, y: 0, duration: 0.3 }, at + 0.1)
          tl.to(
            dots[i - 1] ?? [],
            { scale: 1, backgroundColor: 'rgba(255,255,255,0.45)', duration: 0.2 },
            at,
          )
          tl.to(dots[i] ?? [], { scale: 1.8, backgroundColor: '#ffffff', duration: 0.2 }, at + 0.1)
          tl.from(
            panel.querySelectorAll('.panel__chip'),
            { scale: 0, autoAlpha: 0, stagger: 0.03, duration: 0.15 },
            at + 0.2,
          )
          panel.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
            const state = { v: 0 }
            tl.to(
              state,
              {
                v: Number(el.dataset.count),
                duration: 0.45,
                onUpdate: () => setCount(el, state.v),
              },
              at + 0.2,
            )
          })
        })

        // Al volver a móvil (o al desmontar) los números quedan en su valor real.
        return () => {
          section.classList.remove('story--pinned')
          counters.forEach(finalCount)
        }
      })

      mm.add('(max-width: 1023px)', () => {
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]')
        counters.forEach(countOnEnter)
        gsap.utils.toArray<HTMLElement>('.panel__visual').forEach((visual) => {
          gsap.fromTo(
            visual,
            { rotate: -10, scale: 0.85 },
            {
              rotate: 6,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: visual,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
        return () => counters.forEach(finalCount)
      })
    },
    { immediate: false },
  )

  async function start() {
    if (!products.value.length) return
    await nextTick()
    run()
    ScrollTrigger.refresh()
  }

  // El catálogo puede venir de la caché (ya montado) o llegar después.
  onMounted(start)
  watch(() => products.value.length, start)
}
