import { toast } from 'vue-sonner'
import type { HorarioPersonal, HorarioPersonalDetalle } from './types'

export const getPersonal = async (ra: string): Promise<HorarioPersonal> => {
  try {
    return await $apiSchedules<HorarioPersonal>(`/api/horarios-personales/${ra}`)
  } catch (error: any) {
    if (error?.status === 404) {
      return { estudiante: ra, horario_origen_id: null, detalles: [], actualizado: null }
    }
    toast.error('Error al cargar horario personal', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const savePersonal = async (
  ra: string,
  body: { horario_origen_id: number | null; detalles: HorarioPersonalDetalle[] }
): Promise<HorarioPersonal> => {
  try {
    return await $apiSchedules<HorarioPersonal>(`/api/horarios-personales/${ra}`, {
      method: 'PUT',
      body
    })
  } catch (error: any) {
    toast.error('Error al guardar horario personal', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const deletePersonal = async (ra: string): Promise<void> => {
  try {
    await $apiSchedules(`/api/horarios-personales/${ra}`, { method: 'DELETE' })
    toast.success('Horario personal reiniciado')
  } catch (error: any) {
    toast.error('Error al reiniciar horario personal', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}
