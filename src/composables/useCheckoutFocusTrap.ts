import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Foco atrapado básico para paneles (carrito): al abrir enfoca el panel, Tab
 * y Shift+Tab dan la vuelta dentro, Esc cierra, y al cerrar el foco vuelve al
 * botón que lo abrió para no perder al usuario de teclado.
 */
export function useCheckoutFocusTrap(
  open: Ref<boolean>,
  panel: Ref<HTMLElement | null>,
  onClose: () => void,
) {
  let previous: HTMLElement | null = null

  function items(): HTMLElement[] {
    if (!panel.value) return []
    return Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    )
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open.value) return
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const list = items()
    if (!list.length) return
    const first = list[0]!
    const last = list[list.length - 1]!
    const active = document.activeElement as HTMLElement | null
    if (e.shiftKey && (active === first || !panel.value?.contains(active))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  watch(open, async (isOpen) => {
    if (isOpen) {
      previous = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value?.focus({ preventScroll: true })
    } else {
      document.removeEventListener('keydown', onKeydown)
      previous?.focus?.({ preventScroll: true })
      previous = null
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
