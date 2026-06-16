import { toast } from 'vue-sonner'
import type { Carrera, CreateCarreraInput, UpdateCarreraInput } from './types'

export const fetchCarreras = async () => {
  try {
    const response = await $apiSchedules<Carrera[]>('/api/carreras')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener carreras', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchCarreraById = async (id: number) => {
  try {
    return await $apiSchedules<Carrera>(`/api/carreras/${id}`)
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Carrera no encontrada')
    } else {
      toast.error('Error al obtener carrera', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

export const createCarrera = async (data: CreateCarreraInput) => {
  try {
    const response = await $apiSchedules<Carrera>('/api/carreras', {
      method: 'POST',
      body: data
    })
    toast.success('Carrera creada exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400 && message?.toLowerCase().includes('código')) {
      toast.error('Error al crear carrera', { description: 'El código ya existe' })
    } else {
      toast.error('Error al crear carrera', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const updateCarrera = async (id: number, data: UpdateCarreraInput) => {
  try {
    const response = await $apiSchedules<Carrera>(`/api/carreras/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Carrera actualizada exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400 && message?.toLowerCase().includes('código')) {
      toast.error('Error al actualizar carrera', { description: 'El código ya existe' })
    } else {
      toast.error('Error al actualizar carrera', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const deleteCarrera = async (id: number) => {
  try {
    await $apiSchedules(`/api/carreras/${id}`, { method: 'DELETE' })
    toast.success('Carrera eliminada exitosamente')
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400) {
      toast.error('No se puede eliminar', {
        description: 'La carrera está siendo usada por uno o más cursos'
      })
    } else if (error?.status === 404) {
      toast.error('Carrera no encontrada')
    } else {
      toast.error('Error al eliminar carrera', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}
