import { onMounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { productsCopy } from '@/config/admin.copy'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product } from '@/types'

type Toggleable = 'isPublished' | 'featured'

export function useAdminProducts() {
  const products = ref<Product[]>([])
  const loading = ref(true)
  const busy = ref<Record<string, boolean>>({})
  const toast = useToastStore()

  async function load() {
    loading.value = true
    try {
      const list = await adminService.products()
      products.value = [...list].sort((a, b) => a.order - b.order)
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambio optimista: el switch se mueve al instante y, si el API falla,
   * vuelve a su lugar con el error del servidor.
   */
  async function toggle(product: Product, field: Toggleable) {
    const key = `${product._id}:${field}`
    if (busy.value[key]) return
    const previous = product[field]
    product[field] = !previous
    busy.value[key] = true
    try {
      await adminService.updateProduct(product._id, { [field]: !previous })
      if (field === 'isPublished') {
        toast.success(
          product.isPublished
            ? productsCopy.nowPublished(product.name)
            : productsCopy.nowHidden(product.name),
        )
      }
    } catch (e) {
      product[field] = previous
      toast.error((e as ApiError).message)
    } finally {
      busy.value[key] = false
    }
  }

  onMounted(load)

  return { products, loading, toggle }
}
