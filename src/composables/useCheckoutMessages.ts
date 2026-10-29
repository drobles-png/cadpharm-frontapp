import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { CartLine } from '@/stores/cart'
import type { PublicOrder } from '@/services/order.service'

/**
 * Mensajes prellenados de WhatsApp. Se arman en texto plano con saltos de
 * línea: WhatsApp los respeta y el equipo de ventas lee el pedido de un vistazo.
 */

/** Número de WhatsApp: el de la config del API manda; si no llega, el del sitio. */
export function waLink(message: string, number?: string): string {
  const phone = (number || site.whatsapp).replace(/\D/g, '')
  if (!phone) return '#'
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

function lineLabel(name: string, accent: string): string {
  return accent ? `${name} ${accent}` : name
}

export function cartMessage(lines: CartLine[], subtotal: number): string {
  const detail = lines
    .map(
      (l) =>
        `• ${l.quantity} x ${lineLabel(l.name, l.nameAccent)} (${l.presentation}) — ${formatCents(
          l.unitPrice * l.quantity,
        )}`,
    )
    .join('\n')
  return [
    'Hola CadPharm, quiero hacer este pedido:',
    '',
    detail,
    '',
    `Total: ${formatCents(subtotal)}`,
    '',
    '¿Me ayudan a coordinar el pago y la entrega?',
  ].join('\n')
}

export function orderMessage(order: PublicOrder): string {
  const detail = order.items
    .map((i) => `• ${i.quantity} x ${i.name} — ${formatCents(i.subtotal)}`)
    .join('\n')
  return [
    `Hola CadPharm, acabo de hacer el pedido *${order.orderNumber}*.`,
    '',
    detail,
    '',
    `Total: *${formatCents(order.total)}*`,
    `Nombre: ${order.customer.name}`,
    `Ciudad: ${order.customer.city}`,
    '',
    'Quiero coordinar el pago y la entrega.',
  ].join('\n')
}
