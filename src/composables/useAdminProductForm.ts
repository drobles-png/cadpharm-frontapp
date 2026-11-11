import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { productFormCopy } from '@/config/admin.copy'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Product, ProductInput } from '@/types'

/**
 * El formulario guarda el precio como texto en dólares; el API lo quiere en centavos.
 * La web ya no vende: precio y stock no se muestran en el formulario, pero se siguen
 * enviando con el valor que ya tenía el producto para no romper el API.
 */
export type ProductForm = Omit<ProductInput, 'price'> & { priceText: string }

export function emptyProduct(): ProductForm {
  return {
    slug: '',
    name: '',
    nameAccent: '',
    tagline: '',
    description: '',
    category: 'defensas',
    categoryLabel: 'Crecimiento y defensas',
    presentation: '',
    priceText: '',
    images: [],
    cutout: '',
    theme: { primary: '#17a34a', secondary: '#b8f05a', ink: '#0b1b2e' },
    highlights: [],
    benefits: [],
    activeIngredients: [],
    ingredients: '',
    dosage: [],
    warnings: [],
    storage: '',
    nutrition: { serving: '', servingsPerPack: '', rows: [] },
    sanitaryRegistry: '',
    barcode: '',
    audience: '',
    manufacturer: '',
    stock: 0,
    isPublished: false,
    featured: false,
    order: 0,
  }
}

function fromProduct(p: Product): ProductForm {
  const { _id, createdAt, updatedAt, price, ...rest } = p
  void _id
  void createdAt
  void updatedAt
  const base = emptyProduct()
  return {
    ...base,
    ...rest,
    theme: { ...base.theme, ...rest.theme },
    nutrition: { ...base.nutrition, ...rest.nutrition, rows: [...(rest.nutrition?.rows || [])] },
    priceText: price === null || price === undefined ? '' : (price / 100).toFixed(2),
  }
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toInput(form: ProductForm, isNew: boolean): ProductInput {
  const { priceText, ...rest } = form
  const clean = priceText.replace(',', '.').trim()
  const price = clean === '' || isNaN(Number(clean)) ? null : Math.round(Number(clean) * 100)
  const clip = (list: string[]) => list.map((s) => s.trim()).filter(Boolean)
  return {
    ...rest,
    slug: rest.slug || (isNew ? slugify(`${rest.name} ${rest.nameAccent}`) : rest.slug),
    price,
    stock: Number(rest.stock) || 0,
    order: Number(rest.order) || 0,
    highlights: clip(rest.highlights),
    benefits: clip(rest.benefits),
    warnings: clip(rest.warnings),
    activeIngredients: rest.activeIngredients.filter((r) => r.name.trim()),
    dosage: rest.dosage.filter((r) => r.who.trim() || r.dose.trim()),
    nutrition: { ...rest.nutrition, rows: rest.nutrition.rows.filter((r) => r.name.trim()) },
  }
}

export function useAdminProductForm() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const id = computed(() => (route.params.id ? String(route.params.id) : ''))
  const isNew = computed(() => !id.value)

  const form = ref<ProductForm>(emptyProduct())
  const snapshot = ref(JSON.stringify(form.value))
  const loading = ref(!isNew.value)
  const saving = ref(false)
  const deleting = ref(false)
  const confirmDelete = ref(false)
  const leaveTarget = ref<RouteLocationRaw | null>(null)
  let allowLeave = false

  const dirty = computed(() => JSON.stringify(form.value) !== snapshot.value)

  function markClean() {
    snapshot.value = JSON.stringify(form.value)
  }

  async function load() {
    if (isNew.value) return
    loading.value = true
    try {
      form.value = fromProduct(await adminService.product(id.value))
      markClean()
    } catch (e) {
      toast.error((e as ApiError).message)
      router.replace({ name: 'AdminProducts' })
    } finally {
      loading.value = false
    }
  }

  async function save() {
    if (saving.value) return
    if (!form.value.name.trim()) {
      toast.error(productFormCopy.nameRequired)
      document.getElementById('basico')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    saving.value = true
    try {
      const input = toInput(form.value, isNew.value)
      if (isNew.value) {
        const created = await adminService.createProduct(input)
        form.value = fromProduct(created)
        markClean()
        toast.success(productFormCopy.created)
        router.replace({ name: 'AdminProductEdit', params: { id: created._id } })
      } else {
        form.value = fromProduct(await adminService.updateProduct(id.value, input))
        markClean()
        toast.success(productFormCopy.saved)
      }
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  async function remove() {
    if (deleting.value || isNew.value) return
    deleting.value = true
    try {
      await adminService.deleteProduct(id.value)
      allowLeave = true
      confirmDelete.value = false
      toast.success(productFormCopy.deleted)
      router.push({ name: 'AdminProducts' })
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      deleting.value = false
    }
  }

  // Guard de salida: se frena la navegación y se pregunta con un modal propio.
  onBeforeRouteLeave((to) => {
    if (allowLeave || !dirty.value) return true
    leaveTarget.value = to.fullPath
    return false
  })

  function confirmLeave() {
    const target = leaveTarget.value
    leaveTarget.value = null
    allowLeave = true
    if (target) router.push(target)
  }

  const onBeforeUnload = (event: BeforeUnloadEvent) => {
    if (dirty.value && !allowLeave) event.preventDefault()
  }

  onMounted(() => {
    load()
    window.addEventListener('beforeunload', onBeforeUnload)
  })
  onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload))

  return {
    form,
    isNew,
    loading,
    saving,
    deleting,
    dirty,
    confirmDelete,
    leaveTarget,
    save,
    remove,
    confirmLeave,
  }
}
