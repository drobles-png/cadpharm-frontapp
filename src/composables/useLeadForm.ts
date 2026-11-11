import { computed, nextTick, reactive, ref } from 'vue'
import type { ApiError, LeadInput, LeadType } from '@/types'
import { professionalsCopy } from '@/config/pages.copy'
import { leadService } from '@/services/lead.service'
import { useToastStore } from '@/stores/toast'

type Field = 'type' | 'name' | 'email' | 'phone' | 'city'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Formulario de profesionales: validación inline (se muestra al salir del
 * campo o al intentar enviar), honeypot y estados de envío/éxito.
 */
export function useLeadForm(initialType: LeadType = 'medico') {
  const toast = useToastStore()
  const errorsCopy = professionalsCopy.form.errors

  const form = reactive<LeadInput>({
    type: initialType,
    name: '',
    specialty: '',
    institution: '',
    email: '',
    phone: '',
    city: '',
    message: '',
    productsOfInterest: [],
  })
  const website = ref('')
  const touched = reactive<Record<Field, boolean>>({
    type: false,
    name: false,
    email: false,
    phone: false,
    city: false,
  })
  const sending = ref(false)
  const sent = ref(false)
  const successMessage = ref('')

  const errors = computed<Record<Field, string>>(() => ({
    type: form.type ? '' : errorsCopy.type,
    name: form.name.trim().length >= 3 ? '' : errorsCopy.name,
    email: EMAIL.test(form.email.trim()) ? '' : errorsCopy.email,
    phone: form.phone.replace(/\D/g, '').length >= 7 ? '' : errorsCopy.phone,
    city: form.city.trim().length >= 2 ? '' : errorsCopy.city,
  }))
  const isValid = computed(() => Object.values(errors.value).every((e) => !e))

  function errorFor(field: Field) {
    return touched[field] ? errors.value[field] : ''
  }

  function touch(field: Field) {
    touched[field] = true
  }

  // En móvil el formulario es largo: sin esto, los errores quedan fuera de
  // pantalla y parece que el botón no hizo nada.
  async function focusFirstError() {
    await nextTick()
    const el = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' })
    el.focus({ preventScroll: true })
  }

  async function submit(): Promise<boolean> {
    ;(Object.keys(touched) as Field[]).forEach((f) => (touched[f] = true))
    if (!isValid.value) {
      focusFirstError()
      return false
    }
    if (sending.value) return false
    sending.value = true
    try {
      const payload: LeadInput = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
      }
      const res = await leadService.create(payload, website.value)
      successMessage.value = res.message || professionalsCopy.form.successText
      sent.value = true
      return true
    } catch (err) {
      toast.error((err as ApiError).message || professionalsCopy.form.fallbackError)
      return false
    } finally {
      sending.value = false
    }
  }

  function reset() {
    Object.assign(form, {
      name: '',
      specialty: '',
      institution: '',
      email: '',
      phone: '',
      city: '',
      message: '',
      productsOfInterest: [],
    })
    ;(Object.keys(touched) as Field[]).forEach((f) => (touched[f] = false))
    sent.value = false
  }

  /** Marca un producto de interés sin duplicarlo (p. ej. el que viene en la URL). */
  function preselect(product: string) {
    if (!form.productsOfInterest.includes(product)) {
      form.productsOfInterest = [...form.productsOfInterest, product]
    }
  }

  return {
    form,
    website,
    sending,
    sent,
    successMessage,
    errorFor,
    touch,
    submit,
    reset,
    preselect,
  }
}
