import { toast } from 'vue-sonner'

export interface ResetStateResponse {
  carreras: number
  salones: number
  docentes: number
  cursos: number
  laboratorios: number
  secciones: number
  seccion_laboratorio: number
  docente_curso: number
  periodos: number
  horarios: number
  horario_detalle: number
  horario_historial: number
}

export interface ResetCompleteResponse {
  mensaje: string
  tablas_limpiadas: Record<string, { eliminados: number }>
  tablas_conservadas: string[]
}

export interface ResetSchedulesResponse {
  mensaje: string
  eliminados: {
    horario_historial: number
    horario_detalle: number
    horarios: number
  }
}

export const fetchResetState = async () => {
  try {
    return await $apiSchedules<ResetStateResponse>('/api/reset/estado')
  }
  catch (error) {
    toast.error('Error al obtener el estado de limpieza', {
      description: (error as any).data?.message ?? (error as any).data?.error,
    })
  }
}

export const resetComplete = async () => {
  try {
    return await $apiSchedules<ResetCompleteResponse>('/api/reset/completo', {
      method: 'DELETE',
    })
  }
  catch (error) {
    toast.error('Error al ejecutar la limpieza completa', {
      description: (error as any).data?.message ?? (error as any).data?.error,
    })
  }
}

export const resetSchedules = async () => {
  try {
    return await $apiSchedules<ResetSchedulesResponse>('/api/reset/horarios', {
      method: 'DELETE',
    })
  }
  catch (error) {
    toast.error('Error al eliminar horarios', {
      description: (error as any).data?.message ?? (error as any).data?.error,
    })
  }
}