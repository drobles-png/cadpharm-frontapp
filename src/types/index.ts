/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Catálogo ──────────────────────────────────────────────────────────

export type ProductCategory = 'defensas' | 'respiratorio' | 'digestivo' | 'descanso'

export interface NutritionRow {
  name: string
  amount: string
  vdr: string
}

export interface Product {
  _id: string
  slug: string
  name: string
  /** Segunda línea del nombre en el empaque: "Kiddi", "Forte". */
  nameAccent: string
  tagline: string
  description: string
  category: ProductCategory
  categoryLabel: string
  presentation: string
  /** Centavos. null = precio por confirmar (se pide por WhatsApp). */
  price: number | null
  images: string[]
  /** PNG sin fondo para el hero y las animaciones. Puede venir vacío. */
  cutout: string
  theme: { primary: string; secondary: string; ink: string }
  highlights: string[]
  benefits: string[]
  activeIngredients: { name: string; amount: string }[]
  ingredients: string
  dosage: { who: string; dose: string }[]
  warnings: string[]
  storage: string
  nutrition: { serving: string; servingsPerPack: string; rows: NutritionRow[] }
  sanitaryRegistry: string
  barcode: string
  audience: string
  manufacturer: string
  stock: number
  isPublished: boolean
  featured: boolean
  order: number
  createdAt?: string
  updatedAt?: string
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>

// ─── Profesionales / contacto ──────────────────────────────────────────

export type LeadType = 'medico' | 'farmacia' | 'distribuidor' | 'paciente'
export type LeadStatus = 'new' | 'contacted' | 'closed'

export interface LeadInput {
  type: LeadType
  name: string
  specialty: string
  institution: string
  email: string
  phone: string
  city: string
  message: string
  productsOfInterest: string[]
}

export interface Lead extends LeadInput {
  _id: string
  status: LeadStatus
  note: string
  createdAt: string
}
