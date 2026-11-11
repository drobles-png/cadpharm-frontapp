/**
 * Copy de la web informativa (inicio, banners de productos, quiénes somos y
 * marcas). Público principal: médicos y profesionales de la salud, sin dejar
 * de hablarle a la familia. Los componentes solo pintan.
 */

export interface HeroSlide {
  image: string
  alt: string
  eyebrow: string
  title: string
  text: string
  /** Punto de foco de la foto en móvil, donde el recorte es más agresivo. */
  focus?: string
  /** El slide dirigido a médicos pone primero el botón de profesionales. */
  proFirst?: boolean
}

export const homeHero = {
  label: 'Presentación de CadPharm',
  // Título fijo de la página: los titulares de los slides rotan y no sirven de h1.
  heading: 'CadPharm Laboratorio: calidad que inspira confianza',
  primary: { label: 'Conocer productos', to: '/productos' },
  secondary: { label: 'Soy profesional de la salud', to: '/profesionales' },
  slides: [
    {
      image: '/img/hero/hero-familia.webp',
      alt: 'Padre, madre e hija riendo juntos en un parque',
      eyebrow: 'Laboratorio farmacéutico ecuatoriano',
      title: 'Calidad que inspira confianza.',
      text: 'Fórmulas pensadas para acompañar el bienestar de niños y adultos, con cuidado en cada detalle.',
      focus: '55% 40%',
    },
    {
      image: '/img/hero/hero-medico.webp',
      alt: 'Doctora sonriendo con un recién nacido en brazos en la consulta',
      eyebrow: 'Para profesionales de la salud',
      title: 'Fórmulas que puedes recomendar con tranquilidad.',
      text: 'Composición declarada en cada producto y notificación sanitaria ARCSA.',
      focus: '60% 35%',
      proFirst: true,
    },
    {
      image: '/img/hero/hero-abuelos.webp',
      alt: 'Abuela sonriente con su nieto en brazos',
      eyebrow: 'Bienestar en cada etapa',
      title: 'Cuidamos a toda la familia.',
      text: 'Del crecimiento de los más pequeños al descanso de los mayores.',
      focus: '75% 40%',
    },
    {
      image: '/img/hero/hero-ninos.webp',
      alt: 'Madre e hijo haciendo burbujas en un parque al atardecer',
      eyebrow: 'Hecho en Ecuador',
      title: 'Más de 30 años junto a la salud del país.',
      text: 'Una empresa familiar que nació en la farmacia y hoy desarrolla sus propias fórmulas.',
      focus: '55% 40%',
    },
  ] as HeroSlide[],
}

export const productBanners = {
  label: 'Banners de productos CadPharm',
  prev: 'Banner anterior',
  next: 'Banner siguiente',
  slides: [
    {
      slug: 'expultox-forte',
      name: 'Expultox Forte',
      image: '/img/banners/expultox-forte.webp',
      alt: 'Expultox Forte. Cuidado y bienestar para tus vías respiratorias.',
    },
    {
      slug: 'abcvit-kiddi',
      name: 'ABCVIT Kiddi',
      image: '/img/banners/abcvit-kiddi.webp',
      alt: 'ABCVIT Kiddi. Vitalidad para jugar y crecer.',
    },
    {
      slug: 'somnycad',
      name: 'Somnycad',
      image: '/img/banners/somnycad.webp',
      alt: 'Somnycad. Relajación y descanso para tus noches.',
    },
    {
      slug: 'enzabiox',
      name: 'Enzabiox',
      image: '/img/banners/enzabiox.webp',
      alt: 'Enzabiox. Disfruta tus comidas con bienestar.',
    },
  ],
}

/** Foto principal de cada producto: caja de frente en fondo blanco. */
export const productPhotos: Record<string, string> = {
  'abcvit-kiddi': '/img/products/abcvit-kiddi/00-principal.webp',
  'expultox-forte': '/img/products/expultox-forte/00-principal.webp',
  enzabiox: '/img/products/enzabiox/00-principal.webp',
  somnycad: '/img/products/somnycad/00-principal.webp',
}

export const catalogCopy = {
  eyebrow: 'Nuestros productos',
  title: 'Conoce la línea CadPharm.',
  text: 'Suplementos con notificación sanitaria ARCSA. Selecciona un producto para ver su composición y presentación.',
  all: 'Todos',
  listTitle: 'Productos CadPharm',
  view: 'Ver producto',
  emptyTitle: 'Aún no hay productos en esta categoría',
  emptyText: 'Mira el resto de la línea CadPharm.',
  emptyCta: 'Ver todos',
  errorTitle: 'No pudimos cargar los productos',
  errorCta: 'Reintentar',
  note: 'La información presentada corresponde a los datos declarados de cada producto. Ante dudas sobre su uso, consulta a un profesional de la salud.',
}

