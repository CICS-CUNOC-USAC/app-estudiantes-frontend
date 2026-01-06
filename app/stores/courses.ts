import { defineStore } from 'pinia'
import { type CareerCourse } from '~/lib/api/dashboard/career-progress'

export const useCoursesStore = defineStore('courses', () => {
  const loading = ref<boolean>(false)
  const careerCourse = ref<CareerCourse>({
    career_code: 0,
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

  const fetchCareerCourse = async (code: string, careerCode: number) => {
    loading.value = true
    try {
      const response = await $api<CareerCourse>(
        `/courses/${code}/${careerCode}`
      )
      careerCourse.value = response
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
    careerCourse,
    fetchCareerCourse
  }
})
