import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ImportResponse, ImportType } from '~/lib/api/schedules-generator/types'
import {
  importTeachers,
  importCourses,
  importTeacherCourse,
  importClassrooms,
  importLabs,
  importSections,
  importSectionLab,
} from '~/lib/api/schedules-generator/imports'

const importTypeToFunction: Record<ImportType, (file: File) => Promise<ImportResponse | undefined>> = {
  'teachers': importTeachers,
  'courses': importCourses,
  'teacher-course': importTeacherCourse,
  'classrooms': importClassrooms,
  'labs': importLabs,
  'sections': importSections,
  'section-lab': importSectionLab,
}

export const useSchedulesGeneratorStore = defineStore('schedules-generator', () => {
  // State
  const results = ref<Record<ImportType, ImportResponse | null>>({
    teachers: null,
    courses: null,
    'teacher-course': null,
    classrooms: null,
    labs: null,
    sections: null,
    'section-lab': null,
  })

  const loading = ref<Record<ImportType, boolean>>({
    teachers: false,
    courses: false,
    'teacher-course': false,
    classrooms: false,
    labs: false,
    sections: false,
    'section-lab': false,
  })

  const error = ref<Record<ImportType, string | null>>({
    teachers: null,
    courses: null,
    'teacher-course': null,
    classrooms: null,
    labs: null,
    sections: null,
    'section-lab': null,
  })

  // Actions
  const importFile = async (type: ImportType, file: File) => {
    loading.value[type] = true
    error.value[type] = null

    try {
      const importFn = importTypeToFunction[type]
      const response = await importFn(file)
      if (response) {
        results.value[type] = response
      }
    }
    catch (err: any) {
      error.value[type] = err.message || 'Error al importar archivo'
      results.value[type] = null
    }
    finally {
      loading.value[type] = false
    }
  }

  const clearResult = (type: ImportType) => {
    results.value[type] = null
    error.value[type] = null
  }

  const clearAll = () => {
    Object.keys(results.value).forEach((key) => {
      results.value[key as ImportType] = null
      error.value[key as ImportType] = null
    })
  }

  return {
    results,
    loading,
    error,
    importFile,
    clearResult,
    clearAll,
  }
})
