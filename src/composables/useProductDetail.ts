import { computed, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiError, Product } from '@/types'
import { site, whatsappLink } from '@/config/site'
import { productCopy } from '@/config/pages.copy'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/stores/cart'
import { useCatalog } from './useCatalog'

/**
 * Estado de la ficha de producto. Si el catálogo ya está en caché el producto
 * aparece al instante; si no, se pide solo ese slug y el catálogo carga detrás
 * para los relacionados.
 */
export function useProductDetail(slug: Ref<string>) {
  const router = useRouter()
  const cart = useCartStore()
  const catalog = useCatalog()

  const product = ref<Product | null>(null)
  const loading = ref(true)
  const notFound = ref(false)
  const quantity = ref(1)

  async function fetchProduct(value: string) {
    quantity.value = 1
    notFound.value = false
    const cached = catalog.bySlug(value)
    if (cached) {
      product.value = cached
      loading.value = false
    } else {
      loading.value = true
      product.value = null
      try {
        product.value = await productService.bySlug(value)
      } catch (err) {
        // 404 es lo esperable; ante otro error tampoco hay ficha que mostrar.
        notFound.value = true
        if ((err as ApiError).status !== 404) console.warn('[producto]', (err as ApiError).message)
      } finally {
        loading.value = false
      }
    }
    catalog.load()
  }

  watch(slug, fetchProduct, { immediate: true })

  // El router pone "Producto — CadPharm"; acá se reemplaza por el nombre real.
  watch(product, (p) => {
    if (p) document.title = `${p.name} ${p.nameAccent} — ${site.name}`.replace(/\s+—/, ' —')
  })

  const related = computed(() => {
    const current = product.value
    if (!current) return []
    const others = catalog.products.value.filter((p) => p.slug !== current.slug)
    const same = others.filter((p) => p.category === current.category)
    return [...same, ...others.filter((p) => p.category !== current.category)].slice(0, 3)
  })

  const fullName = computed(() =>
    product.value ? `${product.value.name} ${product.value.nameAccent}`.trim() : '',
  )
  const waHref = computed(() => whatsappLink(productCopy.whatsappMessage(fullName.value)))

  function addToCart() {
    if (product.value) cart.add(product.value, quantity.value, true)
  }

  function buyNow() {
    if (!product.value) return
    cart.add(product.value, quantity.value, false)
    router.push('/checkout')
  }

  return { product, loading, notFound, quantity, related, fullName, waHref, addToCart, buyNow }
}
