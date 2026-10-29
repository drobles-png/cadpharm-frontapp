import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/order.service'
import { paymentResponseCopy as copy } from '@/config/checkout.copy'
import { PENDING_KEY } from './useCheckout'
import type { ApiError } from '@/types'

type State = 'confirming' | 'paid' | 'failed' | 'pending'

/** Si el componente se monta dos veces (recarga rápida, HMR) no se confirma dos veces. */
const inflight = new Map<string, ReturnType<typeof orderService.confirm>>()

function readPending(): { orderNumber?: string; id?: string } {
  try {
    return JSON.parse(sessionStorage.getItem(PENDING_KEY) || '{}')
  } catch {
    return {}
  }
}

function clearPending() {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    // nada
  }
}

/**
 * Payphone vuelve a /pago/respuesta?id=&clientTransactionId=. Hay que confirmar
 * de inmediato: si pasan 5 minutos sin confirmar, Payphone reversa el cobro.
 * Confirmar es idempotente en el backend, así que una recarga solo vuelve a preguntar.
 */
export function useCheckoutPaymentResponse() {
  const route = useRoute()
  const router = useRouter()
  const cart = useCartStore()

  const state = ref<State>('confirming')
  const message = ref('')
  const orderNumber = ref(readPending().orderNumber || '')

  const id = String(route.query.id ?? '')
  const tx = String(route.query.clientTransactionId ?? '')

  async function confirm() {
    if (!id || !tx || id === '0') {
      // id=0 es lo que manda Payphone cuando el cliente cancela en la Cajita.
      state.value = 'failed'
      message.value = id === '0' ? copy.cancelledText : copy.failedText
      return
    }
    state.value = 'confirming'
    try {
      const key = `${id}:${tx}`
      if (!inflight.has(key)) inflight.set(key, orderService.confirm(id, tx))
      const res = await inflight.get(key)!
      orderNumber.value = res.order.orderNumber
      if (res.status === 'paid') {
        state.value = 'paid'
        cart.clear()
        clearPending()
        router.replace({
          name: 'OrderSuccess',
          params: { orderNumber: res.order.orderNumber },
        })
        return
      }
      inflight.delete(key)
      state.value = res.status === 'pending' ? 'pending' : 'failed'
      message.value =
        res.message || (res.status === 'pending' ? copy.pendingText : copy.failedText)
    } catch (err) {
      inflight.delete(`${id}:${tx}`)
      state.value = 'failed'
      message.value = (err as ApiError)?.message || copy.failedText
    }
  }

  function retry() {
    router.push({ name: 'Checkout' })
  }

  onMounted(confirm)

  return { state, message, orderNumber, confirm, retry }
}
