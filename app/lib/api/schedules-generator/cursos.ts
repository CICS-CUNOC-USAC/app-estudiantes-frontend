import { toast } from 'vue-sonner'
import type { Curso, CreateCursoInput, UpdateCursoInput, BulkActionResponse } from './types'

export const fetchCursos = async () => {
  try {
    const response = await $apiSchedules<Curso[]>('/api/cursos')
    return Array.isArray(response) ? response : []
  } catch (error: any) {
    toast.error('Error al obtener cursos', {
      description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
    })
    throw error
  }
}

export const fetchCursoById = async (id: number) => {
  try {
    return await $apiSchedules<Curso>(`/api/cursos/${id}`)
  } catch (error: any) {
    if (error?.status === 404) {
      toast.error('Curso no encontrado')
    } else {
      toast.error('Error al obtener curso', {
        description: error?.data?.error ?? error?.data?.message ?? 'Error desconocido'
      })
    }
    throw error
  }
}

export const createCurso = async (data: CreateCursoInput) => {
  try {
    const response = await $apiSchedules<Curso>('/api/cursos', {
      method: 'POST',
      body: data
    })
    toast.success('Curso creado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 409) {
      toast.error('Error al crear curso', { description: 'Ya existe un curso con ese nombre' })
    } else {
      toast.error('Error al crear curso', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const updateCurso = async (id: number, data: UpdateCursoInput) => {
  try {
    const response = await $apiSchedules<Curso>(`/api/cursos/${id}`, {
      method: 'PUT',
      body: data
    })
    toast.success('Curso actualizado exitosamente')
    return response
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 409) {
      toast.error('Error al actualizar curso', { description: message ?? 'Conflicto de datos' })
    } else {
      toast.error('Error al actualizar curso', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const deleteCurso = async (id: number) => {
  try {
    await $apiSchedules(`/api/cursos/${id}`, { method: 'DELETE' })
    toast.success('Curso eliminado exitosamente')
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message
    if (error?.status === 400 || error?.status === 409) {
      toast.error('No se puede eliminar', {
        description: message ?? 'El curso está siendo usado en otros registros'
      })
    } else if (error?.status === 404) {
      toast.error('Curso no encontrado')
    } else {
      toast.error('Error al eliminar curso', { description: message ?? 'Error desconocido' })
    }
    throw error
  }
}

export const desactivarCursosPares = async () => {
  try {
    const response = await $apiSchedules<BulkActionResponse>('/api/cursos/desactivar-pares', { method: 'PATCH' })
    toast.success('Cursos desactivados', { description: `${response.cursos_afectados} cursos y ${response.laboratorios_afectados} laboratorios afectados` })
    return response
  } catch (error: any) {
    toast.error('Error al desactivar cursos', { description: error?.data?.error ?? 'Error desconocido' })
    throw error
  }
}

export const desactivarCursosImpares = async () => {
  try {
    const response = await $apiSchedules<BulkActionResponse>('/api/cursos/desactivar-impares', { method: 'PATCH' })
    toast.success('Cursos desactivados', { description: `${response.cursos_afectados} cursos y ${response.laboratorios_afectados} laboratorios afectados` })
    return response
  } catch (error: any) {
    toast.error('Error al desactivar cursos', { description: error?.data?.error ?? 'Error desconocido' })
    throw error
  }
}

export const desactivarTodosCursos = async () => {
  try {
    const response = await $apiSchedules<BulkActionResponse>('/api/cursos/desactivar-todos', { method: 'PATCH' })
    toast.success('Todos los cursos desactivados', { description: `${response.cursos_afectados} cursos y ${response.laboratorios_afectados} laboratorios afectados` })
    return response
  } catch (error: any) {
    toast.error('Error al desactivar cursos', { description: error?.data?.error ?? 'Error desconocido' })
    throw error
  }
}

export const activarTodosCursos = async () => {
  try {
    const response = await $apiSchedules<BulkActionResponse>('/api/cursos/activar-todos', { method: 'PATCH' })
    toast.success('Todos los cursos activados', { description: `${response.cursos_afectados} cursos y ${response.laboratorios_afectados} laboratorios afectados` })
    return response
  } catch (error: any) {
    toast.error('Error al activar cursos', { description: error?.data?.error ?? 'Error desconocido' })
    throw error
  }
}
