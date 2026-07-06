import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Horario,
  HorarioDetalle,
  EditarDetalleInput,
  Salon,
  ConflictoHorario,
  ConflictosResponse,
  Teacher,
  Carrera,
  Curso,
} from '~/lib/api/schedules-generator/types'
import {
  fetchHorarios,
  fetchHorario,
  fetchConflictos,
  editarDetalle,
  activarHorario,
  eliminarHorario,
  normalizarDetalles,
} from '~/lib/api/schedules-generator/horarios'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'
import { describirConflictos, type ConflictoLegible } from '~/lib/api/schedules-generator/conflictos-legibles'

export const useOfficialScheduleStore = defineStore('official-schedule', () => {
  // ── State ──────────────────────────────────────────────────────────────────

  const horarios = ref<Horario[]>([])
  const horarioActual = ref<Horario | null>(null)
  const detalles = ref<HorarioDetalle[]>([])
  const periodos = ref<Period[]>([])
  const salones = ref<Salon[]>([])
  const docentes = ref<Teacher[]>([])
  const carreras = ref<Carrera[]>([])
  const cursosCatalogo = ref<Curso[]>([])
  const conflictos = ref<ConflictoHorario[]>([])
  const conflictosData = ref<ConflictosResponse | null>(null)
  const loading = ref(false)
  const loadingDetalle = ref(false)
  const error = ref<string | null>(null)

  const filtros = ref<{
    carrera_id: number | null
    semestre: number | null
    tipo: '' | 'cursos' | 'laboratorios'
  }>({
    carrera_id: null,
    semestre: null,
    tipo: '',
  })

  // ── Actions ────────────────────────────────────────────────────────────────

  const fetchHorariosAction = async () => {
    loading.value = true
    error.value = null
    try {
      horarios.value = await fetchHorarios()
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al obtener horarios'
    }
    finally {
      loading.value = false
    }
  }

  const fetchHorarioAction = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const query: Record<string, string | number> = {}
      if (filtros.value.tipo !== '') query.tipo = filtros.value.tipo
      if (filtros.value.carrera_id !== null) query.carrera_id = filtros.value.carrera_id
      if (filtros.value.semestre !== null) query.semestre = filtros.value.semestre

      const result = await fetchHorario(id, query)
      horarioActual.value = result.horario
      // Rellena periodo/hora null (LEFT JOIN del backend con datos reales)
      detalles.value = normalizarDetalles(result.detalles, periodos.value)
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al obtener horario'
    }
    finally {
      loading.value = false
    }
  }

  const fetchCatalogos = async () => {
    const [salonesRes, docentesRes, carrerasRes, periodosRes, cursosRes] = await Promise.allSettled([
      fetchSalones(),
      fetchTeachers(),
      fetchCarreras(),
      fetchPeriods(),
      fetchCursos(),
    ])

    if (salonesRes.status === 'fulfilled') salones.value = salonesRes.value
    if (docentesRes.status === 'fulfilled') docentes.value = docentesRes.value.results
    if (carrerasRes.status === 'fulfilled') carreras.value = carrerasRes.value
    if (periodosRes.status === 'fulfilled' && periodosRes.value !== undefined) {
      periodos.value = periodosRes.value
    }
    if (cursosRes.status === 'fulfilled') cursosCatalogo.value = cursosRes.value
  }

  const editarDetalleAction = async (detalleId: number, cambios: EditarDetalleInput) => {
    if (!horarioActual.value) return
    loadingDetalle.value = true
    const idx = detalles.value.findIndex(d => d.detalle_id === detalleId)
    const prev = idx >= 0 ? { ...detalles.value[idx] } : null
    // Optimista: aplica el cambio en memoria, sin refetch completo
    if (idx >= 0) detalles.value[idx] = { ...detalles.value[idx], ...cambios, modificado_manual: true }
    try {
      const resp = await editarDetalle(horarioActual.value.id, detalleId, cambios)
      if (resp?.detalle && idx >= 0) {
        detalles.value[idx] = { ...detalles.value[idx], ...resp.detalle }
      }
      if (typeof resp?.nueva_aptitud === 'number') {
        horarioActual.value.aptitud_final = resp.nueva_aptitud
        const h = horarios.value.find(x => x.id === horarioActual.value!.id)
        if (h) h.aptitud_final = resp.nueva_aptitud
      }
      return resp   // la página decide si mostrar advertencias
    }
    catch (e) {
      if (prev && idx >= 0) detalles.value[idx] = prev   // rollback
      throw e
    }
    finally {
      loadingDetalle.value = false
    }
  }

  const activar = async (id: number) => {
    await activarHorario(id)
    await fetchHorariosAction()
    if (horarioActual.value?.id === id) {
      horarioActual.value = { ...horarioActual.value, es_activo: true }
    }
  }

  const eliminar = async (id: number) => {
    await eliminarHorario(id)
    horarios.value = horarios.value.filter(h => h.id !== id)
    if (horarioActual.value?.id === id) {
      horarioActual.value = null
      detalles.value = []
    }
  }

  const fetchConflictosAction = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchConflictos(id)
      conflictos.value = result.conflictos
      conflictosData.value = result
    }
    catch (err: unknown) {
      error.value = (err as { data?: { error?: string; message?: string } })?.data?.error
        ?? (err as { data?: { error?: string; message?: string } })?.data?.message
        ?? 'Error al obtener conflictos'
    }
    finally {
      loading.value = false
    }
  }

  const setFiltros = (f: Partial<typeof filtros.value>) => {
    filtros.value = { ...filtros.value, ...f }
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  const horarioActivo = computed(() =>
    horarios.value.find(h => h.es_activo === true) ?? null,
  )

  const detallesFiltrados = computed(() => {
    return detalles.value.filter((d) => {
      if (filtros.value.tipo === 'cursos' && d.es_laboratorio) return false
      if (filtros.value.tipo === 'laboratorios' && !d.es_laboratorio) return false
      if (filtros.value.carrera_id !== null && d.carrera_id !== filtros.value.carrera_id) return false
      if (filtros.value.semestre !== null && d.semestre !== filtros.value.semestre) return false
      return true
    })
  })

  // detalle_id en conflicto (traslape de salón/docente en día+periodo compartidos),
  // calculado localmente para no depender de un fetch por cada movimiento
  const conflictoIds = computed<number[]>(() => {
    const DIA_COLS: Record<number, number[]> = { 1: [1, 3, 5], 2: [2, 4] }
    const ids = new Set<number>()
    const arr = detalles.value
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i], b = arr[j]
        const colsA = DIA_COLS[a.dia_horario_id] ?? []
        const colsB = DIA_COLS[b.dia_horario_id] ?? []
        const sameDay = colsA.some(c => colsB.includes(c))
        if (!sameDay) continue
        const overlap = a.periodo_inicio_id <= b.periodo_fin_id && b.periodo_inicio_id <= a.periodo_fin_id
        if (!overlap) continue
        const mismoSalon = a.salon_id !== null && a.salon_id === b.salon_id
        const mismoDocente = a.docente_id !== null && a.docente_id === b.docente_id
        if (mismoSalon || mismoDocente) {
          ids.add(a.detalle_id)
          ids.add(b.detalle_id)
        }
      }
    }
    return [...ids]
  })

  // Conflictos del backend traducidos a lenguaje natural (día, hora y nombres
  // reales en lugar de "slot 24-1-8"); esta vista la usan docentes/coordinación
  const conflictosLegibles = computed<ConflictoLegible[]>(() =>
    describirConflictos(conflictos.value, {
      periodos: periodos.value,
      docentes: docentes.value,
      salones: salones.value,
      carreras: carreras.value,
      cursos: cursosCatalogo.value,
    }),
  )

  // ¿El horario cargado tiene bloques editados a mano después de generarse?
  const tieneEdicionManual = computed<boolean>(() =>
    detalles.value.some(d => d.modificado_manual),
  )

  const gridPorDiaYPeriodo = computed(() => {
    const grid: Record<string, HorarioDetalle[]> = {}
    for (const d of detalles.value) {
      const key = `${d.dia_horario_id}-${d.periodo_inicio_id}`
      if (!grid[key]) grid[key] = []
      grid[key].push(d)
    }
    return grid
  })

  return {
    horarios,
    horarioActual,
    detalles,
    periodos,
    salones,
    docentes,
    carreras,
    cursosCatalogo,
    conflictos,
    conflictosData,
    loading,
    loadingDetalle,
    error,
    filtros,
    fetchHorariosAction,
    fetchHorarioAction,
    fetchCatalogos,
    editarDetalleAction,
    activar,
    eliminar,
    fetchConflictosAction,
    setFiltros,
    horarioActivo,
    detallesFiltrados,
    conflictoIds,
    conflictosLegibles,
    tieneEdicionManual,
    gridPorDiaYPeriodo,
  }
})
