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

// ─── Horarios ──────────────────────────────────────────────────────────────

export interface Horario {
  id: number
  nombre: string
  fecha_generacion: string
  aptitud_final: number | null
  generaciones_ejecutadas: number | null
  tiempo_ejecucion_ms: number | null
  metodo_seleccion: string | null
  metodo_cruce: string | null
  metodo_mutacion: string | null
  es_activo: boolean
}

export interface HorarioDetalle {
  detalle_id: number
  seccion_id: number | null
  seccion_lab_id: number | null
  salon_id: number | null
  docente_id: number | null
  dia_horario_id: number
  periodo_inicio_id: number
  periodo_fin_id: number
  dia_especifico: string | null
  modificado_manual: boolean
  curso_id: number
  curso_nombre: string
  curso_codigo: string
  semestre: number
  curso_tipo: string
  carrera_id: number | null
  carrera_nombre: string | null
  seccion_letra: string | null
  salon_nombre: string | null
  salon_es_laboratorio: boolean | null
  docente_nombre: string | null
  hora_inicio: string
  hora_fin: string
  es_manana: boolean
  es_tarde: boolean
  dias_nombre: string
  dia_display: string
  es_laboratorio: boolean
}

export interface HorarioCompleto {
  horario: Horario
  detalles: HorarioDetalle[]
}

export interface EditarDetalleInput {
  salon_id?: number | null
  docente_id?: number | null
  periodo_inicio_id?: number
  periodo_fin_id?: number
  dia_horario_id?: number
  dia_especifico?: string | null
}

export interface EditarDetalleResult {
  detalle: HorarioDetalle
  nueva_aptitud: number | null
  advertencias: string[]
}

export interface ConflictoHorario {
  tipo: string
  descripcion?: string
  penalizacion?: number
  bono?: number
  [key: string]: unknown
}

export interface ConflictosResponse {
  aptitud: number
  aptitud_recalculada: number
  total_conflictos: number
  total_penalizacion: number
  total_bonos: number
  conflictos: ConflictoHorario[]
  bonos: ConflictoHorario[]
}

// ─── Salones ──────────────────────────────────────────────────────────────

export interface Salon {
  id: number
  nombre: string
  capacidad: number | null
  es_laboratorio: boolean
  activo?: boolean
}

// ─── Horario Personal ─────────────────────────────────────────────────────

export interface HorarioPersonalDetalle {
  seccion_id?: number
  seccion_lab_id?: number
}

export interface HorarioPersonal {
  estudiante: string
  horario_origen_id: number | null
  detalles: HorarioPersonalDetalle[]
  actualizado: string | null
}

// ─── Algoritmo Genético ────────────────────────────────────────────────────

export interface AlgoritmoConfig {
  id?: number
  tamano_poblacion: number
  max_generaciones: number
  aptitud_objetivo: number | null
  tasa_mutacion: number
  metodo_seleccion: 'torneo' | 'ruleta'
  metodo_cruce: 'un_punto' | 'multipunto'
  metodo_mutacion: 'intercambio' | 'reisercion'
  duracion_periodo: number
  hora_inicio_manana: string
  hora_fin_manana: string
  hora_inicio_tarde: string
  hora_fin_tarde: string
}

export interface AlgoritmoEstado {
  corriendo: boolean
  generacion: number
  mejorAptitud: number | null
  conflictos: number | null
  horarioId: number | null
  error: string | null
}

export interface HistorialRow {
  generacion: number
  mejor_aptitud: number
  conflictos: number
}

export type WsEvent =
  | { type: 'connected';  payload: { message: string } }
  | { type: 'estado';     payload: AlgoritmoEstado }
  | { type: 'progreso';   payload: { generacion: number; mejorAptitud: number; conflictos: number } }
  | { type: 'finalizado'; payload: { horarioId: number; stats: unknown } }
  | { type: 'error';      payload: { message: string } }

export interface EjecutarBody {
  nombre?: string
  tamano_poblacion?: number
  max_generaciones?: number
  metodo_seleccion?: AlgoritmoConfig['metodo_seleccion']
  metodo_cruce?: AlgoritmoConfig['metodo_cruce']
  metodo_mutacion?: AlgoritmoConfig['metodo_mutacion']
  tasa_mutacion?: number
  aptitud_objetivo?: number
}
