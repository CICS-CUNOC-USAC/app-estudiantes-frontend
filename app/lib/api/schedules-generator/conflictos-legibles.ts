import type { ConflictoHorario, Carrera, Salon, Teacher, Curso } from './types'
import type { Period } from './periods'

/**
 * El genetic-scheduler describe los conflictos en formato técnico interno
 * (ej. "Docente 23 tiene 2 asignaciones en slot 24-1-8", donde el slot es
 * id-dia-periodo). Este módulo los traduce a lenguaje natural usando los
 * catálogos ya cargados (docentes, salones, carreras, periodos, cursos),
 * SIN tocar el backend (regla de oro del plan maestro).
 */

export interface ConflictoLegible {
  /** Etiqueta humana del tipo de conflicto */
  tipo: string
  /** Explicación en lenguaje natural (día, hora y nombres reales) */
  descripcion: string
  /** Descripción técnica original del backend, como referencia */
  original: string
  penalizacion?: number
}

export interface CatalogosConflicto {
  periodos: Period[]
  docentes: Teacher[]
  salones: Salon[]
  carreras: Carrera[]
  cursos?: Curso[]
}

const TIPO_LABEL: Record<string, string> = {
  conflicto_docente: 'Docente con dos clases a la misma hora',
  conflicto_salon: 'Salón ocupado por dos clases a la misma hora',
  conflicto_semestre: 'Choque de cursos del mismo semestre',
  horario_incorrecto: 'Curso asignado fuera de su jornada permitida',
  salon_inadecuado: 'Tipo de salón incorrecto',
  docente_fuera_horario: 'Docente asignado fuera de su horario laboral',
  capacidad_superada: 'Capacidad del salón superada',
  docente_no_autorizado: 'Docente no autorizado para el curso',
  sobreuso_periodo: 'Más cursos que salones disponibles',
  continuidad_semestre: 'Huecos entre cursos del mismo semestre',
}

// En los slots del algoritmo: 1 = patrón Lunes/Miércoles/Viernes, 2 = patrón
// Martes/Jueves (en labs equivale a martes), 4 = jueves (labs con día partido).
const DIA_LABEL: Record<string, string> = {
  1: 'los días Lunes, Miércoles y Viernes',
  2: 'los días Martes y Jueves',
  4: 'el día Jueves',
}

const hhmm = (h: string | null | undefined): string => (h ? h.slice(0, 5) : '?')

export const tipoLegible = (tipo: string): string =>
  TIPO_LABEL[tipo] ?? tipo.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())

