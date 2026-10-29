import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { loginCopy } from '@/config/admin.copy'
import type { ApiError } from '@/types'

const REMEMBER_KEY = 'cadpharm_admin_email'

function readRemembered(): string {
  try {
    return localStorage.getItem(REMEMBER_KEY) || ''
  } catch {
    return ''
  }
}

export function useAdminLogin() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()

  const remembered = readRemembered()
  const email = ref(remembered)
  const password = ref('')
  const remember = ref(Boolean(remembered))
  const showPassword = ref(false)
  const loading = ref(false)
  const error = ref('')
  /** Cambia en cada error para re-disparar la animación de sacudida. */
  const shakeKey = ref(0)

  function persistEmail() {
    try {
      if (remember.value) localStorage.setItem(REMEMBER_KEY, email.value.trim())
      else localStorage.removeItem(REMEMBER_KEY)
    } catch {
      // Modo privado: simplemente no se recuerda.
    }
  }

  function fail(message: string) {
    error.value = message
    shakeKey.value++
  }

  async function submit() {
    if (loading.value) return
    error.value = ''
    loading.value = true
    try {
      const user = await userStore.login(email.value.trim(), password.value)
      persistEmail()
      if (user.accountType !== 'admin') {
        userStore.clear()
        fail(loginCopy.notAdmin)
        return
      }
      toast.success(loginCopy.welcome(user.name || user.email))
      const next = typeof route.query.next === 'string' && route.query.next.startsWith('/')
        ? route.query.next
        : '/admin'
      router.replace(next)
    } catch (e) {
      fail((e as ApiError).message)
    } finally {
      loading.value = false
    }
  }

  return { email, password, remember, showPassword, loading, error, shakeKey, submit }
}
