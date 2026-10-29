import { computed, ref } from 'vue'
import { productService } from '@/services/product.service'
import type { ApiError, Product } from '@/types'

/**
 * Catálogo compartido entre home, tienda, detalle y profesionales. Vive a nivel
 * de módulo: el primer componente que lo pide dispara el request y los demás
 * reutilizan la misma promesa, así una navegación no vuelve a pedir lo mismo.
 */
const products = ref<Product[]>([])
const loaded = ref(false)
const error = ref<string | null>(null)
let pending: Promise<Product[]> | null = null

async function load(force = false): Promise<Product[]> {
  if (loaded.value && !force) return products.value
  if (pending) return pending
  error.value = null
  pending = productService
    .list()
    .then((list) => {
      products.value = [...list].sort((a, b) => a.order - b.order)
      loaded.value = true
      return products.value
    })
    .catch((err: ApiError) => {
      error.value = err.message || 'No se pudo cargar el catálogo'
      return []
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export function useCatalog() {
  const loading = computed(() => !loaded.value && !error.value)

  function bySlug(slug: string): Product | undefined {
    return products.value.find((p) => p.slug === slug)
  }

  return { products, loaded, loading, error, load, bySlug }
}
