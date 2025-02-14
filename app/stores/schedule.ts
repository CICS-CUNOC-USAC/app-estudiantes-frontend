import { defineStore } from 'pinia'
import type { Course } from '~/utils/types/schedule-courses'

export const useScheduleStore = defineStore('schedule-courses', () => {
  const loading = ref<boolean>(false)
  const schedule = ref<Array<Course>>([
    {
      id: 0,
      career_code: 0,
      course_code: '',
      section_id: 0,
      classroom_id: 0,
      periods: [],
      career_course: {
        semester: 0,
        field: 0,
        career: {
          name: ''
        },
        course: {
          name: ''
        },
        career_field: {
          career_code: 36,
          field_number: 3,
          name: "",
          common_field: false
        },
      },
      section: {
        name: ''
      },
      classroom: {
        name: ''
      }
    }
  ])

  const fetchScheduleCourses = async () => {
    // loading.value = true
    // const { data, error } = await useCustomFetch<Array<Course>>(
    //   `/schedules/courses`,
    //   {
    //     method: 'GET'
    //   }
    // )
    // if (data.value) {
    //   schedule.value = data.value
    // }
    // loading.value = false
  }
  return {
    loading,
    schedule,
    fetchScheduleCourses
  }
})
