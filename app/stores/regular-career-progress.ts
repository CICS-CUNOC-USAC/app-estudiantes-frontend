import { defineStore } from 'pinia'
export interface Course {
  code: string
  name: string
  description: string
  credits: number
}

export interface CareerCourse {
  career_code: number
  course_code: string
  semester: number
  field: number
  mandatory: boolean
  course: Course
}

export interface CoursesSemesterProgress {
  id: number
  semester_progress_id: number
  course_code: string
  approved: boolean
  created_at: Date
  updated_at: Date
  career_course: CareerCourse
}
export interface SemesterProgress {
  id: number
  career_progress_id: number
  semester: number
  created_at: Date
  updated_at: Date
  courses_semester_progress: CoursesSemesterProgress[]
}
export interface Progress {
  id: number
  user_id: number
  career_code: number
  created_at: Date
  updated_at: Date
  semester_progress: SemesterProgress[]
}
export interface ProgressResponse {
  progress: Progress
  current_credits: number
  mandatory_credits: number
  available_credits: number
}
interface UpdatePayload {
  careerProgressId: number
  courseProgressId: number
  approved: boolean
}
// Options API Implementation
// export const useCareerProgressStore = defineStore('career-progress', {
//   state: () => ({
//     loading: false,
//     coursesProgress: {} as Progress | null
//   }),
//   actions: {
//     async fetchProgress() {
//       this.loading = true

//       const { data, error } = await useCustomFetch<ProgressResponse>(
//         'user-courses-progress',
//         {
//           method: 'GET'
//         }
//       )

//       // Error handling
//       if (error.value) {
//         if (error.value.data) {
//           useSnackbarStore().showSnackbar({
//             title: 'Error',
//             message: error.value.data.message,
//             type: SnackbarType.ERROR
//           })
//         } else {
//           useSnackbarStore().showSnackbar({
//             title: 'Error',
//             message: 'Something went wrong',
//             type: SnackbarType.ERROR
//           })
//         }
//       }

//       // Success
//       if (data.value) this.coursesProgress = data.value.progress
//       this.loading = false
//     }
//   }
// })

// Composition API Implementation
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
