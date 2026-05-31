import { toast } from 'vue-sonner'
import type { TeacherCourse, CreateTeacherCourseInput, Course } from './types'

/**
 * Obtiene todas las relaciones docente-curso
 */
export const fetchTeacherCourses = async (options?: {
  docente_id?: number
  page?: number
  limit?: number
}) => {
  try {
    const params = new URLSearchParams()
    if (options?.docente_id) params.append('docente_id', String(options.docente_id))
    if (options?.page) params.append('page', String(options.page))
    if (options?.limit) params.append('limit', String(options.limit))

    const response = await $apiSchedules<TeacherCourse[]>('/api/docente-curso?' + params.toString())
    return response
  } catch (error: any) {
    toast.error('Error al obtener relaciones docente-curso', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Obtiene los cursos disponibles
 */
export const fetchCourses = async () => {
  try {
    const response = await $apiSchedules<Course[]>('/api/cursos')
    return response
  } catch (error: any) {
    toast.error('Error al obtener cursos', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

/**
 * Crea una nueva relación docente-curso
 */
export const createTeacherCourse = async (data: CreateTeacherCourseInput) => {
  try {
    const response = await $apiSchedules<TeacherCourse>('/api/docente-curso', {
      method: 'POST',
      body: data
    })
    toast.success('Relación docente-curso creada exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.message ?? error?.data?.error

    if (error?.status === 404) {
      toast.error('Error al crear relación', {
        description: 'El docente o curso no existe'
      })
    } else if (message?.includes('faltan')) {
      toast.error('Error al crear relación', {
        description: 'Faltan campos obligatorios'
      })
    } else {
      toast.error('Error al crear relación', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

/**
 * Elimina una relación docente-curso
 */
export const deleteTeacherCourse = async (id: number) => {
  try {
    await $apiSchedules(`/api/docente-curso/${id}`, {
      method: 'DELETE'
    })
    toast.success('Relación eliminada exitosamente')
  } catch (error: any) {
    const message = error?.data?.message ?? error?.data?.error

    if (error?.status === 404) {
      toast.error('Relación no encontrada')
    } else {
      toast.error('Error al eliminar relación', {
        description: message ?? 'Error desconocido'
      })
    }
    throw error
  }
}
