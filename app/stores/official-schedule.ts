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
} from '~/lib/api/schedules-generator/types'
import {
  fetchHorarios,
  fetchHorario,
  fetchConflictos,
  editarDetalle,
  activarHorario,
  eliminarHorario,
} from '~/lib/api/schedules-generator/horarios'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'

export const useOfficialScheduleStore = defineStore('official-schedule', () => {
  // ── State ──────────────────────────────────────────────────────────────────

  const horarios = ref<Horario[]>([])
  const horarioActual = ref<Horario | null>(null)
  const detalles = ref<HorarioDetalle[]>([])
  const periodos = ref<Period[]>([])
  const salones = ref<Salon[]>([])
  const docentes = ref<Teacher[]>([])
  const carreras = ref<Carrera[]>([])
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
      detalles.value = result.detalles
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
    const [salonesRes, docentesRes, carrerasRes, periodosRes] = await Promise.allSettled([
      fetchSalones(),
      fetchTeachers(),
      fetchCarreras(),
      fetchPeriods(),
    ])

    if (salonesRes.status === 'fulfilled') salones.value = salonesRes.value
    if (docentesRes.status === 'fulfilled') docentes.value = docentesRes.value.results
    if (carrerasRes.status === 'fulfilled') carreras.value = carrerasRes.value
    if (periodosRes.status === 'fulfilled' && periodosRes.value !== undefined) {
      periodos.value = periodosRes.value
    }
  }

  const editarDetalleAction = async (detalleId: number, cambios: EditarDetalleInput) => {
    if (!horarioActual.value) return
    loadingDetalle.value = true
    try {
      await editarDetalle(horarioActual.value.id, detalleId, cambios)
      await fetchHorarioAction(horarioActual.value.id)
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
    gridPorDiaYPeriodo,
  }
})
