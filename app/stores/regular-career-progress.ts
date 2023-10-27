import { defineStore } from 'pinia'
export type Course = {
  code: string
  name: string
  description: string
  credits: number
}

export type CareerCourse = {
  career_code: number
  course_code: string
  semester: number
  field: number
  field_name: string
  mandatory: boolean
  course: Course
}

export type CoursesSemesterProgress = {
  id: number
  semester_progress_id: number
  course_code: string
  approved: boolean
  created_at: Date
  updated_at: Date
  career_course: CareerCourse
}
export type SemesterProgress = {
  id: number
  career_progress_id: number
  semester: number
  created_at: Date
  updated_at: Date
  courses_semester_progress: CoursesSemesterProgress[]
}
export type Progress = {
  id: number
  user_id: number
  career_code: number
  created_at: Date
  updated_at: Date
  semester_progress: SemesterProgress[]
}

export type ProgressCredits = {
  mandatory_credits: number
  total_credits: number
}

export type ProgressResponse = {
  progress: Progress
  current_credits: ProgressCredits
  mandatory_credits: number
  available_credits: number
}

type UpdatePayload = {
  careerProgressId: number
  courseProgressId: number
  approved: boolean
}
export const useCareerProgressStoreC = defineStore('career_progress', () => {
  const loading = ref<boolean>(false)
  const coursesProgress = ref<ProgressResponse | null>(null)

  const fetchProgress = async () => {
    loading.value = true

    const { data, error } = await useCustomFetch<ProgressResponse>(
      'user-courses-progress',
      {
        method: 'GET'
      }
    )

    // Error handling
    if (error.value) {
      if (error.value.data) {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: error.value.data.message,
          type: SnackbarType.ERROR
        })
      } else {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: 'Something went wrong',
          type: SnackbarType.ERROR
        })
      }
    }

    // Success
    if (data.value) {
      coursesProgress.value = data.value
    }
    // console.log(coursesProgress.value)
    loading.value = false
    return coursesProgress.value
  }

  const updateItem = async (payload: UpdatePayload) => {
    loading.value = true
    const {
      careerProgressId,
      courseProgressId: course_semester_progress_id,
      approved
    } = payload

    const { data, error } = await useCustomFetch(
      `user-courses-progress/${careerProgressId}`,
      {
        method: 'PATCH',
        body: {
          course_semester_progress_id,
          approved
        }
      }
    )

    // Error handling
    if (error.value) {
      if (error.value.data) {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: error.value.data.message,
          type: SnackbarType.ERROR
        })
      } else {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: 'Something went wrong',
          type: SnackbarType.ERROR
        })
      }
    }

    if (data.value) {
      await fetchProgress()
    }
    // Success
    loading.value = false
  }

  return {
    loading,
    coursesProgress,
    fetchProgress,
    updateItem
  }
})
