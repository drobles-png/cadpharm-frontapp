/**
 * Copy del flujo de compra: carrito, checkout, pago y confirmación.
 * Los componentes solo pintan lo que hay acá; si cambia un texto, cambia aquí.
 */
import type { OrderCustomer } from '@/types'

export type CustomerField = keyof OrderCustomer

export interface FieldDef {
  key: CustomerField
  label: string
  placeholder: string
  type: 'text' | 'email' | 'tel'
  inputmode?: 'text' | 'email' | 'tel' | 'numeric'
  autocomplete: string
  icon: string
  hint?: string
  optional?: boolean
  multiline?: boolean
  maxlength?: number
  list?: string
}

export const cartCopy = {
  title: 'Tu carrito',
  close: 'Cerrar carrito',
  items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  steps: ['Carrito', 'Tus datos', 'Listo'],
  stepsHint: 'Te falta menos de un minuto para terminar.',
  subtotal: 'Subtotal',
  shippingNote: 'El envío se confirma en el siguiente paso.',
  checkout: 'Finalizar compra',
  whatsapp: 'Pedir por WhatsApp',
  remove: (name: string) => `Quitar ${name} del carrito`,
  increase: 'Agregar uno más',
  decrease: 'Quitar uno',
  quantity: 'Cantidad',
  emptyTitle: 'Tu carrito está esperando',
  emptyText: 'Elige las fórmulas que cuidan a tu familia y vuelve aquí para terminar en un minuto.',
  emptyCta: 'Ver productos',
}

export const checkoutCopy = {
  eyebrow: 'Compra segura',
  title: 'Finalizar compra',
  back: 'Seguir comprando',
  summaryToggle: 'Ver resumen',
  summaryHide: 'Ocultar resumen',
  summaryTitle: 'Tu pedido',
  editCart: 'Editar',
  subtotal: 'Subtotal',
  shipping: 'Envío',
  shippingPending: 'Se confirma contigo',
  total: 'Total',
  secureTitle: 'Pago seguro',
  secureText: 'Tus datos viajan cifrados. No guardamos datos de tu tarjeta.',
  emptyTitle: 'No hay nada para pagar todavía',
  emptyText: 'Agrega productos a tu carrito y vuelve para terminar tu compra.',
  sections: {
    customer: { title: 'Tus datos', subtitle: 'Para enviarte la confirmación.' },
    delivery: { title: 'Entrega', subtitle: '¿A dónde llevamos tu pedido?' },
    payment: { title: 'Pago', subtitle: 'Elige cómo prefieres pagar.' },
  },
  done: 'Listo',
  remembered: 'Usamos los datos de tu última compra.',
  forget: 'No soy yo',
  payWithCard: (total: string) => `Pagar ${total}`,
  sendOrder: (total: string) => `Enviar pedido · ${total}`,
  sending: 'Preparando tu pedido…',
  fixErrors: 'Revisa los campos marcados para continuar.',
  genericError: 'No pudimos crear tu pedido. Intenta de nuevo en un momento.',
}

export const customerFields: FieldDef[] = [
  {
    key: 'name',
    label: 'Nombre y apellido',
    placeholder: 'Ej. María Fernanda Torres',
    type: 'text',
    autocomplete: 'name',
    icon: 'fa-solid fa-user',
    maxlength: 80,
  },
  {
    key: 'email',
    label: 'Correo electrónico',
    placeholder: 'tucorreo@ejemplo.com',
    type: 'email',
    inputmode: 'email',
    autocomplete: 'email',
    icon: 'fa-solid fa-envelope',
    maxlength: 120,
  },
  {
    key: 'phone',
    label: 'Celular',
    placeholder: '09XXXXXXXX',
    type: 'tel',
    inputmode: 'tel',
    autocomplete: 'tel-national',
    icon: 'fa-solid fa-mobile-screen',
    hint: 'Te escribimos solo para coordinar la entrega.',
    maxlength: 16,
  },
  {
    key: 'documentId',
    label: 'Cédula o RUC',
    placeholder: '10 o 13 dígitos',
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'off',
    icon: 'fa-solid fa-id-card',
    hint: 'Para tu factura.',
    maxlength: 13,
  },
]

export const deliveryFields: FieldDef[] = [
  {
    key: 'city',
    label: 'Ciudad',
    placeholder: 'Escribe o elige tu ciudad',
    type: 'text',
    autocomplete: 'address-level2',
    icon: 'fa-solid fa-city',
    list: 'checkout-cities',
    maxlength: 60,
  },
  {
    key: 'address',
    label: 'Dirección',
    placeholder: 'Calle principal, número y calle secundaria',
    type: 'text',
    autocomplete: 'street-address',
    icon: 'fa-solid fa-location-dot',
    maxlength: 200,
  },
  {
    key: 'notes',
    label: 'Referencia',
    placeholder: 'Ej. Casa esquinera de rejas verdes, junto a la farmacia',
    type: 'text',
    autocomplete: 'off',
    icon: 'fa-solid fa-signs-post',
    optional: true,
    multiline: true,
    maxlength: 300,
  },
]

