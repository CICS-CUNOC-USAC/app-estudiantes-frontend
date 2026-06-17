import { defineStore } from 'pinia'
import { type PensumCourse } from '~/lib/api/dashboard/career-progress'

export const useCoursesStore = defineStore('courses', () => {
  const loading = ref<boolean>(false)
  const pensumCourse = ref<PensumCourse>({
    pensum_id: 0,
    course_code: '',
    semester: 0,
    field: 0,
    field_name: '',
    mandatory: false,
    course: {
      code: '',
      name: '',
      description: '',
      credits: 0
    }
  })

  const fetchPensumCourse = async (code: string, pensumId: number) => {
    loading.value = true
    try {
      const response = await $api<PensumCourse>(
        `/courses/${code}/pensum/${pensumId}`
      )
      pensumCourse.value = response
      return {
        response,
        error: null
      }
    } catch (error) {
      return {
        error
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    pensumCourse,
    fetchPensumCourse
  }
})
