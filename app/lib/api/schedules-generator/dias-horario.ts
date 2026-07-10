import { toast } from 'vue-sonner'
import type { DiaHorario } from './types'

export const fetchDiasHorario = async () => {
  try {
    const response = await $apiSchedules<DiaHorario[]>('/api/dias-horario')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener días de horario', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}
