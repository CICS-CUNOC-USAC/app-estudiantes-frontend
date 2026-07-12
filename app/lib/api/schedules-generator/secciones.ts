import { toast } from 'vue-sonner'
import type { Seccion, CreateSeccionInput, UpdateSeccionInput } from './types'

export type SeccionFkField =
  | 'curso_id'
  | 'salon_fijo_id'
  | 'docente_fijo_id'
  | 'periodo_fijo_inicio_id'
  | 'dia_horario_fijo_id'

export const mapSeccionFkError = (message?: string): SeccionFkField | null => {
  if (!message) return null
  const m = message.toLowerCase()
  if (m.includes('salón') || m.includes('salon')) return 'salon_fijo_id'
  if (m.includes('docente')) return 'docente_fijo_id'
  if (m.includes('período') || m.includes('periodo')) return 'periodo_fijo_inicio_id'
  if (m.includes('día') || m.includes('dia')) return 'dia_horario_fijo_id'
  if (m.includes('curso')) return 'curso_id'
  return null
}

export const fetchSecciones = async () => {
  try {
    const response = await $apiSchedules<Seccion[]>('/api/secciones')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener secciones', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchSeccionesByCurso = async (cursoId: number) => {
  try {
    const response = await $apiSchedules<Seccion[]>(`/api/secciones/curso/${cursoId}`)
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener secciones', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchSeccionById = async (id: number) => {
  try {
    return await $apiSchedules<Seccion>(`/api/secciones/${id}`)
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Sección no encontrada')
    } else {
      toast.error('Error al obtener sección', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

export const createSeccion = async (data: CreateSeccionInput) => {
  try {
    const response = await $apiSchedules<Seccion>('/api/secciones', {
      method: 'POST',
      body: data
    })
    toast.success('Sección creada exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status !== 404) {
      toast.error('Error al crear sección', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const updateSeccion = async (id: number, data: UpdateSeccionInput) => {
  try {
    const response = await $apiSchedules<Seccion>(`/api/secciones/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Sección actualizada exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status !== 404) {
      toast.error('Error al actualizar sección', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const deleteSeccion = async (id: number) => {
  try {
    await $apiSchedules(`/api/secciones/${id}`, { method: 'DELETE' })
    toast.success('Sección eliminada exitosamente')
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400 || error?.status === 409) {
      toast.error('No se puede eliminar', {
        description: message ?? 'La sección está siendo usada en otros registros'
      })
    } else if (error?.status === 404) {
      toast.error('Sección no encontrada')
    } else {
      toast.error('Error al eliminar sección', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}
