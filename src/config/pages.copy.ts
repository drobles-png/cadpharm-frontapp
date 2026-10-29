/**
 * Copy de las páginas públicas (catálogo, detalle, profesionales, nosotros, 404)
 * y del header/footer. Los componentes solo pintan.
 */
import type { LeadType } from '@/types'

export const layoutCopy = {
  header: {
    shop: 'Comprar',
    cart: 'Abrir carrito',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    home: 'CadPharm, ir al inicio',
    menuNote: '¿Dudas? Escríbenos por WhatsApp',
  },
  footer: {
    claim: 'Fórmulas desarrolladas en Guayaquil para cuidar a toda tu familia.',
    navTitle: 'Navegación',
    productsTitle: 'Productos',
    // Estático para que el footer no dependa del API.
    products: [
      { slug: 'abcvit-kiddi', label: 'ABCVIT Kiddi' },
      { slug: 'expultox-forte', label: 'EXPULTOX Forte' },
      { slug: 'enzabiox', label: 'Enzabiox' },
      { slug: 'somnycad', label: 'Somnycad' },
    ],
    contactTitle: 'Contacto',
    admin: 'Acceso administración',
    credit: 'Hecho por',
  },
  fab: {
    label: 'Escríbenos por WhatsApp',
    tooltip: '¿Te ayudamos? Escríbenos',
  },
}

export const productsCopy = {
  eyebrow: 'Tienda CadPharm',
  title: 'Nuestros productos',
  text: 'Suplementos de venta libre con notificación sanitaria ARCSA. Envíos a todo el Ecuador.',
  all: 'Todos',
  emptyTitle: 'Aún no tenemos productos en esta categoría',
  emptyText: 'Mira el resto del catálogo o escríbenos y te ayudamos a encontrar lo que buscas.',
  emptyCta: 'Ver todos',
  errorTitle: 'No pudimos cargar el catálogo',
  errorCta: 'Reintentar',
}

export const productCopy = {
  add: 'Agregar',
  added: 'Agregado',
  addToCart: 'Agregar al carrito',
  buyNow: 'Comprar ahora',
  whatsapp: 'Pedir por WhatsApp',
  askPrice: 'Precio por confirmar',
  details: 'Ver detalle',
  quantity: 'Cantidad',
  back: 'Volver a productos',
  registry: 'Notificación sanitaria',
  tabs: {
    benefits: 'Beneficios',
    ingredients: 'Ingredientes',
    dosage: 'Modo de uso',
    nutrition: 'Información nutricional',
    warnings: 'Advertencias',
  },
  activeTitle: 'Principios activos',
  fullIngredients: 'Ingredientes completos',
  serving: 'Porción',
  servings: 'Porciones por envase',
  nutrient: 'Nutriente',
  amount: 'Cantidad',
  vdr: '%VDR',
  storage: 'Conservación',
  proTitle: 'Para profesionales de la salud',
  proText: 'Ficha técnica resumida. Si necesitas muestras médicas o visita, escríbenos.',
  proCta: 'Solicitar visita o muestras',
  proFields: {
    registry: 'Notificación sanitaria (NS)',
    manufacturer: 'Fabricante',
    presentation: 'Presentación',
    barcode: 'Código de barras',
    audience: 'Dirigido a',
  },
  related: 'También te puede interesar',
  notFoundTitle: 'No encontramos este producto',
  notFoundText: 'Puede que el enlace esté mal escrito o que el producto ya no esté disponible.',
  zoomHint: 'Pasa el cursor para ver de cerca',
  whatsappMessage: (name: string) => `Hola CadPharm, quiero pedir ${name}`,
}

export const leadTypes: { value: LeadType; label: string; icon: string }[] = [
  { value: 'medico', label: 'Médico', icon: 'fa-solid fa-user-doctor' },
  { value: 'farmacia', label: 'Farmacia', icon: 'fa-solid fa-prescription-bottle-medical' },
  { value: 'distribuidor', label: 'Distribuidor', icon: 'fa-solid fa-truck-ramp-box' },
  { value: 'paciente', label: 'Paciente', icon: 'fa-solid fa-user' },
]

