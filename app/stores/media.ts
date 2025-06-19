import { toast } from "vue-sonner"

export type MediaPayload = {
  file: File | undefined
  path: string
  attach_type: string
}

export type MediaResponse = {
  id: number
  filename: string
  type: string
  size: string
  path: string
  created_at: Date
  updated_at: Date
  key: string
  url: string
}

export const useMediaStore = defineStore('media', () => {
  const loading = ref<boolean>(false)
  const uploading = ref<boolean>(false)

  /**
   * Uploads a file to the server on /media endpoint.
   * @param payload - The file and path to upload.
   * @returns A promise that resolves with the server response.
   */
  const postMedia = async (payload: MediaPayload) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('file', payload.file as Blob)
      formData.append('path', payload.path as string)
      formData.append('attach_type', payload.attach_type as string)
      const response = await $api<MediaResponse>('/media', {
        method: 'POST',
        body: formData
      })
      return response
    } catch (error) {
      toast.error('Error al subir el archivo', { description: (error as any).data.error })
    } finally {
      loading.value = false
    }
  }

  const updateMedia = async (file: File, id: number) => {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file as Blob)
      const response = await $api<MediaResponse>(`/media/${id}`, {
        method: 'PATCH',
        body: formData
      })
      toast.success('Archivo actualizado', { description: 'El archivo se ha subido correctamente' })
      return response
    } catch (error) {
      toast.success('Error al subir el archivo', { description: (error as any).data.error })
    } finally {
      uploading.value = false
    }
  }

  return {
    loading,
    uploading,
    postMedia,
    updateMedia
  }
})
