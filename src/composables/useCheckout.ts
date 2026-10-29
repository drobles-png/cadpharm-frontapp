import { nextTick, onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { orderService } from '@/services/order.service'
import { checkoutCopy } from '@/config/checkout.copy'
import { useCheckoutForm } from './useCheckoutForm'
import type { ApiError, Order, PaymentMethod, PayphoneBoxConfig, PublicConfig } from '@/types'

/** Pedido Payphone en curso: /pago/respuesta lo usa si Payphone vuelve sin datos. */
export const PENDING_KEY = 'cadpharm_pending_payment'

export interface PayphoneSession {
  order: Order
  box: PayphoneBoxConfig
}

/**
 * Orquesta la página de checkout: config pública, método de pago, envío del
 * pedido y el paso a la Cajita de Payphone. El formulario vive en useCheckoutForm.
 */
export function useCheckout() {
  const cart = useCartStore()
  const toast = useToastStore()
  const router = useRouter()
  const form = useCheckoutForm()

  const config = ref<PublicConfig | null>(null)
  const configLoading = ref(true)
  const method = ref<PaymentMethod>('whatsapp')
  const submitting = ref(false)
  const formError = ref('')
  const payphone = shallowRef<PayphoneSession | null>(null)

  onMounted(async () => {
    try {
      config.value = await orderService.getConfig()
      if (config.value.payphoneEnabled) method.value = 'payphone'
    } catch {
      // Sin config se puede comprar igual: WhatsApp no depende del API de pagos.
      config.value = null
    } finally {
      configLoading.value = false
    }
  })

  function focusField(field: string) {
    nextTick(() => {
      const el = document.getElementById(`checkout-${field}`)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  async function submit() {
    if (submitting.value || cart.isEmpty) return
    formError.value = ''
    const firstError = form.validateAll()
    if (firstError) {
      formError.value = checkoutCopy.fixErrors
      focusField(firstError)
      return
    }

    submitting.value = true
    try {
      const customer = form.payload()
      const res = await orderService.create({
        items: cart.lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        customer,
        paymentMethod: method.value,
      })
      form.remember()

      if (method.value === 'payphone' && res.payphone) {
        // El carrito NO se vacía todavía: si el pago falla, el cliente reintenta sin rearmarlo.
        try {
          sessionStorage.setItem(
            PENDING_KEY,
            JSON.stringify({ orderNumber: res.order.orderNumber, id: res.order._id }),
          )
        } catch {
          // sin sessionStorage la confirmación igual funciona con los parámetros de la URL
        }
        payphone.value = { order: res.order, box: res.payphone }
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Se vacía cuando la vista ya salió: así no parpadea el estado "carrito vacío".
      await router.push({ name: 'OrderSuccess', params: { orderNumber: res.order.orderNumber } })
      setTimeout(() => cart.clear(), 400)
    } catch (err) {
      const message = (err as ApiError)?.message || checkoutCopy.genericError
      formError.value = message
      toast.error(message)
    } finally {
      submitting.value = false
    }
  }

  /** Vuelve al formulario; el pedido pendiente queda en el panel como no pagado. */
  function changeMethod() {
    payphone.value = null
    if (config.value?.payphoneEnabled) method.value = 'whatsapp'
  }

  /** La ventana de pago expiró: se crea un pedido nuevo con los mismos datos. */
  async function retryPayphone() {
    payphone.value = null
    method.value = 'payphone'
    await nextTick()
    await submit()
  }

  return {
    form,
    config,
    configLoading,
    method,
    submitting,
    formError,
    payphone,
    submit,
    changeMethod,
    retryPayphone,
  }
}