export const professionalsCopy = {
  hero: {
    eyebrow: 'Profesionales de la salud',
    title: 'Fórmulas que puedes recomendar con confianza',
    text: 'Somos un laboratorio de Guayaquil con productos de venta libre y notificación sanitaria ARCSA. Acompañamos a médicos, farmacias y distribuidores con información clara y atención cercana.',
    cta: 'Solicitar contacto',
    secondary: 'Ver fichas técnicas',
  },
  benefits: {
    eyebrow: 'Lo que te ofrecemos',
    title: 'Un laboratorio cerca de tu consulta',
    items: [
      {
        icon: 'fa-solid fa-user-doctor',
        title: 'Visita médica',
        text: 'Nuestro equipo te visita para presentarte cada fórmula y resolver tus dudas técnicas.',
      },
      {
        icon: 'fa-solid fa-box-open',
        title: 'Muestras médicas',
        text: 'Solicita muestras para que tus pacientes conozcan el producto.',
      },
      {
        icon: 'fa-solid fa-file-medical',
        title: 'Fichas técnicas',
        text: 'Principios activos, dosis por edad, información nutricional y notificación sanitaria.',
      },
      {
        icon: 'fa-solid fa-handshake',
        title: 'Farmacias y distribuidores',
        text: 'Condiciones comerciales para farmacias y distribuidores. Cuéntanos tu zona y volumen.',
      },
    ],
  },
  table: {
    eyebrow: 'Fichas técnicas',
    title: 'Nuestro portafolio en una mirada',
    product: 'Producto',
    actives: 'Principios activos',
    presentation: 'Presentación',
    registry: 'NS',
    view: 'Ver ficha',
  },
  form: {
    eyebrow: 'Hablemos',
    title: 'Déjanos tus datos y te contactamos',
    text: 'Respondemos en horario laboral. También puedes escribirnos directo por WhatsApp.',
    type: 'Soy',
    name: 'Nombre completo',
    specialty: 'Especialidad',
    specialtyPlaceholder: 'Pediatría, medicina general…',
    institution: 'Institución, consultorio o farmacia',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    city: 'Ciudad',
    products: 'Productos de interés',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos qué necesitas: visita, muestras, condiciones…',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    optional: 'opcional',
    successTitle: '¡Gracias! Recibimos tu solicitud',
    successText: 'Nuestro equipo te contactará muy pronto.',
    again: 'Enviar otra solicitud',
    errors: {
      type: 'Elige una opción',
      name: 'Escribe tu nombre',
      email: 'Revisa tu correo',
      phone: 'Escribe un teléfono válido',
      city: 'Escribe tu ciudad',
    },
    fallbackError: 'No pudimos enviar tu solicitud. Intenta de nuevo.',
    whatsappMessage: 'Hola CadPharm, soy profesional de la salud y quiero información',
  },
}

export const aboutCopy = {
  hero: {
    eyebrow: 'Nosotros',
    title: 'Un laboratorio de Guayaquil que cuida a las familias',
    text: 'CadPharm Laboratorio desarrolla suplementos alimenticios pensados para las necesidades reales de las familias ecuatorianas: el apetito y el crecimiento de los niños, la tos con flema, la digestión y el descanso.',
  },
  story: {
    eyebrow: 'Nuestra historia',
    title: 'Hecho en Ecuador, de principio a fin',
    paragraphs: [
      'Nacimos en Guayaquil con una idea sencilla: ofrecer fórmulas confiables, claras y accesibles, que una familia pueda encontrar con facilidad y que un médico pueda recomendar con tranquilidad.',
      'Nuestros productos son elaborados por LabVolpharm S.A.S. en Durán, bajo nuestras especificaciones, y cuentan con notificación sanitaria emitida por la ARCSA.',
    ],
  },
  values: {
    eyebrow: 'Lo que nos mueve',
    title: 'Misión y valores',
    mission:
      'Acompañar el bienestar de las familias ecuatorianas con suplementos de calidad, información honesta y una atención cercana.',
    items: [
      {
        icon: 'fa-solid fa-heart-pulse',
        title: 'Cuidado',
        text: 'Pensamos cada fórmula para el día a día de una familia real.',
      },
      {
        icon: 'fa-solid fa-flask',
        title: 'Rigor',
        text: 'Ingredientes declarados con claridad y dosis indicadas por edad.',
      },
      {
        icon: 'fa-solid fa-eye',
        title: 'Transparencia',
        text: 'Lo que dice el empaque es lo que contiene. Sin promesas exageradas.',
      },
      {
        icon: 'fa-solid fa-people-group',
        title: 'Cercanía',
        text: 'Atendemos a familias, médicos y farmacias de forma directa.',
      },
    ],
  },
  quality: {
    eyebrow: 'Compromiso de calidad',
    title: 'Notificación sanitaria en cada producto',
    text: 'Todos nuestros suplementos cuentan con notificación sanitaria de la Agencia Nacional de Regulación, Control y Vigilancia Sanitaria (ARCSA). Puedes ver el número de cada uno en su empaque y en su ficha.',
    cta: 'Ver productos',
  },
}

export const notFoundCopy = {
  code: '404',
  title: 'Esta página se fue a descansar',
  text: 'Puede que el enlace esté mal escrito o que la página se haya movido. Te dejamos algunos caminos:',
  home: 'Volver al inicio',
  shop: 'Ver productos',
}
