import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { OrderCustomer, PayphoneBoxConfig } from '@/types'

const CDN = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box'
export const PAYPHONE_CONTAINER = 'pp-button'
/** La Cajita deja de servir pasados 10 minutos: se cuenta en pantalla. */
const WINDOW_SECONDS = 10 * 60

let assetsPromise: Promise<void> | null = null

function waitForGlobal(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (window.PPaymentButtonBox) return resolve()
      if (Date.now() - start > timeoutMs) return reject(new Error('payphone-timeout'))
      setTimeout(tick, 60)
    }
    tick()
  })
}

/**
 * Carga el CSS y el JS de la Cajita una sola vez por sesión. Si falla, se
 * olvida la promesa para que "Reintentar" vuelva a pedir los archivos.
 */
function loadAssets(): Promise<void> {
  if (window.PPaymentButtonBox) return Promise.resolve()
  if (assetsPromise) return assetsPromise

  assetsPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CDN}.css"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `${CDN}.css`
      document.head.appendChild(link)
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CDN}.js"]`)
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.type = 'module'
    script.src = `${CDN}.js`
    script.onload = () => waitForGlobal().then(resolve, reject)
    script.onerror = () => reject(new Error('payphone-load'))
    document.head.appendChild(script)
  }).catch((err) => {
    assetsPromise = null
    throw err
  })
  return assetsPromise
}

/** Payphone espera el celular en formato internacional: +593 sin el 0. */
function intlPhone(phone: string): string {
  return `+593${phone.replace(/^0/, '')}`
}

export function usePayphone() {
  const ready = ref(false)
  const failed = ref(false)
  const secondsLeft = ref(WINDOW_SECONDS)
  const expired = computed(() => secondsLeft.value <= 0)
  let timer: ReturnType<typeof setInterval> | null = null
  let observer: MutationObserver | null = null

  const countdown = computed(() => {
    const s = Math.max(secondsLeft.value, 0)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  })

  function stop() {
    if (timer) clearInterval(timer)
    timer = null
    observer?.disconnect()
    observer = null
  }

  function startCountdown() {
    const deadline = Date.now() + WINDOW_SECONDS * 1000
    secondsLeft.value = WINDOW_SECONDS
    // Se calcula contra la hora límite: si la pestaña duerme, al volver no se atrasa.
    timer = setInterval(() => {
      secondsLeft.value = Math.round((deadline - Date.now()) / 1000)
      if (secondsLeft.value <= 0) stop()
    }, 1000)
  }

  /** La Cajita pinta su formulario de forma asíncrona: el skeleton se va cuando aparece. */
  function watchContainer(el: HTMLElement) {
    if (el.childElementCount > 0) {
      ready.value = true
      return
    }
    observer = new MutationObserver(() => {
      if (el.childElementCount > 0) {
        ready.value = true
        observer?.disconnect()
      }
    })
    observer.observe(el, { childList: true })
  }

  async function mount(box: PayphoneBoxConfig, customer: OrderCustomer) {
    stop()
    ready.value = false
    failed.value = false
    try {
      await loadAssets()
      await nextTick()
      const el = document.getElementById(PAYPHONE_CONTAINER)
      if (!el || !window.PPaymentButtonBox) throw new Error('payphone-container')
      el.innerHTML = ''
      watchContainer(el)
      new window.PPaymentButtonBox({
        token: box.token,
        clientTransactionId: box.clientTransactionId,
        amount: box.amount,
        amountWithoutTax: box.amountWithoutTax,
        currency: 'USD',
        storeId: box.storeId,
        reference: box.reference,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
        email: customer.email,
        phoneNumber: intlPhone(customer.phone),
        documentId: customer.documentId,
      }).render(PAYPHONE_CONTAINER)
      startCountdown()
    } catch {
      failed.value = true
    }
  }

  onBeforeUnmount(stop)

  return { ready, failed, expired, countdown, secondsLeft, mount, stop }
}
