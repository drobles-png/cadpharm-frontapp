import { defineStore } from 'pinia'
import type { Product } from '@/types'

const STORAGE_KEY = 'cadpharm_cart'
const MAX_QTY = 20

export interface CartLine {
  productId: string
  slug: string
  name: string
  nameAccent: string
  presentation: string
  image: string
  /** Centavos. Un producto sin precio no entra al carrito. */
  unitPrice: number
  color: string
  quantity: number
}

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

/**
 * El carrito vive en el navegador; el precio real lo recalcula el backend al
 * crear el pedido, así que aquí el total es solo una referencia visual.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load(),
    isOpen: false,
    /** Cambia en cada add() para que el botón del carrito haga su "pop". */
    bump: 0,
  }),

  getters: {
    count: (s) => s.lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: (s) => s.lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        // Modo privado: el carrito dura lo que dure la pestaña.
      }
    },

    add(product: Product, quantity = 1, openDrawer = true) {
      if (product.price === null) return
      const line = this.lines.find((l) => l.productId === product._id)
      if (line) {
        line.quantity = Math.min(line.quantity + quantity, MAX_QTY)
      } else {
        this.lines.push({
          productId: product._id,
          slug: product.slug,
          name: product.name,
          nameAccent: product.nameAccent,
          presentation: product.presentation,
          image: product.cutout || product.images[0] || '',
          unitPrice: product.price,
          color: product.theme.primary,
          quantity: Math.min(quantity, MAX_QTY),
        })
      }
      this.bump++
      this.persist()
      if (openDrawer) this.isOpen = true
    },

    setQuantity(productId: string, quantity: number) {
      const line = this.lines.find((l) => l.productId === productId)
      if (!line) return
      if (quantity <= 0) {
        this.remove(productId)
        return
      }
      line.quantity = Math.min(quantity, MAX_QTY)
      this.persist()
    },

    remove(productId: string) {
      this.lines = this.lines.filter((l) => l.productId !== productId)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },

    open() {
      this.isOpen = true
    },

    close() {
      this.isOpen = false
    },
  },
})