export const detailCopy = {
  back: 'Volver a productos',
  presentation: 'Presentación',
  category: 'Categoría',
  composition: 'Composición',
  indications: 'Para qué sirve',
  dosage: 'Modo de uso',
  warnings: 'Advertencias',
  storage: 'Conservación',
  registry: 'Notificación sanitaria',
  audience: 'Dirigido a',
  ingredients: 'Ingredientes completos',
  whatsappMessage: (name: string) => `Hola CadPharm, quiero información sobre ${name}`,
  pro: {
    title: 'Para profesionales de la salud',
    text: 'Ficha técnica resumida. Si necesitas muestras médicas o visita, escríbenos.',
    registry: 'Notificación sanitaria (NS)',
    presentation: 'Presentación',
    audience: 'Dirigido a',
    manufacturer: 'Fabricante',
    barcode: 'Código de barras',
    cta: 'Solicitar visita o muestras',
    whatsapp: 'Consultar por WhatsApp',
  },
  related: 'Productos relacionados',
  relatedCta: 'Leer más',
  notFoundTitle: 'No encontramos este producto',
  notFoundText: 'Puede que el enlace esté mal escrito o que el producto ya no esté disponible.',
}

export const brandsCopy = {
  title: 'Nuestras marcas',
  items: [
    {
      slug: 'expultox-forte',
      parts: [
        { text: 'EXPUL', color: '#9cda94' },
        { text: 'TOX FORTE', color: '#ffad67' },
      ],
      italic: true,
      text: 'N-acetilcisteína, propóleo, jengibre y vitamina C',
    },
    {
      slug: 'enzabiox',
      parts: [{ text: 'ENZABIOX', color: '#ffad67' }],
      text: 'Enzimas digestivas y vitaminas B1, B2 y B6',
    },
    {
      slug: 'abcvit-kiddi',
      parts: [
        { text: 'A', color: '#9cda94' },
        { text: 'B', color: '#ffd166' },
        { text: 'C', color: '#ff9197' },
        { text: 'VIT ', color: '#a4c6ff' },
        { text: 'KIDDI', color: '#8bd8f6' },
      ],
      text: 'Fórmula multivitamínica',
    },
    {
      slug: 'somnycad',
      parts: [{ text: 'SOMNYCAD', color: '#c3c7ff' }],
      text: 'Melatonina y extractos botánicos',
    },
  ],
}

export const historyCopy = {
  intro: {
    eyebrow: 'Quiénes somos',
    title: 'Una trayectoria ecuatoriana que sigue creciendo.',
    text: 'CadPharm es una empresa orgullosamente ecuatoriana. Nuestra historia nace de la atención cercana al público, crece con la distribución farmacéutica y evoluciona hacia el desarrollo de productos de marca propia.',
  },
  photos: [
    {
      image: '/img/nosotros/expultox-produccion.webp',
      alt: 'Frascos de Expultox Forte en una línea de producción farmacéutica',
      caption: 'Producción farmacéutica con identidad CadPharm',
    },
    {
      image: '/img/nosotros/capsulas.webp',
      alt: 'Cápsulas en un equipo de producción farmacéutica',
      caption: 'Precisión y consistencia en cada cápsula',
    },
    {
      image: '/img/nosotros/inspeccion-abcvit.webp',
      alt: 'Frascos de ABCVIT Kiddi sobre una cinta de inspección óptica con un técnico al fondo',
      caption: 'Inspección de frascos de ABCVIT Kiddi',
    },
  ],
  photosLabel: 'Producción CadPharm',
  stages: [
    {
      period: 'Primeros 5 años',
      title: 'El comienzo en la farmacia',
      text: 'El Dr. Fausto Cadena inició esta aventura con una farmacia dedicada a la venta directa al público. Durante cinco años, esta experiencia le permitió conocer de cerca las necesidades de las personas y fortalecer su vocación de servicio.',
    },
    {
      period: '25 años de experiencia',
      title: 'Una visión que amplió el camino',
      text: 'La empresa dio el paso hacia la distribución de medicamentos de reconocidos laboratorios del Ecuador. Durante 25 años, esta etapa consolidó experiencia, relaciones comerciales y un profundo conocimiento del sector farmacéutico nacional.',
    },
    {
      period: 'Nueva etapa familiar',
      title: 'El nacimiento de CadPharm',
      text: 'Con el apoyo de sus hijos, la experiencia acumulada se transformó en un nuevo propósito: desarrollar productos de marca propia e integrar alternativas fitofarmacéuticas. Así nació CadPharm, una empresa familiar ecuatoriana que combina trayectoria, conocimiento y visión de futuro.',
    },
  ],
  commitment: {
    eyebrow: 'Nuestro compromiso',
    title: 'Comprometidos con hacer las cosas bien.',
    text: 'Somos un laboratorio enfocado en desarrollar productos confiables y construir relaciones duraderas con médicos, farmacias y familias.',
    values: ['Calidad', 'Confianza', 'Compromiso'],
  },
  quality: {
    title: 'Notificación sanitaria en cada producto',
    text: 'Todos nuestros suplementos cuentan con notificación sanitaria de la ARCSA. Los elabora LabVolpharm S.A.S. en Durán bajo nuestras especificaciones.',
    cta: 'Ver productos',
  },
}
