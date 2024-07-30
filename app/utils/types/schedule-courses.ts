export type ScheduleCourse = {
  curso: string
  docente: string
  codigo: string
  semestre: string
  codigo_salon: string
  nombre_salon: string
}

export type ScheduleLine = {
  hora: string
  cursos: Array<ScheduleCourse>
}

export type Period = {
  weekday_id: number
  start_time: string
  end_time: string
  weekay: {
    name: string
  }
}

export type Course = {
  id: number
  career_code: number
  course_code: string
  section_id: number
  classroom_id: number
  periods: Array<Period>
  career_course: {
    semester: number
    field: number
  }
  section: {
    name: string
  }
  classroom: {
    name: string
  }
}
