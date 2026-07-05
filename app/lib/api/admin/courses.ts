export type CourseDetail = {
  code: string
  name: string
  description: string
  credits: number
}

export type UpdateCoursePayload = {
  name?: string
  description?: string
  credits?: number
}

export async function getAllCourses() {
  const results = await $api<CourseDetail[]>(`/courses`)
  return { results }
}

export async function fetchCourse(code: string) {
  const result = await $api<CourseDetail>(`/courses/${code}`)
  return { result }
}

export async function updateCourse(code: string, payload: UpdateCoursePayload) {
  const result = await $api<CourseDetail>(`/courses/${code}`, {
    method: 'PATCH',
    body: payload
  })
  return { result }
}
