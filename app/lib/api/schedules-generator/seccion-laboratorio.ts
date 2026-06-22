import { toast } from 'vue-sonner'
import type { SeccionLaboratorio, CreateSeccionLaboratorioInput } from './types'

export const fetchSeccionLab = async () => {
  try {
    const response = await $apiSchedules<SeccionLaboratorio[]>('/api/seccion-laboratorio')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener secciones de laboratorio', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchSeccionLabBySeccion = async (seccionId: number) => {
  const all = await fetchSeccionLab()
  return all.filter((sl) => sl.seccion_id === seccionId)
}

export const createSeccionLab = async (data: CreateSeccionLaboratorioInput) => {
  try {
    const response = await $apiSchedules<SeccionLaboratorio>('/api/seccion-laboratorio', {
      method: 'POST',
      body: data
    })
    toast.success('Laboratorio asignado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 404) {
      toast.error('Error al asignar laboratorio', {
        description: message ?? 'La sección o el laboratorio no existen'
      })
    } else if (error?.status === 400 || error?.status === 409) {
      toast.error('Laboratorio ya asignado', {
        description: 'Este laboratorio ya está asignado a esta sección.'
      })
    } else {
      toast.error('Error al asignar laboratorio', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const deleteSeccionLab = async (id: number) => {
  try {
    await $apiSchedules(`/api/seccion-laboratorio/${id}`, { method: 'DELETE' })
    toast.success('Laboratorio eliminado de forma exitosa de la sección.')
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 404) {
      toast.error('Relación no encontrada')
    } else if (error?.status === 400 || error?.status === 409) {
      toast.error('No se puede eliminar', {
        description: 'El laboratorio está en uso por un horario generado. Elimina primero el horario.'
      })
    } else {
      toast.error('Error al eliminar relación', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}
