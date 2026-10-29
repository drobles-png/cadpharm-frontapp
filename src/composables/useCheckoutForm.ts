import { computed, reactive, ref } from 'vue'
import { validationCopy as v, type CustomerField } from '@/config/checkout.copy'
import type { OrderCustomer } from '@/types'

const STORAGE_KEY = 'cadpharm_customer'

/** Campos que se recuerdan para la próxima compra (las notas cambian cada vez). */
const REMEMBERED: CustomerField[] = ['name', 'email', 'phone', 'documentId', 'city', 'address']

export const SECTION_FIELDS = {
  customer: ['name', 'email', 'phone', 'documentId'],
  delivery: ['city', 'address', 'notes'],
} as const satisfies Record<string, CustomerField[]>

function emptyCustomer(): OrderCustomer {
  return { name: '', email: '', phone: '', documentId: '', city: '', address: '', notes: '' }
}

function loadRemembered(): Partial<OrderCustomer> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<OrderCustomer>) : null
  } catch {
    return null
  }
}

/** Acepta "+593 99 123 4567", "0991234567" o "991234567" y deja 09XXXXXXXX. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('593')) digits = digits.slice(3)
  if (digits.length === 9 && digits.startsWith('9')) digits = `0${digits}`
  return digits
}

/** Módulo 10 del Registro Civil; solo aplica a cédulas de persona natural. */
function validCedula(id: string): boolean {
  const province = Number(id.slice(0, 2))
  if (province < 1 || (province > 24 && province !== 30)) return false
  if (Number(id[2]) >= 6) return true
  const sum = id
    .slice(0, 9)
    .split('')
    .reduce((acc, d, i) => {
      let n = Number(d) * (i % 2 === 0 ? 2 : 1)
      if (n > 9) n -= 9
      return acc + n
    }, 0)
  return (10 - (sum % 10)) % 10 === Number(id[9])
}

function check(field: CustomerField, value: string): string {
  const val = value.trim()
  switch (field) {
    case 'name':
      if (!val) return v.required
      return val.length < 3 ? v.name : ''
    case 'email':
      if (!val) return v.required
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val) ? '' : v.email
    case 'phone':
      if (!val) return v.required
      return /^09\d{8}$/.test(normalizePhone(val)) ? '' : v.phone
    case 'documentId': {
      if (!val) return v.required
      const id = val.replace(/\D/g, '')
      if (id.length !== 10 && id.length !== 13) return v.documentId
      return validCedula(id.slice(0, 10)) ? '' : v.documentChecksum
    }
    case 'city':
      return val.length < 3 ? v.city : ''
    case 'address':
      if (!val) return v.required
      return val.length < 8 ? v.address : ''
    default:
      return ''
  }
}

/**
 * Estado y validación del formulario de checkout. Valida en blur (no mientras
 * escribes: nadie quiere ver un error en la primera letra) y, una vez que un
 * campo mostró error, revalida en cada tecla para quitarlo apenas se corrige.
 */
export function useCheckoutForm() {
  const remembered = loadRemembered()
  const customer = reactive<OrderCustomer>({ ...emptyCustomer(), ...(remembered ?? {}) })
  const errors = reactive<Partial<Record<CustomerField, string>>>({})
  const touched = reactive<Partial<Record<CustomerField, boolean>>>({})
  const usedRemembered = ref(Boolean(remembered?.name))

  function validate(field: CustomerField) {
    errors[field] = check(field, customer[field])
  }

  function onBlur(field: CustomerField) {
    if (field === 'phone' && customer.phone) customer.phone = normalizePhone(customer.phone)
    if (field === 'documentId') customer.documentId = customer.documentId.replace(/\D/g, '')
    if (field === 'email') customer.email = customer.email.trim().toLowerCase()
    touched[field] = true
    validate(field)
  }

  function onInput(field: CustomerField) {
    if (touched[field] && errors[field]) validate(field)
  }

  /** Devuelve el primer campo con error (en orden visual) o null si todo está bien. */
  function validateAll(): CustomerField | null {
    let first: CustomerField | null = null
    const all = [...SECTION_FIELDS.customer, ...SECTION_FIELDS.delivery] as CustomerField[]
    for (const field of all) {
      touched[field] = true
      if (field === 'phone') customer.phone = normalizePhone(customer.phone)
      validate(field)
      if (errors[field] && !first) first = field
    }
    return first
  }

  function sectionDone(section: keyof typeof SECTION_FIELDS) {
    return computed(() =>
      (SECTION_FIELDS[section] as readonly CustomerField[]).every((f) => !check(f, customer[f])),
    )
  }

  function remember() {
    try {
      const data = Object.fromEntries(REMEMBERED.map((k) => [k, customer[k].trim()]))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Sin almacenamiento la próxima compra empieza en blanco; no es grave.
    }
  }

  function forget() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // nada que hacer
    }
    Object.assign(customer, emptyCustomer())
    Object.keys(errors).forEach((k) => delete errors[k as CustomerField])
    Object.keys(touched).forEach((k) => delete touched[k as CustomerField])
    usedRemembered.value = false
  }

  /** Lo que se envía al API: todo recortado y el celular normalizado. */
  function payload(): OrderCustomer {
    return {
      name: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: normalizePhone(customer.phone),
      documentId: customer.documentId.replace(/\D/g, ''),
      city: customer.city.trim(),
      address: customer.address.trim(),
      notes: customer.notes.trim(),
    }
  }

  return {
    customer,
    errors,
    usedRemembered,
    customerDone: sectionDone('customer'),
    deliveryDone: sectionDone('delivery'),
    onBlur,
    onInput,
    validateAll,
    remember,
    forget,
    payload,
  }
}

export type CheckoutFormCtl = ReturnType<typeof useCheckoutForm>
