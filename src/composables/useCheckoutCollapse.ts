/**
 * Hooks de <Transition> para colapsar a alto real. CSS no sabe transicionar a
 * "auto", así que se mide scrollHeight y se anima en píxeles (el elemento
 * necesita `overflow: hidden` y `transition: height`).
 */
export function useCheckoutCollapse() {
  function onEnter(el: Element) {
    const node = el as HTMLElement
    node.style.height = '0'
    requestAnimationFrame(() => {
      node.style.height = `${node.scrollHeight}px`
    })
  }

  function onAfterEnter(el: Element) {
    const node = el as HTMLElement
    node.style.height = ''
  }

  function onLeave(el: Element) {
    const node = el as HTMLElement
    node.style.height = `${node.scrollHeight}px`
    requestAnimationFrame(() => {
      node.style.height = '0'
    })
  }

  return { onEnter, onAfterEnter, onLeave }
}
