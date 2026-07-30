import type { Career, Pensum, PensumCoursesResponse } from '~/utils/types/pensum-courses'


export async function getCareers(): Promise<Career[]> {
  return $api<Career[]>('/careers')
}


export async function getPensumsByCareer(careerCode: number): Promise<Pensum[]> {
  return $api<Pensum[]>(`/pensums?career_code=${careerCode}`)
}

export async function getCoursesByPensum(pensumId: number): Promise<PensumCoursesResponse> {
  return $api<PensumCoursesResponse>(`/pensums/${pensumId}/courses`)
}

export async function getCourseByCodeAndPensum(code: string, pensumId: number): Promise<PensumCoursesResponse> {
  return $api<PensumCoursesResponse>(`/courses/${code}/pensum/${pensumId}`)
}