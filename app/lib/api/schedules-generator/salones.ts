import { toast } from 'vue-sonner'
import type { Salon } from './types'

export const fetchSalones = async () => {
  try {
    const response = await $apiSchedules<Salon[]>('/api/salones')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener salones', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}
