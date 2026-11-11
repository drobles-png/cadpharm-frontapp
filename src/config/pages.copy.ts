/**
 * Copy de la página de profesionales, del 404 y del header/footer. El resto de
 * la web informativa vive en info.copy.ts. Los componentes solo pintan.
 */
import type { LeadType } from '@/types'

export const layoutCopy = {
  header: {
    contact: 'Contáctanos',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    home: 'CadPharm, ir al inicio',
    menuNote: '¿Dudas? Escríbenos por WhatsApp',
  },
  footer: {
    claim: 'Laboratorio farmacéutico ecuatoriano. Calidad que inspira confianza.',
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
    secondary: 'Ver composición',
  },
  benefits: {
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
        title: 'Composición declarada',
        text: 'Principios activos con sus cantidades, dosis por edad y notificación sanitaria de cada producto.',
      },
      {
        icon: 'fa-solid fa-handshake',
        title: 'Farmacias y distribuidores',
        text: 'Atendemos farmacias y distribuidores de todo el país. Cuéntanos tu zona y te contactamos.',
      },
    ],
  },
  table: {
    title: 'Nuestro portafolio en una mirada',
    product: 'Producto',
    actives: 'Principios activos',
    presentation: 'Presentación',
    registry: 'NS',
    view: 'Ver composición',
    photoAlt: 'Caja de',
  },
  form: {
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
    messagePlaceholder: 'Cuéntanos qué necesitas: visita médica, muestras o información de producto…',
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

export const notFoundCopy = {
  code: '404',
  title: 'Esta página se fue a descansar',
  text: 'Puede que el enlace esté mal escrito o que la página se haya movido. Te dejamos algunos caminos:',
  home: 'Volver al inicio',
  shop: 'Ver productos',
}
