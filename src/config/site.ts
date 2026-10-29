/**
 * El copy es configuración: los textos y datos de la marca viven acá.
 * Los componentes solo consumen y pintan. Cada área puede tener además su
 * propio archivo en src/config/ (home.copy.ts, checkout.copy.ts, ...).
 */
export const site = {
  name: 'CadPharm',
  legalName: 'CadPharm Laboratorio',
  tagline: 'Fórmulas que cuidan a tu familia.',
  description:
    'Laboratorio ecuatoriano de suplementos y fórmulas de venta libre. Hechos en Ecuador, con notificación sanitaria ARCSA.',
  url: 'https://cadpharm.ec',
  email: 'info@cadpharm.ec',
  // Número dictado en la reunión con el cliente: confirmarlo antes de publicar.
  phoneDisplay: '099 383 5978',
  // Solo dígitos con código de país
  whatsapp: '593993835978',
  city: 'Guayaquil, Ecuador',
  manufacturer: 'Elaborado por LabVolpharm S.A.S. (Durán) para CadPharm (Guayaquil).',
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    { label: 'Profesionales', to: '/profesionales' },
    { label: 'Nosotros', to: '/nosotros' },
  ],
  trust: [
    { icon: 'fa-solid fa-shield-heart', label: 'Notificación sanitaria ARCSA' },
    { icon: 'fa-solid fa-flag', label: 'Hecho en Ecuador' },
    { icon: 'fa-solid fa-truck-fast', label: 'Envíos a todo el país' },
    { icon: 'fa-solid fa-lock', label: 'Pago seguro' },
  ],
  categories: [
    {
      key: 'defensas',
      label: 'Crecimiento y defensas',
      icon: 'fa-solid fa-seedling',
      description: 'Vitaminas y minerales para toda la familia.',
    },
    {
      key: 'respiratorio',
      label: 'Respiratorio',
      icon: 'fa-solid fa-lungs',
      description: 'Alivio para la tos con flema, con ingredientes naturales.',
    },
    {
      key: 'digestivo',
      label: 'Digestión',
      icon: 'fa-solid fa-leaf',
      description: 'Enzimas que ayudan a digerir mejor cada comida.',
    },
    {
      key: 'descanso',
      label: 'Descanso',
      icon: 'fa-solid fa-moon',
      description: 'Sueño reparador y menos estrés, de forma natural.',
    },
  ],
  legal: {
    disclaimer:
      'Suplementos alimenticios. No son medicamentos ni sustituyen una alimentación balanceada. Si estás tomando algún medicamento, consulta con tu médico antes de consumirlos. Manténgase fuera del alcance de los niños.',
    copyright: `© ${new Date().getFullYear()} CadPharm Laboratorio. Todos los derechos reservados.`,
  },
} as const

export function whatsappLink(message = 'Hola CadPharm, quiero más información'): string {
  if (!site.whatsapp) return '#'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
