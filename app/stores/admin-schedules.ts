// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type FetchError } from 'ofetch'
import type { MediaResponse } from './media'
import type { Metadata } from '~/utils/types/fetching'
export type Schedule = {
  id: number
  name: string
  description: string
  file: null
  url: null
  created_at: Date
  updated_at: Date
  media: MediaResponse
}

export type ScheduleResponse = {
  results: Manual[]
  total: number
  limit: number
  page: number
  total_pages: number
}

export type SchedulePayload = {
  name: string
  description: string
  file?: File | undefined
}

export const useAdminSchedulesStore = defineStore('admin-schedules', () => {
  const loading = ref<boolean>(false)
  const schedules = ref<Schedule[] | undefined>(undefined)
  const manual = ref<Manual | null>(null)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllManuals = async (params?: {
    page?: number
    limit?: number | string
    name?: string
    orderBy?: string
  }) => {
    loading.value = true

    const { data } = await useCustomFetch<ScheduleResponse>('/manuals/admin', {
      params
    })

    if (data.value) {
      const { results, ...meta } = data.value
      schedules.value = results
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
    console.log(payload)
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
      useSnackbarStore().showSnackbar({
        title: 'Recurso creado',
        message: 'Manual creado correctamente',
        type: SnackbarType.SUCCESS
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al crear el recurso',
        message: (error as any).data.error,
        type: SnackbarType.ERROR
      })
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
      useSnackbarStore().showSnackbar({
        title: 'Recurso actualizado',
        message: 'Manual actualizado correctamente',
        type: SnackbarType.SUCCESS
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al actualizar el recurso',
        message: (error as any).data.error,
        type: SnackbarType.ERROR
      })
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
      useSnackbarStore().showSnackbar({
        title: 'Recurso eliminado',
        message: 'Manual eliminado correctamente',
        type: SnackbarType.SUCCESS
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al eliminar el recurso',
        message: (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    schedules,
    manual,
    responseMeta,
    fetchAllManuals,
    fetchManualById,
    createManual,
    updateManual,
    deleteManual
  }
})
