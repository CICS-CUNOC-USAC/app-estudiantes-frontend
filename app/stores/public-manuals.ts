import { type FetchError } from 'ofetch'
import type { ManualsResponse } from './admin-manuals'
import type { Metadata } from '~/utils/types/fetching'
import { toast } from 'vue-sonner'

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
      toast.error('No se han podido obtener los manuales', {
        description: error.name === 'FetchError' ? 'Parece que este servicio no está disponible en este momento' : ''
      })
      return {
        error: true
      }
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
