export interface ImportResponse {
  mensaje: string
  total_filas: number
  insertados: number
  actualizados: number
  omitidos: number
  detalles?: string[]
}

export interface ImportState {
  teachers?: ImportResponse
  courses?: ImportResponse
  teacherCourse?: ImportResponse
  classrooms?: ImportResponse
  labs?: ImportResponse
  sections?: ImportResponse
  sectionLab?: ImportResponse
}

export type ImportType = 'teachers' | 'courses' | 'teacher-course' | 'classrooms' | 'labs' | 'sections' | 'section-lab'
