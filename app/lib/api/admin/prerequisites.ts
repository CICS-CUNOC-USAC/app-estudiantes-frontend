export type CoursePrerequisiteEntry = {
  id: number
  course_code: string
  career_course_prerequisite_id: number
  course: { code: string; name: string; credits: number }
}

export type CreditsPrerequisiteEntry = {
  id: number
  career_course_prerequisite_id: number
  credits: number
}

export type Prerequisite = {
  id: number
  course_code: string
  is_course: boolean
  pensum_id: number
  coursePrerequisites: CoursePrerequisiteEntry[]
  creditsPrerequisites: CreditsPrerequisiteEntry[]
}

export type CreateCoursePrerequisitePayload = {
  isCourse: true
  prerequisiteCourseCode: string
}

export type CreateCreditsPrerequisitePayload = {
  isCourse: false
  credits: number
}

export type CreatePrerequisitePayload = CreateCoursePrerequisitePayload | CreateCreditsPrerequisitePayload

export type UpdatePrerequisitePayload = {
  prerequisiteCourseCode?: string
  credits?: number
}

const basePath = (pensumId: number | string, courseCode: string) =>
  `/pensums/${pensumId}/courses/${courseCode}/prerequisites`

export async function fetchPrerequisites(pensumId: number | string, courseCode: string) {
  return await $api<Prerequisite[]>(basePath(pensumId, courseCode))
}

export async function createPrerequisite(
  pensumId: number | string,
  courseCode: string,
  payload: CreatePrerequisitePayload
) {
  return await $api<Prerequisite>(basePath(pensumId, courseCode), {
    method: 'POST',
    body: payload
  })
}

export async function updatePrerequisite(
  pensumId: number | string,
  courseCode: string,
  id: number,
  payload: UpdatePrerequisitePayload
) {
  return await $api<Prerequisite>(`${basePath(pensumId, courseCode)}/${id}`, {
    method: 'PATCH',
    body: payload
  })
}

export async function deletePrerequisite(
  pensumId: number | string,
  courseCode: string,
  id: number
) {
  return await $api(`${basePath(pensumId, courseCode)}/${id}`, {
    method: 'DELETE'
  })
}
