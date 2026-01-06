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
  not_mandatory_credits: number
  total_credits: number
}

export type ProgressResponse = {
  progress: Progress
  current_credits: ProgressCredits
  mandatory_credits: number
  not_mandatory_credits: number
  available_credits: number
}

export type UpdateCareerItemPayload = {
  careerProgressId: number
  courseProgressId: number
  approved: boolean
}

export const careerProgressApi = {
  fetchProgress: async (): Promise<ProgressResponse> => {
    return $api<ProgressResponse>('/user-courses-progress')
  },

  updateCareerItem: async (
    payload: UpdateCareerItemPayload
  ): Promise<ProgressResponse> => {
    const {
      careerProgressId,
      courseProgressId: course_semester_progress_id,
      approved
    } = payload

    return $api<ProgressResponse>(
      `/user-courses-progress/${careerProgressId}`,
      {
        method: 'PATCH',
        body: {
          course_semester_progress_id,
          approved
        }
      }
    )
  }
}
