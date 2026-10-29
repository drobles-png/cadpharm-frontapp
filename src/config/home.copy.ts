/**
 * Copy del home. Los componentes de src/components/home solo pintan esto.
 * Nada de cifras inventadas: lo único numérico sale del empaque (vía API).
 */

export interface HeroWord {
  text: string
  /** Se pinta con el degradado de marca. */
  accent?: boolean
}

export interface ShowcaseItem {
  /** Si trae slug, la pieza es un link a su producto; sin slug es decoración. */
  slug?: string
  src: string
  alt: string
  x: number
  y: number
  w: number
  rotate: number
  depth: number
  /** Capa de fondo: más chica, algo desenfocada, da profundidad. */
  back?: boolean
}

/** Segunda pieza (frasco o blíster) que acompaña a cada producto en el storytelling. */
export const storyLayers: Record<string, string> = {
  'abcvit-kiddi': '/img/cutouts/abcvit-kiddi-frasco.png',
  'expultox-forte': '/img/cutouts/expultox-forte-frasco.png',
  enzabiox: '/img/cutouts/enzabiox-blister.png',
  somnycad: '/img/cutouts/somnycad-blister.png',
}

export const homeCopy = {
  hero: {
    eyebrow: 'Laboratorio ecuatoriano · Guayaquil',
    title: [
      { text: 'Fórmulas' },
      { text: 'que' },
      { text: 'cuidan', accent: true },
      { text: 'a' },
      { text: 'toda' },
      { text: 'tu' },
      { text: 'familia.', accent: true },
    ] as HeroWord[],
    subtitle:
      'Suplementos desarrollados en Ecuador para el apetito de los peques, la tos con flema, una mejor digestión y un sueño reparador. Pide en línea y recíbelos en casa.',
    primaryCta: { label: 'Comprar ahora', to: '/productos' },
    secondaryCta: { label: 'Soy profesional de la salud', to: '/profesionales' },
    chips: [
      { icon: 'fa-solid fa-shield-heart', label: 'Notificación ARCSA' },
      { icon: 'fa-solid fa-location-dot', label: 'Hecho en Ecuador' },
      { icon: 'fa-solid fa-truck-fast', label: 'Envíos a todo el país' },
    ],
    scrollHint: 'Desliza para conocerlos',
    // Estático a propósito: el hero no espera al API para verse completo.
    // x/y/w en % del escenario; depth multiplica el parallax del mouse.
    showcase: [
      {
        src: '/img/cutouts/somnycad-blister.png',
        alt: '',
        x: 58,
        y: 0,
        w: 24,
        rotate: 18,
        depth: 0.35,
        back: true,
      },
      {
        src: '/img/cutouts/expultox-forte-frasco.png',
        alt: '',
        x: 1,
        y: 30,
        w: 11,
        rotate: -12,
        depth: 0.5,
        back: true,
      },
      {
        src: '/img/cutouts/abcvit-kiddi-frasco.png',
        alt: '',
        x: 77,
        y: 22,
        w: 12,
        rotate: 10,
        depth: 0.6,
        back: true,
      },
      {
        slug: 'abcvit-kiddi',
        src: '/img/cutouts/abcvit-kiddi.png',
        alt: 'Caja de ABCVIT Kiddi, multivitamínico en jarabe',
        x: 13,
        y: 9,
        w: 21,
        rotate: -7,
        depth: 1,
      },
      {
        slug: 'expultox-forte',
        src: '/img/cutouts/expultox-forte.png',
        alt: 'Caja de EXPULTOX Forte, jarabe expectorante',
        x: 39,
        y: 19,
        w: 21,
        rotate: 5,
        depth: 1.2,
      },
      {
        slug: 'enzabiox',
        src: '/img/cutouts/enzabiox.png',
        alt: 'Caja de Enzabiox, enzimas digestivas en cápsulas',
        x: 5,
        y: 61,
        w: 38,
        rotate: 8,
        depth: 1.4,
      },
      {
        slug: 'somnycad',
        src: '/img/cutouts/somnycad.png',
        alt: 'Caja de Somnycad, cápsulas para dormir mejor',
        x: 50,
        y: 63,
        w: 42,
        rotate: -7,
        depth: 1.6,
      },
    ] as ShowcaseItem[],
  },

  ingredients: [
    'Lisina',
    'Zinc',
    'Betaglucano',
    'Propóleo',
    'N-Acetilcisteína',
    'Jengibre',
    'Enzimas digestivas',
    'Pancreatina',
    'Passiflora',
    'Valeriana',
    'Melatonina',
    'Vitamina C',
  ],

  products: {
    eyebrow: 'Nuestros productos',
    title: 'Cuatro fórmulas, una misma promesa',
    text: 'Cada producto nace de una necesidad real de las familias ecuatorianas. Elige el tuyo y te lo llevamos.',
    cta: 'Ver todo el catálogo',
  },

  story: {
    eyebrow: 'Conócelos de cerca',
    title: 'Lo que hay dentro importa',
    statsLabel: 'Por porción',
    cta: 'Ver producto',
  },

  needs: {
    eyebrow: 'Encuentra por necesidad',
    title: '¿Qué necesitas hoy?',
    cta: 'Ver gama',
  },

  professionals: {
    eyebrow: 'Para profesionales de la salud',
    title: 'Trabajemos juntos por tus pacientes',
    text: 'Médicos, farmacias y distribuidores: tenemos visita médica, muestras y toda la información técnica que necesitas para recomendar con confianza.',
    items: [
      {
        icon: 'fa-solid fa-user-doctor',
        title: 'Visita médica',
        text: 'Te presentamos cada fórmula en tu consultorio.',
      },
      {
        icon: 'fa-solid fa-box-open',
        title: 'Muestras médicas',
        text: 'Para que tus pacientes prueben antes de comprar.',
      },
      {
        icon: 'fa-solid fa-file-medical',
        title: 'Fichas técnicas',
        text: 'Principios activos, dosis y notificación sanitaria.',
      },
      {
        icon: 'fa-solid fa-store',
        title: 'Distribución a farmacias',
        text: 'Condiciones especiales para farmacias y distribuidores.',
      },
    ],
    cta: 'Quiero que me contacten',
  },

  steps: {
    eyebrow: 'Comprar es así de fácil',
    title: 'Tres pasos y listo',
    items: [
      {
        icon: 'fa-solid fa-hand-pointer',
        title: 'Elige',
        text: 'Agrega tus productos al carrito con un toque.',
      },
      {
        icon: 'fa-solid fa-credit-card',
        title: 'Paga en línea o por WhatsApp',
        text: 'Con tarjeta de forma segura, o coordina tu pedido por chat.',
      },
      {
        icon: 'fa-solid fa-house-chimney',
        title: 'Recíbelo en casa',
        text: 'Hacemos envíos a todo el Ecuador.',
      },
    ],
    cta: 'Empezar a comprar',
  },

  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Resolvemos tus dudas',
    items: [
      {
        q: '¿Hacen envíos a todo el país?',
        a: 'Sí. Enviamos a todo el Ecuador. Al finalizar tu compra te confirmamos el costo y el tiempo de entrega según tu ciudad.',
      },
      {
        q: '¿Cómo puedo pagar?',
        a: 'Puedes pagar en línea con tarjeta de crédito o débito de forma segura, o hacer tu pedido por WhatsApp y coordinar el pago con nuestro equipo.',
      },
      {
        q: '¿Necesito receta médica?',
        a: 'No. Nuestros productos son suplementos alimenticios de venta libre. Aun así, si estás tomando algún medicamento, consulta con tu médico antes de consumirlos.',
      },
      {
        q: '¿Cuál es la dosis recomendada?',
        a: 'Cada producto indica su modo de uso según la edad. Lo encuentras en la ficha de cada producto, en la pestaña "Modo de uso", y también en el empaque. No superes la dosis recomendada.',
      },
      {
        q: '¿Tienen registro sanitario?',
        a: 'Sí. Todos nuestros productos cuentan con notificación sanitaria emitida por la ARCSA. El número aparece en el empaque y en la ficha de cada producto.',
      },
    ],
    more: '¿Otra pregunta? Escríbenos',
  },

  finalCta: {
    title: 'Tu familia merece sentirse bien',
    text: 'Escríbenos por WhatsApp y te ayudamos a elegir el producto ideal, o compra en línea en menos de un minuto.',
    whatsapp: 'Escríbenos por WhatsApp',
    shop: 'Ir a la tienda',
  },
}
