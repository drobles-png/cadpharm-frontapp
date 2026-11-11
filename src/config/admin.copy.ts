/**
 * Copy del panel de administración. Quien lo opera no es técnico: cada texto
 * explica qué pasa en palabras del día a día, no de sistema.
 */
import type { LeadStatus, LeadType, ProductCategory } from '@/types'

/** Tonos de las pills: cada uno mapea a un color de estado en AdminPill. */
export type PillTone = 'warning' | 'info' | 'blue' | 'success' | 'muted' | 'danger'

export const adminBrand = {
  name: 'CadPharm',
  accent: 'Laboratorio',
  panel: 'Panel',
}

export const loginCopy = {
  brandTitle: 'Todo tu laboratorio, en un solo lugar.',
  brandText: 'Productos y mensajes de médicos y farmacias, al día y sin complicaciones.',
  brandPoints: [
    { icon: 'fa-solid fa-capsules', label: 'Catálogo siempre actualizado' },
    { icon: 'fa-solid fa-envelope-open-text', label: 'Mensajes al instante' },
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
  backToStore: 'Volver al sitio web',
  notAdmin: 'Esta cuenta no tiene acceso al panel.',
  welcome: (name: string) => `Hola, ${name}`,
}

export const navCopy = {
  items: [
    { to: '/admin', label: 'Panel', icon: 'fa-solid fa-chart-simple', badge: '' },
    { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-capsules', badge: '' },
    { to: '/admin/mensajes', label: 'Mensajes', icon: 'fa-solid fa-envelope', badge: 'leads' },
  ],
  store: 'Ver sitio web',
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
  title: 'Resumen',
  subtitle: 'Cómo están tu catálogo y los mensajes de profesionales, de un vistazo.',
  kpis: {
    published: 'Productos publicados',
    publishedOf: (total: number) => (total === 1 ? 'de 1 producto' : `de ${total} productos`),
    featured: 'Destacados en el inicio',
    newLeads: 'Mensajes por responder',
    totalLeads: 'Mensajes recibidos',
  },
  actionsTitle: 'Accesos rápidos',
  actions: [
    { to: '/admin/productos/nuevo', label: 'Nuevo producto', text: 'Agrega un producto al catálogo.', icon: 'fa-solid fa-plus' },
    { to: '/admin/productos', label: 'Productos', text: 'Edita fichas, fotos y visibilidad.', icon: 'fa-solid fa-capsules' },
    { to: '/admin/mensajes', label: 'Mensajes', text: 'Responde a médicos y farmacias.', icon: 'fa-solid fa-envelope' },
  ],
  recentTitle: 'Últimos mensajes',
  seeAll: 'Ver todos',
  emptyRecent: 'Aún no llegan mensajes desde la web.',
}

/** Paginación compartida por las listas del panel. */
export const paginationCopy = {
  prev: 'Anterior',
  next: 'Siguiente',
  pageOf: (page: number, pages: number) => `Página ${page} de ${pages}`,
}

export const productsCopy = {
  title: 'Productos',
  subtitle: 'Lo que ves aquí es lo que se muestra en la web.',
  add: 'Nuevo producto',
  published: 'Publicado',
  hidden: 'Oculto',
  featured: 'Destacado',
  order: 'Orden',
  edit: 'Editar',
  nowPublished: (name: string) => `${name} ya se ve en la web`,
  nowHidden: (name: string) => `${name} quedó oculto`,
  emptyTitle: 'Aún no hay productos',
  emptyText: 'Crea el primero para mostrarlo en la web.',
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
    categoryLabelHint: 'Cómo se lee la categoría en la web.',
    presentation: 'Presentación',
    presentationHint: 'Ej.: Frasco de 120 ml',
    order: 'Orden en la web',
    orderHint: 'Los números más bajos salen primero.',
    isPublished: 'Visible en la web',
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
  deleteMessage: 'Desaparecerá de la web y del panel. Si solo quieres esconderlo, desactiva "Visible en la web".',
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
