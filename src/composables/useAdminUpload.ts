import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { productFormCopy } from '@/config/admin.copy'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

/**
 * Subida de fotos. Si Cloudinary no está configurado (503) se apaga la subida
 * y se deja solo el campo para pegar la dirección de la imagen.
 */
export function useAdminUpload(onUploaded: (url: string) => void) {
  const uploading = ref(0)
  const unavailable = ref(false)
  const toast = useToastStore()

  async function uploadFiles(files: FileList | File[] | null | undefined) {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'))
    for (const file of list) {
      if (unavailable.value) return
      uploading.value++
      try {
        onUploaded(await adminService.upload(file))
        toast.success(productFormCopy.imageAdded)
      } catch (e) {
        const err = e as ApiError
        if (err.status === 503) {
          unavailable.value = true
          toast.info(err.message || productFormCopy.uploadUnavailable)
        } else toast.error(err.message)
      } finally {
        uploading.value--
      }
    }
  }

  function addUrl(raw: string): boolean {
    const url = raw.trim()
    const valid = /^(https?:\/\/|\/)\S+$/i.test(url)
    if (!valid) {
      toast.error(productFormCopy.invalidUrl)
      return false
    }
    onUploaded(url)
    return true
  }

  return { uploading, unavailable, uploadFiles, addUrl }
}
