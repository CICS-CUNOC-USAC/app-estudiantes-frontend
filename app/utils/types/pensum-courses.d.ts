export type Pensum = {
  id: number
  career_code: number
  year: number
  active: boolean
  career: Career
}

export type PensumCoursesResponse = {
  career_name: string
  career_code: number
  pensum_id: number
  pensum_year: number
  courses: PensumSemester[]
}

export type PensumSemester = {
  semester: string
  courses: PensumSemesterCourse[]
}

export type PensumSemesterCourse = {
  pensum_id: number
  course_code: string
  semester: number
  field: number
  mandatory: boolean
  field_name: string
  course: Course
}

export type Course = {
  name: string
  credits: number
}

export type Career = {
  code: number
  name: string
}
