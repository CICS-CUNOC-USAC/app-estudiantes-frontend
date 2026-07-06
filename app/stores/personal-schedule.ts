import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import type {
  Horario,
  HorarioDetalle,
  HorarioPersonalDetalle,
  Carrera,
} from '~/lib/api/schedules-generator/types'
import { fetchHorarios, fetchHorario, normalizarDetalles } from '~/lib/api/schedules-generator/horarios'
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import { getPersonal, savePersonal } from '~/lib/api/schedules-generator/horarios-personales'
import { resolveCarreraId } from '~/lib/api/schedules-generator/career-map'
import { careerProgressApi, type ProgressResponse } from '~/lib/api/dashboard/career-progress'
import { useRegularAuthStore } from '~/stores/regular-auth'

// Nombres de patrón de día (fijos, definidos en el DDL del scheduler: dias_horario)
const DIA_HORARIO_NOMBRE: Record<number, string> = {
  1: 'Lunes, Miércoles y Viernes',
  2: 'Martes y Jueves',
}

export const usePersonalScheduleStore = defineStore('personal-schedule', () => {
  // ── State ──────────────────────────────────────────────────────────────────

  const propuesto = ref<Horario | null>(null)
  const catalogo = ref<HorarioDetalle[]>([])
  const estudiante = ref<{
    ra: string
    carrera_id: number | null
    semestre: number | null
    cursos_pendientes: string[]
  }>({
    ra: '',
    carrera_id: null,
    semestre: null,
    cursos_pendientes: [],
  })
  const seleccion = ref<HorarioPersonalDetalle[]>([])
  const periodos = ref<Period[]>([])
  const progresoAcademico = ref<ProgressResponse | null>(null)
  const preferencias = ref<{ jornada: 'manana' | 'tarde' | 'ambas' }>({ jornada: 'ambas' })
  const loading = ref(false)
  const loadingSave = ref(false)
  const error = ref<string | null>(null)

  // ── Actions ────────────────────────────────────────────────────────────────

  const cargarPropuesto = async () => {
    loading.value = true
    error.value = null
    try {
      const lista = await fetchHorarios()
      const activo = lista.find(h => h.es_activo === true)
      if (!activo) return

      const [completo, fetchedPeriodos] = await Promise.all([
        fetchHorario(activo.id),
        fetchPeriods(),
      ])
      propuesto.value = completo.horario

      // Sin periodos la grilla no puede dibujarse: reintenta una vez y si no, error visible
      let periodosFinales = fetchedPeriodos
      if (!periodosFinales || periodosFinales.length === 0) {
        periodosFinales = await fetchPeriods()
      }
      if (periodosFinales && periodosFinales.length > 0) {
        periodos.value = periodosFinales
      }
      else {
        error.value = 'No se pudieron cargar los periodos de clase; el horario no puede dibujarse. Verifica el genetic-scheduler y reintenta.'
      }

      // Con periodos a mano se rellenan detalles con periodo/hora null (datos reales los traen)
      catalogo.value = normalizarDetalles(completo.detalles, periodos.value)
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al cargar horario propuesto'
    }
    finally {
      loading.value = false
    }
  }

  const cargarContextoEstudiante = async () => {
    loading.value = true
    error.value = null
    try {
      const authStore = useRegularAuthStore()
      const user = authStore.user
      if (!user) throw new Error('Usuario no autenticado')

      const [carreras, progressResponse] = await Promise.all([
        fetchCarreras(),
        careerProgressApi.fetchProgress(),
      ])
      // Se reutiliza la misma respuesta para el panel de avance (evita fetch doble)
      progresoAcademico.value = progressResponse

      const carreraId = resolveCarreraId(carreras as Carrera[], user.career.code)

      const semestres = progressResponse.progress?.semester_progress ?? []
      // Find the last semester that still has at least one unapproved course
      const semConPendientes = [...semestres]
        .reverse()
        .find(s => (s?.courses_semester_progress ?? []).some(c => !c?.approved))

      const semActual = semConPendientes ?? semestres[semestres.length - 1] ?? null

      const semestre = semActual?.semester ?? null
      const pendientesDelSemestre = (semActual?.courses_semester_progress ?? [])
        .filter(c => !c?.approved && c?.course_code)

      // Solo obligatorios del semestre (no optativos). Si el API de progreso no trae
      // `career_course.mandatory` fiable por registro (pasa en datos reales, mismo
      // problema que con los créditos) y ese filtro deja todo vacío pese a haber
      // pendientes, no se bloquea: se usan todos los pendientes en vez de nada.
      const pendientesObligatorios = pendientesDelSemestre.filter(c => c?.career_course?.mandatory)
      const pendientesFinal = pendientesObligatorios.length > 0 ? pendientesObligatorios : pendientesDelSemestre

      // String()+trim(): el API de progreso a veces manda códigos numéricos y a veces
      // strings, a veces con espacios; sin normalizar, las Map lookups fallan en silencio.
      const cursos_pendientes = pendientesFinal.map(c => String(c.course_code).trim())

      estudiante.value = { ra: user.ra, carrera_id: carreraId, semestre, cursos_pendientes }
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al cargar contexto del estudiante'
    }
    finally {
      loading.value = false
    }
  }

  const agregar = (detalle: HorarioDetalle) => {
    if (detalle.es_laboratorio) {
      if (!detalle.seccion_lab_id) return
      const yaExiste = seleccion.value.some(s => s.seccion_lab_id === detalle.seccion_lab_id)
      if (!yaExiste) seleccion.value.push({ seccion_lab_id: detalle.seccion_lab_id })
    }
    else {
      if (!detalle.seccion_id) return
      const yaExiste = seleccion.value.some(s => s.seccion_id === detalle.seccion_id)
      if (!yaExiste) seleccion.value.push({ seccion_id: detalle.seccion_id })
    }
  }

  const quitar = (detalle: HorarioDetalle) => {
    seleccion.value = seleccion.value.filter((s) => {
      if (detalle.es_laboratorio) return s.seccion_lab_id !== detalle.seccion_lab_id
      return s.seccion_id !== detalle.seccion_id
    })
  }

  // Empieza de cero: vacía toda la selección local (no toca lo ya guardado hasta "Guardar")
  const reiniciarHorario = () => {
    seleccion.value = []
  }

  // Cambiar de sección: en el horario personal "mover" un curso = elegir otra sección
  const cambiarSeccion = (actual: HorarioDetalle, nueva: HorarioDetalle) => {
    quitar(actual)
    agregar(nueva)
  }

  // El horario personal es de referencia del estudiante, no el oficial: se le permite
  // mover libremente un bloque a otro día/hora (a diferencia del horario oficial admin,
  // que sí debe ser exacto). Los choques se marcan como advertencia visual (rojo en la
  // grilla), nunca se bloquea la acción.
  const moverBloque = (detalle: HorarioDetalle, dia_horario_id: number, periodo_inicio_id: number) => {
    const esDeEsteBloque = (s: HorarioPersonalDetalle) =>
      detalle.es_laboratorio ? s.seccion_lab_id === detalle.seccion_lab_id : s.seccion_id === detalle.seccion_id
    seleccion.value = seleccion.value.map(s => esDeEsteBloque(s) ? { ...s, dia_horario_id, periodo_inicio_id } : s)
  }

  // Quita la posición personalizada: el bloque vuelve a la hora real de su sección oficial
  const restaurarPosicionOficial = (detalle: HorarioDetalle) => {
    const esDeEsteBloque = (s: HorarioPersonalDetalle) =>
      detalle.es_laboratorio ? s.seccion_lab_id === detalle.seccion_lab_id : s.seccion_id === detalle.seccion_id
    seleccion.value = seleccion.value.map((s) => {
      if (!esDeEsteBloque(s)) return s
      const { dia_horario_id: _d, periodo_inicio_id: _p, ...resto } = s
      return resto
    })
  }

  // Otras secciones del mismo curso y tipo (teórica/lab), distintas a la actual
  const seccionesAlternativas = (d: HorarioDetalle): HorarioDetalle[] => {
    const vistos = new Set<string>()
    return catalogo.value.filter((c) => {
      if (c.curso_codigo !== d.curso_codigo) return false
      if (c.es_laboratorio !== d.es_laboratorio) return false
      if (c.es_laboratorio ? c.seccion_lab_id === d.seccion_lab_id : c.seccion_id === d.seccion_id) return false
      const key = c.es_laboratorio ? `lab-${c.seccion_lab_id}` : `sec-${c.seccion_id}`
      if (vistos.has(key)) return false
      vistos.add(key)
      return true
    })
  }

  // ¿Esta sección choca con lo ya colocado (excluyendo el bloque que reemplazaría)?
  const chocaConSeleccion = (candidato: HorarioDetalle, excluir?: HorarioDetalle): boolean => {
    return bloquesColocados.value.some((b) => {
      if (excluir) {
        const mismo = excluir.es_laboratorio
          ? b.seccion_lab_id === excluir.seccion_lab_id
          : (!b.es_laboratorio && b.seccion_id === excluir.seccion_id)
        if (mismo) return false
      }
      if (b.dia_horario_id !== candidato.dia_horario_id) return false
      return b.periodo_inicio_id <= candidato.periodo_fin_id
        && candidato.periodo_inicio_id <= b.periodo_fin_id
    })
  }

  // Copia el horario propuesto a la selección. Por defecto solo la carrera+semestre
  // del estudiante, pero si esa combinación no tiene oferta este ciclo el estudiante
  // puede pedir duplicar de todos modos con un alcance más amplio ('carrera' = toda
  // su carrera, 'todo' = el propuesto completo). Devuelve cuántas secciones se
  // agregaron para que la página informe con la verdad.
  const duplicarPropuesto = (alcance: 'semestre' | 'carrera' | 'todo' = 'semestre'): number => {
    seleccion.value = []
    const base = alcance === 'semestre'
      ? catalogoDeMiSemestre.value
      : alcance === 'carrera'
        ? catalogoDeMiCarrera.value
        : catalogo.value
    const vistos = new Set<string>()
    let agregadas = 0
    for (const d of base) {
      const key = d.es_laboratorio ? `lab-${d.seccion_lab_id}` : `sec-${d.seccion_id}`
      if (vistos.has(key)) continue
      vistos.add(key)
      const antes = seleccion.value.length
      agregar(d)
      if (seleccion.value.length > antes) agregadas++
    }
    return agregadas
  }

  const estaSeleccionado = (detalle: HorarioDetalle): boolean => {
    if (detalle.es_laboratorio) {
      return seleccion.value.some(s => s.seccion_lab_id === detalle.seccion_lab_id)
    }
    return seleccion.value.some(s => s.seccion_id === detalle.seccion_id)
  }

  /**
   * Greedy heuristic: for each requested course code, pick the first teorica
   * section (filtered by jornada) that doesn't overlap with already-picked
   * blocks, then do the same for its matching lab section.
   *
   * Overlap check: two blocks conflict when they share at least one dia_horario_id
   * AND their periodo ranges intersect ([inicio, fin] inclusive).
   */
  const autoArmar = (cursos: string[], jornada: 'manana' | 'tarde' | 'ambas') => {
    seleccion.value = []
    const colocados: HorarioDetalle[] = []

    const overlaps = (a: HorarioDetalle, b: HorarioDetalle): boolean => {
      if (a.dia_horario_id !== b.dia_horario_id) return false
      return a.periodo_inicio_id <= b.periodo_fin_id && b.periodo_inicio_id <= a.periodo_fin_id
    }

    const conflictaConColocados = (candidato: HorarioDetalle): boolean =>
      colocados.some(c => overlaps(candidato, c))

    const pasaJornada = (d: HorarioDetalle): boolean => {
      if (jornada === 'manana') return d.es_manana
      if (jornada === 'tarde') return d.es_tarde
      return true
    }

    for (const codigo of cursos) {
      const teoricas = catalogo.value.filter(
        d => d.curso_codigo === codigo && !d.es_laboratorio,
      )

      // Preferred-first ordering: jornada match first, then by periodo_inicio_id
      const ordenadas = [...teoricas].sort((a, b) => {
        const aOk = pasaJornada(a) ? 0 : 1
        const bOk = pasaJornada(b) ? 0 : 1
        if (aOk !== bOk) return aOk - bOk
        return a.periodo_inicio_id - b.periodo_inicio_id
      })

      const elegida = ordenadas.find(
        d => pasaJornada(d) && !conflictaConColocados(d),
      ) ?? ordenadas.find(d => !conflictaConColocados(d))

      if (!elegida) continue

      colocados.push(elegida)
      agregar(elegida)

      // Pick a matching lab section that doesn't conflict
      const labs = catalogo.value.filter(
        d => d.curso_codigo === codigo && d.es_laboratorio,
      )
      const labOrdenados = [...labs].sort((a, b) => {
        const aOk = pasaJornada(a) ? 0 : 1
        const bOk = pasaJornada(b) ? 0 : 1
        if (aOk !== bOk) return aOk - bOk
        return a.periodo_inicio_id - b.periodo_inicio_id
      })

      const labElegido = labOrdenados.find(
        d => pasaJornada(d) && !conflictaConColocados(d),
      ) ?? labOrdenados.find(d => !conflictaConColocados(d))

      if (labElegido) {
        colocados.push(labElegido)
        agregar(labElegido)
      }
    }
  }

  const guardar = async () => {
    loadingSave.value = true
    try {
      await savePersonal(estudiante.value.ra, {
        horario_origen_id: propuesto.value?.id ?? null,
        detalles: seleccion.value,
      })
      toast.success('Horario personal guardado')
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al guardar horario personal'
    }
    finally {
      loadingSave.value = false
    }
  }

  const cargar = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await getPersonal(estudiante.value.ra)
      // El JSONB `detalles` puede venir null desde la BD: nunca dejar seleccion sin arreglo
      seleccion.value = Array.isArray(result.detalles) ? result.detalles : []
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al cargar horario personal'
    }
    finally {
      loading.value = false
    }
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  const catalogoDeMiSemestre = computed(() => {
    return catalogo.value.filter((d) => {
      if (estudiante.value.carrera_id !== null && d.carrera_id !== estudiante.value.carrera_id) {
        return false
      }
      if (estudiante.value.semestre !== null && d.semestre !== estudiante.value.semestre) {
        return false
      }
      return true
    })
  })

  // Todo el propuesto de la carrera del estudiante (cualquier semestre); es la base
  // de "duplicar de todos modos" cuando su semestre no tiene oferta este ciclo
  const catalogoDeMiCarrera = computed(() => {
    if (estudiante.value.carrera_id === null) return catalogo.value
    return catalogo.value.filter(d => d.carrera_id === estudiante.value.carrera_id)
  })

  const bloquesColocados = computed((): HorarioDetalle[] => {
    return catalogo.value
      .map((d) => {
        const entry = d.es_laboratorio
          ? seleccion.value.find(s => s.seccion_lab_id === d.seccion_lab_id)
          : seleccion.value.find(s => s.seccion_id === d.seccion_id)
        if (!entry) return null
        // Posición personalizada: se dibuja donde el estudiante la movió, manteniendo
        // la misma duración (span de periodos) que tenía en su horario oficial. También
        // se recalculan hora/día "de texto" (usados en diálogos y descripciones de
        // conflicto); si no se recalculan quedan mostrando la hora oficial vieja.
        if (entry.dia_horario_id !== undefined && entry.periodo_inicio_id !== undefined) {
          const span = d.periodo_fin_id - d.periodo_inicio_id
          const nuevoFin = entry.periodo_inicio_id + span
          const pIni = periodos.value.find(p => p.id === entry.periodo_inicio_id)
          const pFin = periodos.value.find(p => p.id === nuevoFin)
          const diasNombre = DIA_HORARIO_NOMBRE[entry.dia_horario_id] ?? d.dias_nombre
          return {
            ...d,
            dia_horario_id: entry.dia_horario_id,
            periodo_inicio_id: entry.periodo_inicio_id,
            periodo_fin_id: nuevoFin,
            hora_inicio: pIni?.hora_inicio ?? d.hora_inicio,
            hora_fin: pFin?.hora_fin ?? d.hora_fin,
            es_manana: pIni?.es_manana ?? d.es_manana,
            es_tarde: pIni?.es_tarde ?? d.es_tarde,
            dias_nombre: diasNombre,
            dia_display: diasNombre,
            modificado_manual: true,
          }
        }
        return d
      })
      .filter((d): d is HorarioDetalle => d !== null)
  })

  // Forma compatible con ConflictsDialog.vue (tipo/descripcion) para reutilizar el
  // mismo modal que usa el horario oficial admin, en vez de un componente aparte.
  const conflictosLocales = computed((): { tipo: string; descripcion: string }[] => {
    const bloques = bloquesColocados.value
    const conflictos: { tipo: string; descripcion: string }[] = []

    for (let i = 0; i < bloques.length; i++) {
      for (let j = i + 1; j < bloques.length; j++) {
        const a = bloques[i]
        const b = bloques[j]
        if (a.dia_horario_id !== b.dia_horario_id) continue
        const solapan = a.periodo_inicio_id <= b.periodo_fin_id
          && b.periodo_inicio_id <= a.periodo_fin_id
        if (solapan) {
          conflictos.push({
            tipo: 'Choque de horario',
            descripcion: `"${a.curso_nombre}" y "${b.curso_nombre}" se solapan el ${a.dias_nombre} (${a.hora_inicio}–${a.hora_fin} vs ${b.hora_inicio}–${b.hora_fin})`,
          })
        }
      }
    }
    return conflictos
  })

  // detalle_id en conflicto para pintarlos en la grilla del estudiante
  const conflictoIds = computed<number[]>(() => {
    const ids = new Set<number>()
    const bloques = bloquesColocados.value
    for (let i = 0; i < bloques.length; i++) {
      for (let j = i + 1; j < bloques.length; j++) {
        const a = bloques[i], b = bloques[j]
        if (a.dia_horario_id !== b.dia_horario_id) continue
        if (a.periodo_inicio_id <= b.periodo_fin_id && b.periodo_inicio_id <= a.periodo_fin_id) {
          ids.add(a.detalle_id)
          ids.add(b.detalle_id)
        }
      }
    }
    return [...ids]
  })

  // Map curso_codigo → nombre. Prioriza el catálogo del genetic-scheduler (curso_nombre,
  // fuente ya confirmada confiable) y solo recurre al progreso académico para cursos que
  // no tienen oferta este ciclo (por eso no aparecen en el catálogo).
  const nombrePorCurso = computed<Map<string, string>>(() => {
    const map = new Map<string, string>()
    const p = progresoAcademico.value
    if (p) {
      for (const sem of p.progress?.semester_progress ?? []) {
        for (const c of sem?.courses_semester_progress ?? []) {
          const curso = c?.career_course?.course
          const codigo = curso?.code ?? c?.career_course?.course_code ?? c?.course_code
          if (codigo && curso?.name) map.set(String(codigo).trim(), curso.name)
        }
      }
    }
    // El catálogo pisa al progreso académico: es la fuente que sabemos correcta.
    for (const d of catalogo.value) {
      if (d.curso_codigo && d.curso_nombre) map.set(String(d.curso_codigo), d.curso_nombre)
    }
    return map
  })

  const statsAcademicas = computed(() => {
    const p = progresoAcademico.value
    if (!p) return null
    const semestres = p.progress?.semester_progress ?? []
    const cursosAprobados = semestres.reduce(
      (n, s) => n + (s?.courses_semester_progress ?? []).filter(c => c?.approved).length, 0)
    const cursosTotales = semestres.reduce(
      (n, s) => n + (s?.courses_semester_progress ?? []).length, 0)
    const creditosGanados = p.current_credits?.total_credits ?? 0
    const creditosCarrera = (p.mandatory_credits ?? 0) + (p.not_mandatory_credits ?? 0)
    const pctAvance = creditosCarrera > 0
      ? Math.round((creditosGanados / creditosCarrera) * 100)
      : 0

    // Avance SOLO de cursos obligatorios del pensum, en créditos (misma fuente y
    // cálculo que /dashboard/pensum/progress). No se cuenta por curso porque el API
    // de progreso no puebla `career_course.mandatory` de forma confiable por registro.
    const creditosObligatoriosGanados = p.current_credits?.mandatory_credits ?? 0
    const creditosObligatoriosCarrera = p.mandatory_credits ?? 0
    const pctAvanceObligatorios = creditosObligatoriosCarrera > 0
      ? Math.round((creditosObligatoriosGanados / creditosObligatoriosCarrera) * 100)
      : 0

    return {
      cursosAprobados,
      cursosTotales,
      creditosGanados,
      creditosCarrera,
      creditosDisponibles: p.available_credits,
      pctAvance,
      creditosObligatoriosGanados,
      creditosObligatoriosCarrera,
      pctAvanceObligatorios,
    }
  })

  // Cursos pendientes del semestre que aún no están en el horario
  const cursosPendientesFaltantes = computed<string[]>(() => {
    const enHorario = new Set(bloquesColocados.value.map(d => d.curso_codigo))
    return estudiante.value.cursos_pendientes.filter(c => !enHorario.has(c))
  })

  // De los faltantes, separa los que sí tienen secciones en el propuesto de los
  // que no tienen oferta este ciclo (el pensum puede incluir cursos sin sección)
  const codigosConOferta = computed<Set<string>>(() =>
    new Set(catalogo.value.map(d => d.curso_codigo)),
  )

  const pendientesConOferta = computed<string[]>(() =>
    cursosPendientesFaltantes.value.filter(c => codigosConOferta.value.has(c)),
  )

  const pendientesSinOferta = computed<string[]>(() =>
    cursosPendientesFaltantes.value.filter(c => !codigosConOferta.value.has(c)),
  )

  // Sugerencia de cursos a armar en base al pensum completo (no solo el semestre
  // "actual" heurístico): pendientes con oferta este ciclo, en orden de pensum,
  // acotados a los créditos disponibles del ciclo. Prioriza obligatorios; si el API
  // de progreso no trae `career_course.mandatory` fiable por registro (pasa en
  // datos reales) y ese filtro deja todo vacío, no se bloquea: se sugiere de
  // los pendientes en general en vez de devolver una sugerencia vacía sin sentido.
  const sugerenciaHorario = computed<string[]>(() => {
    const p = progresoAcademico.value
    if (!p) return []
    const disponibles = p.available_credits ?? 0
    const capar = disponibles > 0

    const recolectar = (soloObligatorios: boolean) => {
      const lista: { codigo: string; semestre: number; creditos: number }[] = []
      for (const sem of p.progress?.semester_progress ?? []) {
        for (const c of sem?.courses_semester_progress ?? []) {
          const cc = c?.career_course
          if (c?.approved || !c?.course_code) continue
          if (soloObligatorios && !cc?.mandatory) continue
          const codigo = String(c.course_code)
          if (!codigosConOferta.value.has(codigo)) continue
          lista.push({
            codigo,
            semestre: sem?.semester ?? 0,
            creditos: cc?.course?.credits ?? 0,
          })
        }
      }
      return lista
    }

    const soloObligatorios = recolectar(true)
    const pendientes = soloObligatorios.length > 0 ? soloObligatorios : recolectar(false)
    pendientes.sort((a, b) => a.semestre - b.semestre)

    const seleccionados: string[] = []
    let acumulado = 0
    for (const c of pendientes) {
      if (capar && acumulado + c.creditos > disponibles) continue
      seleccionados.push(c.codigo)
      acumulado += c.creditos
    }
    return seleccionados
  })

  const horarioCompleto = computed<boolean>(() =>
    cursosPendientesFaltantes.value.length === 0
    && bloquesColocados.value.length > 0
    && conflictoIds.value.length === 0,
  )

  // Huecos entre clases y jornada predominante, derivado de bloques + periodos
  const resumenJornada = computed(() => {
    const bloques = bloquesColocados.value
    if (!bloques.length) return { horasLibres: 0, jornada: null as 'mañana' | 'tarde' | 'mixta' | null }

    // Huecos: por cada patrón de días, periodos vacíos entre el primero y el último ocupado
    let horasLibres = 0
    for (const dia of [1, 2]) {
      const delDia = bloques.filter(b => b.dia_horario_id === dia)
      if (delDia.length < 2) continue
      const ocupados = new Set<number>()
      for (const b of delDia) {
        for (let p = b.periodo_inicio_id; p <= b.periodo_fin_id; p++) ocupados.add(p)
      }
      const min = Math.min(...delDia.map(b => b.periodo_inicio_id))
      const max = Math.max(...delDia.map(b => b.periodo_fin_id))
      for (let p = min; p <= max; p++) {
        if (!ocupados.has(p)) horasLibres++
      }
    }

    const manana = bloques.filter(b => b.es_manana).length
    const tarde = bloques.filter(b => b.es_tarde).length
    const jornada = manana > tarde ? 'mañana' as const : tarde > manana ? 'tarde' as const : 'mixta' as const
    return { horasLibres, jornada }
  })

  const resumen = computed(() => {
    const cursos = new Set(bloquesColocados.value.map(d => d.curso_id)).size
    const periodoSlots = new Set(
      bloquesColocados.value.map(d => `${d.dia_horario_id}-${d.periodo_inicio_id}-${d.periodo_fin_id}`),
    ).size
    return { cursos, periodos: periodoSlots }
  })

  return {
    propuesto,
    catalogo,
    estudiante,
    seleccion,
    periodos,
    preferencias,
    loading,
    loadingSave,
    error,
    progresoAcademico,
    cargarPropuesto,
    cargarContextoEstudiante,
    agregar,
    quitar,
    reiniciarHorario,
    cambiarSeccion,
    moverBloque,
    restaurarPosicionOficial,
    seccionesAlternativas,
    chocaConSeleccion,
    duplicarPropuesto,
    estaSeleccionado,
    autoArmar,
    guardar,
    cargar,
    catalogoDeMiSemestre,
    catalogoDeMiCarrera,
    bloquesColocados,
    conflictosLocales,
    conflictoIds,
    nombrePorCurso,
    statsAcademicas,
    cursosPendientesFaltantes,
    pendientesConOferta,
    pendientesSinOferta,
    sugerenciaHorario,
    horarioCompleto,
    resumenJornada,
    resumen,
  }
})
