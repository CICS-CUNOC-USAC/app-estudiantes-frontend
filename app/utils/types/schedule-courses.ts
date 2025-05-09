export type ScheduleResponse = {
  courses: Course[]
}

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
  hours: Array<ScheduleHour>
  weekday: {
    name: string
  }
}

export type ScheduleHour = {
  start_time: string
  end_time: string
}

export type Hour = {
  id: number
  start_time: string
  end_time: string
}

export type Classroom = {
  id: number
  name: string
}

export type Course = {
  id: number
  career_code: number | null
  course_code: string
  section_id: number
  classroom_id: number
  periods: Array<Period>
  career_course: {
    semester: number
    field: number
    career: {
      name: string
    }
    course: {
      name: string
    },
    career_field: {
      career_code: number,
      field_number: number,
      name: string,
      common_field: boolean
    }
  }
  section: {
    name: string
  }
  classroom: {
    name: string
  }
}

export type LineSchedule = {
  start_time: string
  end_time: string
  //La clave es el codigo y la seccion del curso
  courses_map: Map<string, Course>
}
