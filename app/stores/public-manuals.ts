import { type FetchError } from 'ofetch'
import type { ManualsResponse } from './admin-manuals'
import type { Metadata } from '~/utils/types/fetching'

export const usePublicManualsStore = defineStore('publicManuals', () => {
  const loading = ref<boolean>(false)
  const manuals = ref<Manual[] | undefined>(undefined)
  const responseMeta = ref<Metadata | null>(null)
  const fetchAllManuals = async (params?: {
    page?: number
    limit?: number | string
    name?: string
    orderBy?: string
  }) => {
    loading.value = true
    try {
      const response = await $api<ManualsResponse>('/manuals', {
        params
      })
      const { results, ...meta } = response
      manuals.value = results
      responseMeta.value = meta
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los manuales',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  const fetchManualById = (id: number | string) => {
    loading.value = true

    const data = $api<Manual>(`manuals/${+id}`)

    loading.value = false
    return data
  }

  return {
    loading,
    manuals,
    responseMeta,
    fetchAllManuals,
    fetchManualById
  }
})