export const validationCopy = {
  required: 'Este campo nos hace falta.',
  name: 'Escribe tu nombre completo.',
  email: 'Revisa tu correo, parece que le falta algo.',
  phone: 'Usa un celular ecuatoriano: 10 dígitos que empiezan con 09.',
  documentId: 'Tu cédula tiene 10 dígitos y el RUC 13.',
  documentChecksum: 'Esta cédula no parece válida. Revisa los números.',
  city: 'Cuéntanos en qué ciudad recibes el pedido.',
  address: 'Agrega un poco más de detalle para que el mensajero llegue.',
  optional: 'Opcional',
}

export const paymentOptions = {
  payphone: {
    title: 'Tarjeta de crédito o débito',
    text: 'Pago inmediato con Payphone. Visa, Mastercard, Diners y más.',
    icon: 'fa-solid fa-credit-card',
    badge: 'Más rápido',
    soon: 'Muy pronto',
  },
  whatsapp: {
    title: 'Coordinar por WhatsApp',
    text: 'Transferencia bancaria o pago contra entrega. Te respondemos enseguida.',
    icon: 'fa-brands fa-whatsapp',
    badge: '',
    soon: '',
  },
}

export const payphoneCopy = {
  title: 'Paga de forma segura',
  subtitle: 'Completa los datos de tu tarjeta. Payphone procesa el pago, CadPharm nunca ve tu tarjeta.',
  order: (n: string) => `Pedido ${n}`,
  expiresIn: 'Esta ventana de pago expira en',
  expiredTitle: 'Tu ventana de pago expiró',
  expiredText: 'Por seguridad el pago dura 10 minutos. Genera uno nuevo, tus datos siguen aquí.',
  retry: 'Generar nuevo pago',
  changeMethod: 'Cambiar método',
  loadError: 'No pudimos cargar la pasarela de pago. Revisa tu conexión e intenta otra vez.',
  reload: 'Reintentar',
  poweredBy: 'Procesado por Payphone',
}

export const successCopy = {
  eyebrow: 'Pedido recibido',
  titlePaid: '¡Pago aprobado!',
  titleWhatsapp: '¡Tu pedido está listo!',
  titleDefault: '¡Gracias por tu compra!',
  orderLabel: 'Número de pedido',
  greeting: (name: string) => `Gracias, ${name.split(' ')[0]}.`,
  nextTitle: 'Lo que sigue',
  nextPaid: [
    'Te enviamos la confirmación a tu correo.',
    'Preparamos tu pedido en las próximas horas.',
    'Te escribimos por WhatsApp con el seguimiento del envío.',
  ],
  nextWhatsapp: [
    'Envíanos el pedido por WhatsApp con el botón de abajo.',
    'Te confirmamos el total con envío y la forma de pago.',
    'Despachamos apenas coordinemos contigo.',
  ],
  whatsappCta: 'Enviar pedido por WhatsApp',
  whatsappHelp: 'Ayuda por WhatsApp',
  keepShopping: 'Seguir comprando',
  summary: 'Resumen',
  deliverTo: (city: string) => `Entrega en ${city}`,
  notFound: 'No encontramos este pedido. Si acabas de comprar, escríbenos por WhatsApp y lo revisamos.',
}

export const paymentResponseCopy = {
  confirming: 'Confirmando tu pago…',
  confirmingText: 'Esto toma unos segundos. No cierres esta ventana.',
  failedTitle: 'El pago no se completó',
  failedText: 'No se hizo ningún cobro. Puedes intentarlo otra vez o terminar tu pedido por WhatsApp.',
  cancelledText: 'Cancelaste el pago. Tu carrito sigue intacto para cuando quieras.',
  pendingTitle: 'Tu pago está en revisión',
  pendingText: 'Payphone aún no nos confirma el pago. Verifica de nuevo en unos segundos.',
  checkAgain: 'Verificar de nuevo',
  retry: 'Intentar de nuevo',
  whatsapp: 'Terminar por WhatsApp',
  whatsappMessage: (orderNumber: string) =>
    `Hola CadPharm, tuve un problema al pagar mi pedido ${orderNumber}. ¿Me ayudan?`,
}

/** Ciudades principales para el datalist; se puede escribir cualquier otra. */
export const ecuadorCities = [
  'Guayaquil',
  'Quito',
  'Cuenca',
  'Santo Domingo',
  'Machala',
  'Durán',
  'Manta',
  'Portoviejo',
  'Loja',
  'Ambato',
  'Esmeraldas',
  'Quevedo',
  'Riobamba',
  'Milagro',
  'Ibarra',
  'La Libertad',
  'Babahoyo',
  'Sangolquí',
  'Daule',
  'Samborondón',
  'Latacunga',
  'Salinas',
  'Santa Elena',
  'Playas',
  'Tulcán',
  'Chone',
  'Pasaje',
  'Huaquillas',
  'El Carmen',
  'Montecristi',
  'Nueva Loja',
  'Puyo',
  'Tena',
  'Macas',
  'Azogues',
  'Guaranda',
  'Zamora',
  'Francisco de Orellana',
  'Otavalo',
  'Cayambe',
  'Galápagos',
]