export function describirConflicto(c: ConflictoHorario, cat: CatalogosConflicto): ConflictoLegible {
  const original = c.descripcion ?? ''

  const dia = (id: string | number): string => DIA_LABEL[String(id)] ?? `el día ${id}`

  const rango = (periodoId: string | number): string => {
    const p = cat.periodos.find(x => x.id === Number(periodoId))
    return p ? `de ${hhmm(p.hora_inicio)} a ${hhmm(p.hora_fin)}` : `en el período #${periodoId}`
  }

  const docente = (id: string | number): string => {
    const d = cat.docentes.find(x => x.id === Number(id))
    return d ? `${d.nombre}` : `#${id}`
  }

  const salon = (id: string | number): string => {
    const s = cat.salones.find(x => x.id === Number(id))
    return s ? `${s.nombre}` : `#${id}`
  }

  const carrera = (id: string | number): string => {
    const ca = cat.carreras.find(x => x.id === Number(id))
    return ca ? ca.nombre : `carrera #${id}`
  }

  const curso = (id: string | number): string => {
    const cu = cat.cursos?.find(x => x.id === Number(id))
    return cu ? `"${cu.nombre}" (${cu.codigo})` : `#${id}`
  }

  const base = {
    tipo: tipoLegible(c.tipo),
    original,
    penalizacion: c.penalizacion,
  }

  let m: RegExpMatchArray | null

  // "Docente 23 tiene 2 asignaciones en slot 24-1-8" → slot = docenteId-dia-periodo.
  // OJO: el id confiable es el PRIMERO del slot (el backend lo resuelve contra la BD);
  // el número tras "Docente" puede ser un índice interno del genoma y no coincidir.
  m = original.match(/^Docente \d+ tiene (\d+) asignaciones en slot (\d+)-(\d+)-(\d+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `El docente ${docente(m[2]!)} tiene ${m[1]} clases asignadas al mismo tiempo, ${dia(m[3]!)} ${rango(m[4]!)}. Es necesario mover una de esas clases o asignarle otro docente.`,
    }
  }

  // "Salón 21 tiene 2 asignaciones en slot 21-1-14" → slot = salonId-dia-periodo
  // (mismo caso: el id confiable es el del slot)
  m = original.match(/^Salón \d+ tiene (\d+) asignaciones en slot (\d+)-(\d+)-(\d+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `El salón ${salon(m[2]!)} tiene ${m[1]} clases programadas al mismo tiempo, ${dia(m[3]!)} ${rango(m[4]!)}. Una de ellas debe cambiar de salón u horario.`,
    }
  }

  // "Semestre 5 carrera 2 tiene 2 cursos obligatorios en slot 5-2-1-9" → slot = sem-carrera-dia-periodo
  m = original.match(/^Semestre (\d+) carrera (\d+) tiene (\d+) cursos obligatorios en slot \d+-\d+-(\d+)-(\d+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `Los estudiantes de ${carrera(m[2]!)} del semestre ${m[1]} tienen ${m[3]} cursos obligatorios a la misma hora, ${dia(m[4]!)} ${rango(m[5]!)}: no podrían asistir a todos.`,
    }
  }

  // "Docente 7 no está autorizado para curso 88"
  m = original.match(/^Docente (\d+) no está autorizado para curso (\d+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `El docente ${docente(m[1]!)} quedó asignado al curso ${curso(m[2]!)}, pero no está autorizado para impartirlo.`,
    }
  }

  // "Slot 1-9 tiene 25 cursos para 22 salones"  → slot = dia-periodo
  m = original.match(/^Slot (\d+|null)-(\d+|null) tiene (\d+) cursos para (\d+) salones$/)
  if (m) {
    const cuando = m[1] !== 'null' && m[2] !== 'null' ? `${dia(m[1]!)} ${rango(m[2]!)}` : 'en un mismo horario'
    return {
      ...base,
      descripcion: `Hay ${m[3]} cursos programados a la vez ${cuando}, pero solo existen ${m[4]} salones disponibles.`,
    }
  }

  // "Gen 23 asignado en mañana pero puede_manana=false" (Gen = sección o lab-N)
  m = original.match(/^Gen (.+) asignado en (mañana|tarde) pero puede_(?:manana|tarde)=false$/)
  if (m) {
    const queEs = String(m[1]).startsWith('lab-')
      ? `El laboratorio de la sección #${String(m[1]).slice(4)}`
      : `La sección #${m[1]}`
    return {
      ...base,
      descripcion: `${queEs} quedó programada en la ${m[2]}, pero ese curso solo puede impartirse en la otra jornada.`,
    }
  }

  // "Curso teórico 23 en laboratorio X no habilitado para teóricos"
  m = original.match(/^Curso teórico (\d+) en laboratorio (.+) no habilitado para teóricos$/)
  if (m) {
    return {
      ...base,
      descripcion: `La sección teórica #${m[1]} quedó en el laboratorio "${m[2]}", que no está habilitado para clases teóricas.`,
    }
  }

  // "Lab 15 asignado a salón teórico X"
  m = original.match(/^Lab (\d+) asignado a salón teórico (.+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `El laboratorio #${m[1]} quedó asignado al salón teórico "${m[2]}", que no cuenta con equipo de laboratorio.`,
    }
  }

  // "Semestre 5 carrera 2: cursos consecutivos en día 1"
  m = original.match(/^Semestre (\d+) carrera (\d+): cursos consecutivos en día (\d+)$/)
  if (m) {
    return {
      ...base,
      descripcion: `Los cursos del semestre ${m[1]} de ${carrera(m[2]!)} quedan con huecos entre clases ${dia(m[3]!)}.`,
    }
  }

  // "Docente Juan Pérez asignado fuera de su horario (08:00:00-08:50:00)" — ya trae
  // nombre; solo se limpia el formato de la hora.
  m = original.match(/^Docente (.+) asignado fuera de su horario \((\d{2}:\d{2})(?::\d{2})?-(\d{2}:\d{2})(?::\d{2})?\)$/)
  if (m) {
    return {
      ...base,
      descripcion: `El docente ${m[1]} tiene una clase de ${m[2]} a ${m[3]}, fuera de su horario de trabajo registrado.`,
    }
  }

  // "45 estudiantes en salón X (capacidad 30)"
  m = original.match(/^(\d+) estudiantes en salón (.+) \(capacidad (\d+)\)$/)
  if (m) {
    return {
      ...base,
      descripcion: `Se asignaron ${m[1]} estudiantes al salón "${m[2]}", que solo tiene capacidad para ${m[3]}.`,
    }
  }

  // Sin patrón conocido: se muestra el texto original con el tipo traducido
  return { ...base, descripcion: original || tipoLegible(c.tipo) }
}

export const describirConflictos = (
  conflictos: ConflictoHorario[],
  cat: CatalogosConflicto,
): ConflictoLegible[] => conflictos.map(c => describirConflicto(c, cat))
