import type { Pensum, PensumCoursesResponse } from '~/utils/types/pensum-courses'

export type CreatePensumPayload = {
  career_code: number
  year: number
  active?: boolean
}

export type UpdatePensumPayload = Partial<CreatePensumPayload>

export async function getAllPensums(params?: { career_code?: number }) {
  const results = await $api<Pensum[]>(`/pensums`, { params })
  return { results }
}

export async function fetchPensum(id: number | string) {
  const result = await $api<Pensum>(`/pensums/${id}`)
  return { result }
}

export async function createPensum(payload: CreatePensumPayload) {
  const result = await $api<Pensum>(`/pensums`, {
    method: 'POST',
    body: payload
  })
  return { result }
}

export async function updatePensum(id: number | string, payload: UpdatePensumPayload) {
  const result = await $api<Pensum>(`/pensums/${id}`, {
    method: 'PATCH',
    body: payload
  })
  return { result }
}

export async function deletePensum(id: number | string) {
  await $api(`/pensums/${id}`, { method: 'DELETE' })
}

export async function fetchPensumCourses(pensumId: number | string) {
  const result = await $api<PensumCoursesResponse>(`/pensums/${pensumId}/courses`)
  return { result }
}

export type ClonePensumPayload = {
  sourcePensumId: number
  year: number
}

export async function clonePensum(payload: ClonePensumPayload) {
  const result = await $api<Pensum>(`/pensums/clone`, {
    method: 'POST',
    body: payload
  })
  return { result }
}

export type AddCourseToPensumPayload = {
  courseCode: string
  courseName: string
  courseDescription: string
  courseCredits: number
  semester: number
  field: number
  mandatory: boolean
}

export async function addCourseToPensum(pensumId: number | string, payload: AddCourseToPensumPayload) {
  const result = await $api(`/pensums/${pensumId}/courses`, {
    method: 'POST',
    body: payload
  })
  return { result }
}

export async function removeCourseFromPensum(pensumId: number | string, courseCode: string) {
  await $api(`/pensums/${pensumId}/courses/${courseCode}`, { method: 'DELETE' })
}
