/**
 * Copy del panel de administración. Quien lo opera no es técnico: cada texto
 * explica qué pasa en palabras de tienda, no de sistema.
 */
import type { LeadStatus, LeadType, OrderStatus, ProductCategory } from '@/types'

/** Tonos de las pills: cada uno mapea a un color de estado en AdminPill. */
export type PillTone = 'warning' | 'info' | 'blue' | 'success' | 'muted' | 'danger'

export const adminBrand = {
  name: 'CadPharm',
  accent: 'Laboratorio',
  panel: 'Panel',
}

export const loginCopy = {
  brandTitle: 'Todo tu laboratorio, en un solo lugar.',
  brandText: 'Pedidos, productos y mensajes de médicos y farmacias, al día y sin complicaciones.',
  brandPoints: [
    { icon: 'fa-solid fa-bag-shopping', label: 'Pedidos al instante' },
    { icon: 'fa-solid fa-capsules', label: 'Catálogo siempre actualizado' },
    { icon: 'fa-solid fa-user-doctor', label: 'Contactos de profesionales' },
  ],
  eyebrow: 'Acceso al panel',
  title: 'Hola de nuevo',
  subtitle: 'Ingresa con tu correo y contraseña de administrador.',
  email: 'Correo',
  emailPlaceholder: 'tu@cadpharm.ec',
  password: 'Contraseña',
  show: 'Mostrar contraseña',
  hide: 'Ocultar contraseña',
  remember: 'Recordar mi correo',
  submit: 'Ingresar',
  submitting: 'Ingresando',
  backToStore: 'Volver a la tienda',
  notAdmin: 'Esta cuenta no tiene acceso al panel.',
  welcome: (name: string) => `Hola, ${name}`,
}

