// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type FetchError } from 'ofetch'
import type { MediaResponse } from './media'
import type { Metadata } from '~/utils/types/fetching'
import { toast } from 'vue-sonner'
export type Manual = {
  id: number
  name: string
  description: string
  file: null
  url: null
  created_at: Date
  updated_at: Date
  media: MediaResponse
}

export type ManualsResponse = {
  results: Manual[]
  total: number
  limit: number
  page: number
  total_pages: number
}

export type ManualPayload = {
  name: string
  description: string
  file?: File | undefined
}

export const useAdminManualsStore = defineStore('admin-manuals', () => {
  const loading = ref<boolean>(false)
  const manuals = ref<Manual[] | undefined>(undefined)
  const manual = ref<Manual | null>(null)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllManuals = async (params?: {
    page?: number
    limit?: number | string
    name?: string
    orderBy?: string
  }) => {
    loading.value = true

    const { data } = await useCustomFetch<ManualsResponse>('/manuals/admin', {
      params
    })

    if (data.value) {
      const { results, ...meta } = data.value
      manuals.value = results
      responseMeta.value = meta
    }
    loading.value = false
  }
  const fetchManualById = (id: number | string) => {
    loading.value = true

    const data = $api<Manual>(`manuals/admin/${+id}`)

    loading.value = false
    return data
  }

  const createManual = async (payload: ManualPayload) => {
    loading.value = true
    try {
      // First, upload the pdf file using media store to get the media item id
      const uploadedMedia = await useMediaStore().postMedia({
        file: payload.file,
        path: 'manuals',
        attach_type: 'manual'
      })
      // Then, create the manual using the media item id
      const response = await $api<Manual>('/manuals/admin', {
        method: 'POST',
        body: {
          ...payload,
          media_id: uploadedMedia?.id
        }
      })
      toast.success('Recurso creado', {description: 'Manual creado correctamente' })
      return response
    } catch (error) {
      toast.error('Error al crear el recurso', {description: (error as any).data.error })
    } finally {
      loading.value = false
    }
  }

  const updateManual = async (id: number | string, payload: ManualPayload) => {
    loading.value = true
    try {
      const response = await $api<Manual>(`/manuals/admin/${+id}`, {
        method: 'PATCH',
        body: payload
      })
      toast.success('Recurso actualizado', {description: 'Manual actualizado correctamente' })
      return response
    } catch (error) {
      toast.error('Error al actualizar el recurso', {description: (error as any).data.error })
    } finally {
      loading.value = false
    }
  }

  const deleteManual = async (id: number | string) => {
    loading.value = true
    try {
      const response = await $api<Manual>(`/manuals/admin/${+id}`, {
        method: 'DELETE'
      })
      toast.success('Recurso eliminado', {description: 'Manual eliminado correctamente' })
      return response
    } catch (error) {
      toast.error('Error al eliminar el recurso', {description: (error as any).data.error })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    manuals,
    manual,
    responseMeta,
    fetchAllManuals,
    fetchManualById,
    createManual,
    updateManual,
    deleteManual
  }
})
