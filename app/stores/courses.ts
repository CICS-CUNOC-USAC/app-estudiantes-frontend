import { defineStore } from 'pinia'
import { CareerCourse } from './regular-career-progress'

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
    const { data, error } = await useCustomFetch<CareerCourse>(
      `/courses/${code}/${careerCode}`,
      {
        method: 'GET'
      }
    )
    if (data.value) {
      careerCourse.value = data.value
    }
    // console.error(error)
    loading.value = false
  }

  return {
    loading,
    careerCourse,
    fetchCareerCourse
  }
})
