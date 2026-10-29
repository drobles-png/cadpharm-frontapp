import APIBase from './httpBase'
import type {
  ConfirmPaymentResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from '@/types'

/** Vista pública de un pedido: lo justo para la página de confirmación. */
export interface PublicOrder {
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
  customer: { name: string; city: string }
}

class OrderService extends APIBase {
  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  /** Payphone reversa el cobro si no se confirma en 5 minutos: llamar apenas vuelve. */
  async confirm(id: string, clientTransactionId: string): Promise<ConfirmPaymentResponse> {
    const { data } = await this.post<ConfirmPaymentResponse>('orders/confirm', {
      id,
      clientTransactionId,
    })
    return data
  }

  async getPublic(orderNumber: string): Promise<PublicOrder> {
    const { data } = await this.get<PublicOrder>(
      `orders/public/${encodeURIComponent(orderNumber)}`,
    )
    return data
  }
}

export const orderService = new OrderService()
