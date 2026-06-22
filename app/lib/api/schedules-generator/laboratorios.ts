import { toast } from 'vue-sonner'
import type { Laboratorio } from './types'

export const fetchLaboratorios = async () => {
  try {
    const response = await $apiSchedules<Laboratorio[]>('/api/laboratorios')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener laboratorios', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchLaboratoriosByCurso = async (cursoId: number) => {
  try {
    const response = await $apiSchedules<Laboratorio[]>(`/api/laboratorios/curso/${cursoId}`)
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener laboratorios del curso', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}
