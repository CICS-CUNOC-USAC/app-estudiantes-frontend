import { toast } from 'vue-sonner'
import type { Horario, HorarioCompleto, HorarioDetalle, EditarDetalleInput, EditarDetalleResult, ConflictosResponse } from './types'
import type { Period } from './periods'

/**
 * El backend arma los detalles con LEFT JOIN a periodos, así que un detalle puede
 * llegar con periodo_inicio_id/periodo_fin_id u hora_inicio/hora_fin en null
 * (pasa con datos reales: labs con distribución incompleta). Sin normalizar,
 * cualquier `.length`/aritmética sobre esos campos revienta la vista completa
 * ("Cannot read properties of null"). Se rellena lo recuperable y el resto queda
 * seguro de renderizar.
 */
export const normalizarDetalles = (
  detalles: HorarioDetalle[] | null | undefined,
  periodos?: Period[],
): HorarioDetalle[] => {
  return (detalles ?? []).map((d) => {
    const inicio = d.periodo_inicio_id ?? d.periodo_fin_id
    const fin = d.periodo_fin_id ?? d.periodo_inicio_id
    if (inicio === d.periodo_inicio_id && fin === d.periodo_fin_id && d.hora_inicio && d.hora_fin) {
      return d
    }
    const pIni = periodos?.find(p => p.id === inicio)
    const pFin = periodos?.find(p => p.id === fin)
    return {
      ...d,
      periodo_inicio_id: inicio as number,
      periodo_fin_id: fin as number,
      hora_inicio: d.hora_inicio ?? pIni?.hora_inicio ?? null as unknown as string,
      hora_fin: d.hora_fin ?? pFin?.hora_fin ?? null as unknown as string,
    }
  })
}

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
    // El feedback (toast/advertencias) lo decide la página que llama
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
