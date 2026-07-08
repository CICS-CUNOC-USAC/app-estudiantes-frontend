import { toast } from 'vue-sonner'
import type { Salon, CreateSalonInput, UpdateSalonInput } from './types'

/**
 * Obtiene la lista de todos los salones
 */
export const fetchSalones = async () => {
  try {
    const response = await $apiSchedules<Salon[]>('/api/salones')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener salones', {
      description:
        error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Obtiene un salón específico por ID
 */
export const fetchSalonById = async (id: number) => {
  try {
    return await $apiSchedules<Salon>(`/api/salones/${id}`)
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Salón no encontrado')
    } else {
      toast.error('Error al obtener salón', {
        description:
          error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Crea un nuevo salón
 */
export const createSalon = async (data: CreateSalonInput) => {
  try {
    const response = await $apiSchedules<Salon>('/api/salones', {
      method: 'POST',
      body: data
    })
    toast.success('Salón creado exitosamente')
    return response
  } catch (error: any) {
    toast.error('Error al crear salón', {
      description:
        error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Actualiza un salón existente
 */
export const updateSalon = async (id: number, data: UpdateSalonInput) => {
  try {
    const response = await $apiSchedules<Salon>(`/api/salones/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Salón actualizado exitosamente')
    return response
  } catch (error: any) {
    toast.error('Error al actualizar salón', {
      description:
        error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Elimina un salón
 */
export const deleteSalon = async (id: number) => {
  try {
    await $apiSchedules(`/api/salones/${id}`, {
      method: 'DELETE'
    })
    toast.success('Salón eliminado exitosamente')
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400) {
      // El backend responde 400 cuando el salón está referenciado por otros
      // registros (secciones, laboratorios u horarios).
      toast.error('No se puede eliminar', {
        description: message ?? 'El salón está siendo usado en otros registros'
      })
    } else if (error?.status === 404) {
      toast.error('Salón no encontrado')
    } else {
      toast.error('Error al eliminar salón', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}