export const navCopy = {
  items: [
    { to: '/admin', label: 'Panel', icon: 'fa-solid fa-chart-simple', badge: '' },
    { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-bag-shopping', badge: 'orders' },
    { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-capsules', badge: '' },
    { to: '/admin/mensajes', label: 'Mensajes', icon: 'fa-solid fa-envelope', badge: 'leads' },
  ],
  store: 'Ver tienda',
  adminFallback: 'Administrador',
  logout: 'Cerrar sesión',
  menu: 'Abrir menú',
  close: 'Cerrar menú',
  loggedOut: 'Sesión cerrada',
  greeting(name: string, hour: number) {
    const part = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
    return name ? `${part}, ${name.split(' ')[0]}` : part
  },
}

export const dashboardCopy = {
  title: 'Resumen del mes',
  subtitle: 'Cómo va la tienda este mes, de un vistazo.',
  kpis: {
    revenue: 'Ingresos del mes',
    orders: 'Pedidos del mes',
    ticket: 'Ticket promedio',
    pending: 'Pedidos por atender',
    leads: 'Mensajes nuevos',
  },
  vsPrev: 'vs. mes anterior',
  noPrev: 'Primer mes con ventas',
  chartTitle: 'Ventas de los últimos 30 días',
  chartOrders: (n: number) => (n === 1 ? '1 pedido' : `${n} pedidos`),
  topTitle: 'Productos más vendidos',
  topUnits: (n: number) => (n === 1 ? '1 unidad' : `${n} unidades`),
  recentTitle: 'Pedidos recientes',
  seeAll: 'Ver todos',
  emptyTitle: 'Todavía no hay ventas',
  emptyText: 'Cuando entre el primer pedido, aquí verás cómo crece la tienda día a día.',
  emptyCta: 'Revisar productos',
  emptyTop: 'Aún no hay productos vendidos este mes.',
  emptyRecent: 'Aún no hay pedidos.',
}

export const orderStatus: Record<OrderStatus, { label: string; tone: PillTone; icon: string }> = {
  pending: { label: 'Pendiente', tone: 'warning', icon: 'fa-solid fa-hourglass-half' },
  paid: { label: 'Pagado', tone: 'info', icon: 'fa-solid fa-credit-card' },
  confirmed: { label: 'Confirmado', tone: 'blue', icon: 'fa-solid fa-clipboard-check' },
  shipped: { label: 'Enviado', tone: 'info', icon: 'fa-solid fa-truck-fast' },
  delivered: { label: 'Entregado', tone: 'success', icon: 'fa-solid fa-house-circle-check' },
  cancelled: { label: 'Cancelado', tone: 'muted', icon: 'fa-solid fa-ban' },
  failed: { label: 'Pago fallido', tone: 'danger', icon: 'fa-solid fa-circle-xmark' },
}

/** Siguiente paso natural de cada estado; los que no aparecen ya terminaron. */
export const orderNextStep: Partial<Record<OrderStatus, { to: OrderStatus; label: string; hint: string }>> = {
  pending: { to: 'confirmed', label: 'Confirmar pedido', hint: 'Ya hablaste con el cliente y el pedido sigue en pie.' },
  paid: { to: 'confirmed', label: 'Confirmar pedido', hint: 'El pago entró: confirma para prepararlo.' },
  confirmed: { to: 'shipped', label: 'Marcar como enviado', hint: 'El paquete ya salió hacia el cliente.' },
  shipped: { to: 'delivered', label: 'Marcar como entregado', hint: 'El cliente ya recibió su pedido.' },
}

export const ordersCopy = {
  title: 'Pedidos',
  subtitle: 'Todo lo que han comprado tus clientes, del más nuevo al más antiguo.',
  search: 'Buscar por número, nombre, correo o teléfono',
  clear: 'Borrar búsqueda',
  all: 'Todos',
  cols: { number: 'Pedido', customer: 'Cliente', date: 'Fecha', payment: 'Pago', total: 'Total', status: 'Estado' },
  payment: { payphone: 'Tarjeta (Payphone)', whatsapp: 'WhatsApp' } as Record<string, string>,
  items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  emptyTitle: 'No hay pedidos aquí',
  emptyText: 'Prueba con otro filtro o borra la búsqueda.',
  prev: 'Anterior',
  next: 'Siguiente',
  pageOf: (page: number, pages: number) => `Página ${page} de ${pages}`,
}

export const orderDetailCopy = {
  back: 'Volver a pedidos',
  customer: 'Cliente',
  document: 'Cédula / RUC',
  city: 'Ciudad',
  address: 'Dirección',
  notes: 'Notas del cliente',
  whatsapp: 'Escribir por WhatsApp',
  call: 'Llamar',
  email: 'Enviar correo',
  waMessage: (name: string, number: string) =>
    `Hola ${name.split(' ')[0]}, te escribimos de CadPharm por tu pedido ${number}. `,
  items: 'Productos',
  subtotal: 'Subtotal',
  shipping: 'Envío',
  shippingFree: 'Gratis',
  total: 'Total',
  paymentMethod: 'Método de pago',
  transaction: 'Transacción',
  payphone: 'Respuesta de Payphone',
  payphoneHint: 'Datos técnicos del pago, por si soporte los pide.',
  timeline: 'Historial',
  nextTitle: 'Siguiente paso',
  done: 'Este pedido ya terminó su recorrido.',
  cancel: 'Cancelar pedido',
  cancelTitle: '¿Cancelar este pedido?',
  cancelMessage: 'El cliente dejará de verlo como activo. Esta acción no se puede deshacer.',
  cancelConfirm: 'Sí, cancelar',
  cancelKeep: 'No, mantenerlo',
  note: 'Nota (opcional)',
  notePlaceholder: 'Ej.: el cliente pidió cambiar la dirección',
  updated: (label: string) => `Pedido actualizado: ${label}`,
  notFound: 'No encontramos este pedido.',
}

export const productsCopy = {
  title: 'Productos',
  subtitle: 'Lo que ves aquí es lo que se muestra en la tienda.',
  add: 'Nuevo producto',
  published: 'Publicado',
  hidden: 'Oculto',
  featured: 'Destacado',
  stock: 'Stock',
  order: 'Orden',
  noPrice: 'Por confirmar',
  edit: 'Editar',
  nowPublished: (name: string) => `${name} ya se ve en la tienda`,
  nowHidden: (name: string) => `${name} quedó oculto`,
  emptyTitle: 'Aún no hay productos',
  emptyText: 'Crea el primero para empezar a vender.',
}

export const categories: { value: ProductCategory; label: string }[] = [
  { value: 'defensas', label: 'Crecimiento y defensas' },
  { value: 'respiratorio', label: 'Respiratorio' },
  { value: 'digestivo', label: 'Digestión' },
  { value: 'descanso', label: 'Descanso' },
]

export const productFormCopy = {
  newTitle: 'Nuevo producto',
  back: 'Volver a productos',
  sections: [
    { id: 'basico', label: 'Básico', icon: 'fa-solid fa-pen' },
    { id: 'colores', label: 'Colores', icon: 'fa-solid fa-palette' },
    { id: 'imagenes', label: 'Imágenes', icon: 'fa-solid fa-images' },
    { id: 'contenido', label: 'Contenido', icon: 'fa-solid fa-list-check' },
    { id: 'nutricion', label: 'Nutrición', icon: 'fa-solid fa-table-list' },
    { id: 'registro', label: 'Registro', icon: 'fa-solid fa-stamp' },
  ],
  fields: {
    name: 'Nombre',
    nameAccent: 'Segunda línea del nombre',
    nameAccentHint: 'La palabra que va resaltada, como "Kiddi" o "Forte".',
    tagline: 'Frase corta',
    description: 'Descripción',
    category: 'Categoría',
    categoryLabel: 'Etiqueta de categoría',
    categoryLabelHint: 'Cómo se lee la categoría en la tienda.',
    presentation: 'Presentación',
    presentationHint: 'Ej.: Frasco de 120 ml',
    price: 'Precio (USD)',
    priceHint: 'Déjalo vacío si el precio aún está por confirmar.',
    stock: 'Stock',
    order: 'Orden en la tienda',
    orderHint: 'Los números más bajos salen primero.',
    isPublished: 'Visible en la tienda',
    featured: 'Destacado en el inicio',
    primary: 'Color principal',
    secondary: 'Color secundario',
    ink: 'Color de texto',
    previewLabel: 'Así se verá la tarjeta',
    drop: 'Arrastra fotos aquí o toca para elegirlas',
    dropHint: 'JPG, PNG o WEBP. La primera foto es la portada.',
    uploading: 'Subiendo foto',
    manualUrl: 'O pega la dirección de una imagen',
    addUrl: 'Agregar',
    cover: 'Portada',
    cutout: 'Foto sin fondo (opcional)',
    cutoutHint: 'PNG transparente para el inicio y animaciones.',
    highlights: 'Puntos clave',
    benefits: 'Beneficios',
    warnings: 'Advertencias',
    activeIngredients: 'Principios activos',
    ingredientName: 'Ingrediente',
    ingredientAmount: 'Cantidad',
    dosage: 'Dosis',
    dosageWho: 'Para quién',
    dosageDose: 'Cuánto',
    ingredients: 'Ingredientes',
    storage: 'Conservación',
    serving: 'Porción',
    servingsPerPack: 'Porciones por envase',
    nutritionRows: 'Tabla nutricional',
    rowName: 'Nutriente',
    rowAmount: 'Cantidad',
    rowVdr: '% VDR',
    sanitaryRegistry: 'Notificación sanitaria (ARCSA)',
    barcode: 'Código de barras',
    audience: 'Público',
    manufacturer: 'Fabricante',
  },
  addItem: 'Agregar',
  addRow: 'Agregar fila',
  remove: 'Quitar',
  moveUp: 'Subir',
  moveDown: 'Bajar',
  save: 'Guardar cambios',
  create: 'Crear producto',
  saving: 'Guardando',
  dirty: 'Tienes cambios sin guardar',
  clean: 'Todo guardado',
  saved: 'Producto guardado',
  created: 'Producto creado',
  delete: 'Eliminar producto',
  deleteTitle: '¿Eliminar este producto?',
  deleteMessage: 'Desaparecerá de la tienda y del panel. Si solo quieres esconderlo, desactiva "Visible en la tienda".',
  deleteConfirm: 'Sí, eliminar',
  deleted: 'Producto eliminado',
  leaveTitle: '¿Salir sin guardar?',
  leaveMessage: 'Los cambios que hiciste en este producto se perderán.',
  leaveConfirm: 'Salir sin guardar',
  leaveCancel: 'Seguir editando',
  uploadUnavailable: 'La subida de fotos no está disponible: pega la dirección de la imagen abajo.',
  imageAdded: 'Foto agregada',
  invalidUrl: 'Esa dirección no parece una imagen válida.',
  nameRequired: 'El producto necesita un nombre.',
}

export const leadType: Record<LeadType, { label: string; icon: string }> = {
  medico: { label: 'Médico', icon: 'fa-solid fa-user-doctor' },
  farmacia: { label: 'Farmacia', icon: 'fa-solid fa-prescription-bottle-medical' },
  distribuidor: { label: 'Distribuidor', icon: 'fa-solid fa-truck-ramp-box' },
  paciente: { label: 'Paciente', icon: 'fa-solid fa-user' },
}

export const leadStatus: Record<LeadStatus, { label: string; tone: PillTone }> = {
  new: { label: 'Nuevo', tone: 'warning' },
  contacted: { label: 'Contactado', tone: 'info' },
  closed: { label: 'Cerrado', tone: 'success' },
}

export const leadsCopy = {
  title: 'Mensajes',
  subtitle: 'Médicos, farmacias y distribuidores que quieren trabajar con CadPharm.',
  allTypes: 'Todos los tipos',
  allStatus: 'Todos',
  specialty: 'Especialidad',
  institution: 'Institución',
  email: 'Correo',
  phone: 'Teléfono',
  city: 'Ciudad',
  message: 'Mensaje',
  products: 'Productos de interés',
  received: 'Recibido',
  note: 'Nota interna',
  notePlaceholder: 'Solo la ve tu equipo. Ej.: llamar el lunes, pidió muestras.',
  saveNote: 'Guardar nota',
  noteSaved: 'Nota guardada',
  status: 'Estado',
  statusChanged: (label: string) => `Marcado como ${label.toLowerCase()}`,
  whatsapp: 'WhatsApp',
  email_cta: 'Correo',
  waMessage: (name: string) => `Hola ${name.split(' ')[0]}, te escribimos de CadPharm por tu mensaje. `,
  emailSubject: 'CadPharm: respuesta a tu mensaje',
  close: 'Cerrar',
  emptyTitle: 'No hay mensajes aquí',
  emptyText: 'Cuando un médico o farmacia escriba desde la web, aparecerá en esta lista.',
}

/** Teléfono de Ecuador a formato wa.me: 0991234567 → 593991234567. */
export function toWaNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.startsWith('593')) return digits
  if (digits.startsWith('0')) return `593${digits.slice(1)}`
  return digits.length === 9 ? `593${digits}` : digits
}

export function waLink(phone: string, message: string): string {
  return `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(message)}`
}
