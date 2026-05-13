import { toast } from 'vue-sonner'
import type { ImportResponse } from './types'

export const importTeachers = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/docentes', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar docentes', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importCourses = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/cursos', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar cursos', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importTeacherCourse = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/docente-curso', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar docente-curso', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importClassrooms = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/salones', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar salones', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importLabs = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/laboratorios', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar laboratorios', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importSections = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/secciones', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar secciones', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}

export const importSectionLab = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('archivo', file)
    const response = await $apiSchedules<ImportResponse>('/api/importar/seccion-laboratorio', {
      method: 'POST',
      body: formData
    })
    return response
  } catch (error) {
    toast.error('Error al importar seccion-laboratorio', { description: (error as any).data?.message ?? (error as any).data?.error })
  }
}
