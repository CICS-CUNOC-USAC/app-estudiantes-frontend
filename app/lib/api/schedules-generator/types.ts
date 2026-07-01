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

// Teachers types
export interface Teacher {
  id: number
  nombre: string
  registro_personal: string
  hora_entrada: string
  hora_salida: string
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateTeacherInput {
  nombre: string
  registro_personal: string
  hora_entrada: string
  hora_salida: string
  activo: boolean
}

export interface UpdateTeacherInput extends Partial<CreateTeacherInput> {}

export interface TeachersResponse {
  results: Teacher[]
  meta: {
    total: number
    total_pages: number
    current_page: number
    per_page: number
  }
}

// Teacher-Course types
export interface TeacherCourse {
  id: number
  docente_id: number
  curso_id: number
  puede_laboratorio: boolean
  activo?: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateTeacherCourseInput {
  docente_id: number
  curso_id: number
  puede_laboratorio?: boolean
}

export interface Course {
  id: number
  nombre: string
  codigo: string
  creditos: number
}

// Carreras types
export interface Carrera {
  id: number
  nombre: string
  codigo: string
  created_at?: string
  updated_at?: string
}

export interface CreateCarreraInput {
  nombre: string
  codigo: string
}

export interface UpdateCarreraInput extends Partial<CreateCarreraInput> {}

// Cursos types
export interface Curso {
  id: number
  nombre: string
  codigo: string
  carrera_id: number | null
  semestre: number
  tipo: 'obligatorio' | 'optativo'
  num_estudiantes: number | null
  puede_manana: boolean
  puede_tarde: boolean
  tiene_laboratorio: boolean
  activo: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateCursoInput {
  nombre: string
  codigo: string
  carrera_id?: number | null
  semestre: number
  tipo: 'obligatorio' | 'optativo'
  num_estudiantes?: number | null
  puede_manana: boolean
  puede_tarde: boolean
  tiene_laboratorio: boolean
  activo: boolean
}

export interface UpdateCursoInput extends Partial<CreateCursoInput> {}

export interface BulkActionResponse {
  message: string
  cursos_afectados: number
  laboratorios_afectados: number
}
