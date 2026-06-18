import { toast } from 'vue-sonner'
import type { Horario, HorarioCompleto, EditarDetalleInput, EditarDetalleResult, ConflictosResponse } from './types'

export const fetchHorarios = async (): Promise<Horario[]> => {
  try {
    const response = await $apiSchedules<Horario[]>('/api/horarios')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener horarios', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchHorario = async (id: number, query?: Record<string, any>): Promise<HorarioCompleto> => {
  try {
    return await $apiSchedules<HorarioCompleto>(`/api/horarios/${id}`, { query })
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Horario no encontrado')
    } else {
      toast.error('Error al obtener horario', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

export const fetchConflictos = async (id: number): Promise<ConflictosResponse> => {
  try {
    return await $apiSchedules<ConflictosResponse>(`/api/horarios/${id}/conflictos`)
  } catch (error: any) {
    toast.error('Error al obtener conflictos', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const editarDetalle = async (
  id: number,
  detalleId: number,
  body: EditarDetalleInput
): Promise<EditarDetalleResult> => {
  try {
    const result = await $apiSchedules<EditarDetalleResult>(
      `/api/horarios/${id}/detalle/${detalleId}`,
      { method: 'PUT', body }
    )
    toast.success('Bloque actualizado')
    return result
  } catch (error: any) {
    toast.error('Error al actualizar bloque', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const activarHorario = async (id: number) => {
  try {
    const result = await $apiSchedules<any>(`/api/horarios/${id}/activar`, { method: 'PUT' })
    toast.success('Horario marcado como oficial')
    return result
  } catch (error: any) {
    toast.error('Error al activar horario', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const eliminarHorario = async (id: number) => {
  try {
    await $apiSchedules(`/api/horarios/${id}`, { method: 'DELETE' })
    toast.success('Horario eliminado')
  } catch (error: any) {
    toast.error('Error al eliminar horario', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const csvUrl = (id: number): string =>
  `${import.meta.env.VITE_API_SCHEDULES_BASE_URL}/api/horarios/${id}/exportar/csv`
