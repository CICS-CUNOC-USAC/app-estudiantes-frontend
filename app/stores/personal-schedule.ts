import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import type {
  Horario,
  HorarioDetalle,
  HorarioPersonalDetalle,
  Carrera,
} from '~/lib/api/schedules-generator/types'
import { fetchHorarios, fetchHorario } from '~/lib/api/schedules-generator/horarios'
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import { getPersonal, savePersonal } from '~/lib/api/schedules-generator/horarios-personales'
import { resolveCarreraId } from '~/lib/api/schedules-generator/career-map'
import { careerProgressApi } from '~/lib/api/dashboard/career-progress'
import { useRegularAuthStore } from '~/stores/regular-auth'

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
      catalogo.value = completo.detalles
      if (fetchedPeriodos !== undefined) periodos.value = fetchedPeriodos
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

      const carreraId = resolveCarreraId(carreras as Carrera[], user.career.code)

      const semestres = progressResponse.progress.semester_progress
      // Find the last semester that still has at least one unapproved course
      const semConPendientes = [...semestres]
        .reverse()
        .find(s => s.courses_semester_progress.some(c => !c.approved))

      const semActual = semConPendientes ?? semestres[semestres.length - 1] ?? null

      const semestre = semActual?.semester ?? null
      const cursos_pendientes = semActual
        ? semActual.courses_semester_progress
            .filter(c => !c.approved)
            .map(c => c.course_code)
        : []

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
      seleccion.value = result.detalles
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

  const bloquesColocados = computed((): HorarioDetalle[] => {
    return catalogo.value.filter((d) => {
      if (d.es_laboratorio) {
        return seleccion.value.some(s => s.seccion_lab_id === d.seccion_lab_id)
      }
      return seleccion.value.some(s => s.seccion_id === d.seccion_id)
    })
  })

  const conflictosLocales = computed((): string[] => {
    const bloques = bloquesColocados.value
    const descripciones: string[] = []

    for (let i = 0; i < bloques.length; i++) {
      for (let j = i + 1; j < bloques.length; j++) {
        const a = bloques[i]
        const b = bloques[j]
        if (a.dia_horario_id !== b.dia_horario_id) continue
        const solapan = a.periodo_inicio_id <= b.periodo_fin_id
          && b.periodo_inicio_id <= a.periodo_fin_id
        if (solapan) {
          descripciones.push(
            `Conflicto: "${a.curso_nombre}" y "${b.curso_nombre}" se solapan el ${a.dias_nombre} (${a.hora_inicio}–${a.hora_fin} vs ${b.hora_inicio}–${b.hora_fin})`,
          )
        }
      }
    }
    return descripciones
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
    cargarPropuesto,
    cargarContextoEstudiante,
    agregar,
    quitar,
    estaSeleccionado,
    autoArmar,
    guardar,
    cargar,
    catalogoDeMiSemestre,
    bloquesColocados,
    conflictosLocales,
    resumen,
  }
})
