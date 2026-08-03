import type { Career, Pensum, PensumCoursesResponse, PensumSemesterCourse } from '~/utils/types/pensum-courses'


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

export async function getCourseBySemester(pensumId: number, semesterNumber: number): Promise<PensumSemesterCourse[]> {
  return $api<PensumSemesterCourse[]>(`/courses/pensum/${pensumId}/semester/${semesterNumber}`)
}

export async function getCourseByCode(code: string): Promise<PensumSemesterCourse> {
  return $api<PensumSemesterCourse>(`/courses/${code}`)
}