import { toast } from 'vue-sonner'
import type { Laboratorio, CreateLaboratorioInput, UpdateLaboratorioInput } from './types'

/**
 * Obtiene la lista de todos los laboratorios
 */
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

/**
 * Obtiene un laboratorio específico por ID
 */
export const fetchLaboratorioById = async (id: number) => {
  try {
    return await $apiSchedules<Laboratorio>(`/api/laboratorios/${id}`)
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Laboratorio no encontrado')
    } else {
      toast.error('Error al obtener laboratorio', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Obtiene los laboratorios de un curso específico
 */
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

/**
 * Crea un nuevo laboratorio
 */
export const createLaboratorio = async (data: CreateLaboratorioInput) => {
  try {
    const response = await $apiSchedules<Laboratorio>('/api/laboratorios', {
      method: 'POST',
      body: data
    })
    toast.success('Laboratorio creado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 404) {
      toast.error('Error al crear laboratorio', {
        description: message ?? 'El curso indicado no existe'
      })
    } else if (error?.status === 409) {
      toast.error('Error al crear laboratorio', {
        description: message ?? 'El curso ya tiene un laboratorio asignado'
      })
    } else {
      toast.error('Error al crear laboratorio', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Actualiza un laboratorio existente
 */
export const updateLaboratorio = async (id: number, data: UpdateLaboratorioInput) => {
  try {
    const response = await $apiSchedules<Laboratorio>(`/api/laboratorios/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Laboratorio actualizado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 404) {
      toast.error('Error al actualizar laboratorio', {
        description: message ?? 'El laboratorio o curso indicado no existe'
      })
    } else if (error?.status === 409) {
      toast.error('Error al actualizar laboratorio', {
        description: message ?? 'El curso ya tiene un laboratorio asignado'
      })
    } else {
      toast.error('Error al actualizar laboratorio', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Elimina un laboratorio.
 * Al eliminarlo, el backend marca el curso como sin laboratorio
 * (cursos.tiene_laboratorio = false) si ya no le quedan laboratorios.
 */
export const deleteLaboratorio = async (id: number) => {
  try {
    await $apiSchedules(`/api/laboratorios/${id}`, {
      method: 'DELETE'
    })
    toast.success('Laboratorio eliminado', {
      description: 'El curso quedó sin laboratorios asociados'
    })
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 404) {
      toast.error('Laboratorio no encontrado')
    } else {
      toast.error('Error al eliminar laboratorio', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}
