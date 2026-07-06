import { toast } from 'vue-sonner'
import type { Teacher, CreateTeacherInput, UpdateTeacherInput, TeachersResponse } from './types'

/**
 * Obtiene la lista de todos los docentes
 */
export const fetchTeachers = async (options?: {
  page?: number
  limit?: number
  nombre?: string
}) => {
  try {
    const params = new URLSearchParams()
    if (options?.page) params.append('page', String(options.page))
    if (options?.limit) params.append('limit', String(options.limit))
    if (options?.nombre) params.append('nombre', options.nombre)

    const url = params.toString() ? `/api/docentes?${params.toString()}` : '/api/docentes'
    
    const response = await $apiSchedules<Teacher[]>(url)
    
    // Convierte array simple a formato esperado
    return {
      results: Array.isArray(response) ? response : [],
      meta: {
        total: Array.isArray(response) ? response.length : 0,
        total_pages: 1,
        current_page: options?.page || 1,
        per_page: options?.limit || 10
      }
    }
  } catch (error: any) {
    toast.error('Error al obtener docentes', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Obtiene un docente específico por ID
 */
export const fetchTeacherById = async (id: number) => {
  try {
    const response = await $apiSchedules<Teacher>(`/api/docentes/${id}`)
    return response
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Docente no encontrado')
    } else {
      toast.error('Error al obtener docente', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Crea un nuevo docente
 */
export const createTeacher = async (data: CreateTeacherInput) => {
  try {
    const response = await $apiSchedules<Teacher>('/api/docentes', {
      method: 'POST',
      body: data
    })
    toast.success('Docente creado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.message ?? error?.data?.error
    if (message?.includes('registro_personal')) {
      toast.error('Error al crear docente', {
        description: 'El registro personal ya existe'
      })
    } else {
      toast.error('Error al crear docente', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Actualiza un docente existente
 */
export const updateTeacher = async (id: number, data: UpdateTeacherInput) => {
  try {
    const response = await $apiSchedules<Teacher>(`/api/docentes/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Docente actualizado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.message ?? error?.data?.error
    if (message?.includes('registro_personal')) {
      toast.error('Error al actualizar docente', {
        description: 'El registro personal ya existe'
      })
    } else {
      toast.error('Error al actualizar docente', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Elimina un docente
 */
export const deleteTeacher = async (id: number) => {
  try {
    await $apiSchedules(`/api/docentes/${id}`, {
      method: 'DELETE'
    })
    toast.success('Docente eliminado exitosamente')
  } catch (error: any) {
    const message = error?.data?.message ?? error?.data?.error
    if (error?.status === 400 && message?.includes('uso')) {
      toast.error('No se puede eliminar', {
        description: 'El docente está siendo usado en otras relaciones'
      })
    } else if (error?.status === 404) {
      toast.error('Docente no encontrado')
    } else {
      toast.error('Error al eliminar docente', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}
