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

// Salones types
export interface Salon {
  id: number
  nombre: string
  capacidad: number | null
  es_laboratorio: boolean
  lab_habilitado_teorico: boolean
  disponible_manana: boolean
  disponible_tarde: boolean
  activo: boolean
}

export interface CreateSalonInput {
  nombre: string
  capacidad?: number | null
  es_laboratorio: boolean
  lab_habilitado_teorico: boolean
  disponible_manana: boolean
  disponible_tarde: boolean
  activo: boolean
}

export interface UpdateSalonInput extends Partial<CreateSalonInput> {}

// Dias-horario types
export interface DiaHorarioDia {
  id: number
  nombre: string
  relacion_id: number
}

export interface DiaHorario {
  id: number
  nombre: string
  es_laboratorio: boolean
  dias: DiaHorarioDia[]
}

// Laboratorios types
export interface Laboratorio {
  id: number
  curso_id: number
  nombre: string | null
  num_periodos: number
  puede_manana: boolean
  puede_tarde: boolean
  activo: boolean
}

export interface CreateLaboratorioInput {
  curso_id: number
  nombre?: string | null
  num_periodos?: number
  puede_manana?: boolean
  puede_tarde?: boolean
  activo?: boolean
}

export interface UpdateLaboratorioInput extends Partial<CreateLaboratorioInput> {}

// Secciones types
export interface Seccion {
  id: number
  curso_id: number
  letra: string
  num_estudiantes_seccion: number | null
  salon_fijo_id: number | null
  docente_fijo_id: number | null
  periodo_fijo_inicio_id: number | null
  dia_horario_fijo_id: number | null
  sin_salon: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateSeccionInput {
  curso_id: number
  letra: string
  num_estudiantes_seccion?: number | null
  salon_fijo_id?: number | null
  docente_fijo_id?: number | null
  periodo_fijo_inicio_id?: number | null
  dia_horario_fijo_id?: number | null
  sin_salon?: boolean
}

export interface UpdateSeccionInput extends Partial<CreateSeccionInput> {}

export interface SeccionLaboratorio {
  id: number
  seccion_id: number
  laboratorio_id: number
  salon_fijo_id: number | null
  docente_fijo_id: number | null
  activo: boolean
}

export interface CreateSeccionLaboratorioInput {
  seccion_id: number
  laboratorio_id: number
  salon_fijo_id?: number | null
  docente_fijo_id?: number | null
}
