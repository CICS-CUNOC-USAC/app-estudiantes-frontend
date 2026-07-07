<script setup lang="ts">
import { ref, computed, nextTick, onErrorCaptured } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog } from '~/components/ui/dialog'
import type { HorarioDetalle } from '~/lib/api/schedules-generator/types'

definePageMeta({
  layout: 'dashboard',
  title: 'Mi Horario',
  wideScreen: true,
})

const personalStore = usePersonalScheduleStore()

// Ningún error de esta vista puede quedar silencioso: se muestra y se loguea
onErrorCaptured((err) => {
  console.error('[MiHorario] error interno:', err)
  toast.error(`Error interno en Mi Horario: ${(err as Error)?.message ?? String(err)}`)
  return false
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────

// El store marca "loading" true/false en CADA llamada individual (cargarPropuesto,
// cargarContextoEstudiante, cargar), así que entre una y otra hay un instante en
// false → eso es el parpadeo de "horario vacío" que se veía al recargar. Este flag
// solo se apaga cuando las TRES terminan, y controla el skeleton de la página.
const cargandoInicial = ref(true)

onMounted(async () => {
  try {
    await personalStore.cargarPropuesto()
    await personalStore.cargarContextoEstudiante()
    await personalStore.cargar()
  }
  finally {
    cargandoInicial.value = false
  }
})

// ── Catalog filter state ──────────────────────────────────────────────────────

const busqueda = ref<string>('')
const filtroCatCarrera = ref<string | null>(null)
const filtroCatSemestre = ref<string | null>(null)

// ── Dialog state ──────────────────────────────────────────────────────────────

const propuestoOpen = ref(false)
const asistentOpen = ref(false)
const guardandoHorario = ref(false)
const catalogoVisible = ref(false)
const conflictsOpen = ref(false)

const swapOpen = ref(false)
const swapDetalle = ref<HorarioDetalle | null>(null)

const reiniciarOpen = ref(false)

const moverOpen = ref(false)
const moverPendiente = ref<{
  detalle: HorarioDetalle
  diaHorarioId: number
  periodoInicioId: number
  periodoFinId: number
} | null>(null)

const DIA_LABELS: Record<number, string> = { 1: 'Lunes, Miércoles y Viernes', 2: 'Martes y Jueves' }

function labelHorario(diaHorarioId: number, periodoInicioId: number, periodoFinId: number): string {
  const pIni = personalStore.periodos.find(p => p.id === periodoInicioId)
  const pFin = personalStore.periodos.find(p => p.id === periodoFinId)
  const horaIni = pIni?.hora_inicio?.slice(0, 5) ?? '?'
  const horaFin = pFin?.hora_fin?.slice(0, 5) ?? '?'
  return `${DIA_LABELS[diaHorarioId] ?? '?'} ${horaIni}–${horaFin}`
}

// ── Computed: unique carrera ids present in catalogo ─────────────────────────

const carrerasEnCatalogo = computed(() => {
  const seen = new Map<number, string>()
  for (const d of personalStore.catalogo) {
    if (d.carrera_id !== null && d.carrera_nombre !== null && !seen.has(d.carrera_id)) {
      seen.set(d.carrera_id, d.carrera_nombre)
    }
  }
  return Array.from(seen.entries()).map(([id, nombre]) => ({ label: nombre, value: String(id) }))
})

// ── Computed: unique semestres present in catalogo ────────────────────────────

const semestresEnCatalogo = computed(() => {
  const s = new Set<number>()
  for (const d of personalStore.catalogo) s.add(d.semestre)
  return [...s].sort((a, b) => a - b).map(n => ({ label: `Semestre ${n}`, value: String(n) }))
})

// ── Computed: first-occurrence-per-section filtered catalog list ──────────────

const catalogoFiltrado = computed((): HorarioDetalle[] => {
  const semestre = filtroCatSemestre.value ? +filtroCatSemestre.value : null
  const carreraId = filtroCatCarrera.value ? +filtroCatCarrera.value : null
  const q = busqueda.value.trim().toLowerCase()

  // First pass: filter
  const filtered = personalStore.catalogo.filter((d) => {
    if (carreraId !== null && d.carrera_id !== carreraId) return false
    if (semestre !== null && d.semestre !== semestre) return false
    if (q && !d.curso_nombre.toLowerCase().includes(q) && !d.curso_codigo.toLowerCase().includes(q)) return false
    return true
  })

  // Second pass: one entry per unique seccion (dedup)
  const seenIds = new Set<string>()
  const result: HorarioDetalle[] = []
  for (const d of filtered) {
    const key = d.es_laboratorio
      ? `lab-${d.seccion_lab_id ?? d.detalle_id}`
      : `sec-${d.seccion_id ?? d.detalle_id}`
    if (!seenIds.has(key)) {
      seenIds.add(key)
      result.push(d)
    }
  }
  return result
})

// ── Computed: unique courses for the assistant dialog ─────────────────────────

const cursosUnicos = computed(() => {
  const seen = new Map<string, { codigo: string; nombre: string; semestre: number }>()
  for (const d of personalStore.catalogo) {
    if (!seen.has(d.curso_codigo)) {
      seen.set(d.curso_codigo, {
        codigo: d.curso_codigo,
        nombre: d.curso_nombre,
        semestre: d.semestre,
      })
    }
  }
  return [...seen.values()].sort((a, b) => a.semestre - b.semestre || a.nombre.localeCompare(b.nombre))
})

// ── Computed: swap-section dialog data ────────────────────────────────────────

const swapAlternativas = computed((): HorarioDetalle[] =>
  swapDetalle.value ? personalStore.seccionesAlternativas(swapDetalle.value) : [],
)

const swapConflictivas = computed((): number[] =>
  swapDetalle.value
    ? swapAlternativas.value
        .filter(a => personalStore.chocaConSeleccion(a, swapDetalle.value!))
        .map(a => a.detalle_id)
    : [],
)

// ── Handlers ──────────────────────────────────────────────────────────────────

// dia_horario_id 1 = L/Mi/V (columnas 1,3,5), 2 = Ma/J (columnas 2,4) — igual que ScheduleGrid
function diaHorarioDeColumna(colIndex: number): number {
  return [1, 3, 5].includes(colIndex) ? 1 : 2
}

function onPersonalDrop(payload: { detalleId: number; nuevoPeriodoId?: number; colIndex?: number; celdaOcupadaPor?: number }) {
  const detalle = personalStore.catalogo.find(d => d.detalle_id === payload.detalleId)
  if (!detalle) {
    toast.error('No se encontró ese curso en el catálogo. Recarga la página.')
    return
  }

  const yaColocado = personalStore.estaSeleccionado(detalle)

  // Atajo: soltar sobre la celda de OTRA sección del MISMO curso = cambiar de sección
  if (payload.celdaOcupadaPor) {
    const ocupante = personalStore.bloquesColocados.find(d => d.detalle_id === payload.celdaOcupadaPor)
    if (
      ocupante
      && ocupante.detalle_id !== detalle.detalle_id
      && ocupante.curso_codigo === detalle.curso_codigo
      && ocupante.es_laboratorio === detalle.es_laboratorio
      && !yaColocado
    ) {
      personalStore.cambiarSeccion(ocupante, detalle)
      toast.success(`${detalle.curso_nombre}: cambiado a la sección ${detalle.seccion_letra ?? ''}`.trim())
      return
    }
  }

  // Tu horario personal es de referencia, no el oficial: se coloca donde tú decidas.
  // Se confirma con un modal (nunca se bloquea la acción); los choques quedan
  // marcados en rojo en la grilla, no impiden mover el curso.
  if (payload.colIndex !== undefined && payload.nuevoPeriodoId !== undefined) {
    const dia = diaHorarioDeColumna(payload.colIndex)
    const span = detalle.periodo_fin_id - detalle.periodo_inicio_id
    moverPendiente.value = {
      detalle,
      diaHorarioId: dia,
      periodoInicioId: payload.nuevoPeriodoId,
      periodoFinId: payload.nuevoPeriodoId + span,
    }
    moverOpen.value = true
    return
  }

  // Sin celda específica (botón "+" del catálogo): se agrega en su horario oficial
  if (yaColocado) {
    toast.info(`${detalle.curso_nombre} ya está en tu horario`)
    return
  }
  personalStore.agregar(detalle)
  if (personalStore.estaSeleccionado(detalle)) {
    toast.success(`${detalle.curso_nombre} agregado a tu horario`)
  }
  else {
    toast.error(`${detalle.curso_nombre} no se pudo agregar: la sección no tiene identificador válido.`)
  }
}

function onConfirmarMover() {
  if (!moverPendiente.value) return
  const { detalle, diaHorarioId, periodoInicioId } = moverPendiente.value
  const yaColocado = personalStore.estaSeleccionado(detalle)
  if (!yaColocado) personalStore.agregar(detalle)
  personalStore.moverBloque(detalle, diaHorarioId, periodoInicioId)

  const clave = detalle.es_laboratorio
    ? (b: HorarioDetalle) => b.seccion_lab_id === detalle.seccion_lab_id
    : (b: HorarioDetalle) => b.seccion_id === detalle.seccion_id
  const hayChoque = personalStore.bloquesColocados
    .filter(clave)
    .some(b => personalStore.conflictoIds.includes(b.detalle_id))

  if (hayChoque) {
    toast.warning(`${detalle.curso_nombre} movido, pero choca con otro curso en ese horario (revisa el bloque en rojo).`)
  }
  else {
    toast.success(yaColocado ? `${detalle.curso_nombre} movido` : `${detalle.curso_nombre} agregado a tu horario`)
  }
  moverOpen.value = false
  moverPendiente.value = null
}

function onCancelarMover() {
  moverOpen.value = false
  moverPendiente.value = null
}

function onRestaurarPosicion(detalle: HorarioDetalle) {
  personalStore.restaurarPosicionOficial(detalle)
  toast.info(`${detalle.curso_nombre} vuelto a su horario oficial`)
  swapOpen.value = false
  swapDetalle.value = null
}

function onRemoveBlock(detalle: HorarioDetalle) {
  personalStore.quitar(detalle)
  toast.info(`${detalle.curso_nombre} quitado de tu horario`)
}

function onClickBlock(detalle: HorarioDetalle) {
  swapDetalle.value = detalle
  swapOpen.value = true
}

function onSwap(nueva: HorarioDetalle) {
  if (!swapDetalle.value) return
  personalStore.cambiarSeccion(swapDetalle.value, nueva)
  toast.success(`${nueva.curso_nombre}: cambiado a la sección ${nueva.seccion_letra ?? ''}`.trim())
  swapOpen.value = false
  swapDetalle.value = null
}

function onRemoveFromSwap() {
  if (!swapDetalle.value) return
  onRemoveBlock(swapDetalle.value)
  swapOpen.value = false
  swapDetalle.value = null
}

// Cuando el semestre del estudiante no tiene oferta, no se le bloquea: se le
// advierte y puede duplicar igual con un alcance más amplio (su carrera, o el
// propuesto completo si su carrera tampoco tiene secciones este ciclo).
const duplicarSinOfertaOpen = ref(false)
const duplicarAlcance = computed<'carrera' | 'todo'>(() =>
  personalStore.catalogoDeMiCarrera.length > 0 ? 'carrera' : 'todo',
)
const duplicarAlcanceCount = computed(() =>
  duplicarAlcance.value === 'carrera'
    ? personalStore.catalogoDeMiCarrera.length
    : personalStore.catalogo.length,
)

function onDuplicarPropuesto() {
  if (personalStore.catalogoDeMiSemestre.length === 0) {
    if (personalStore.catalogo.length === 0) {
      toast.warning('El horario propuesto no tiene ninguna sección cargada este ciclo; no hay nada que duplicar.')
      return
    }
    duplicarSinOfertaOpen.value = true
    return
  }
  const agregadas = personalStore.duplicarPropuesto()
  if (agregadas > 0) {
    toast.success(`Horario propuesto duplicado: ${agregadas} sección${agregadas !== 1 ? 'es' : ''} agregada${agregadas !== 1 ? 's' : ''}.`)
  }
  else {
    toast.warning('No se pudo duplicar: las secciones de tu semestre no tienen identificador válido.')
  }
}

function onDuplicarDeTodosModos() {
  const alcance = duplicarAlcance.value
  const agregadas = personalStore.duplicarPropuesto(alcance)
  duplicarSinOfertaOpen.value = false
  if (agregadas > 0) {
    toast.warning(
      `Se duplicó el propuesto ${alcance === 'carrera' ? 'de tu carrera' : 'completo'} (${agregadas} sección${agregadas !== 1 ? 'es' : ''}). `
      + 'Quita los cursos que no te correspondan o usa "Reiniciar horario".',
    )
  }
  else {
    toast.error('No se pudo duplicar el horario propuesto.')
  }
}

function onAgregarPendiente(codigo: string) {
  const secciones = personalStore.catalogo.filter(d => d.curso_codigo === codigo && !d.es_laboratorio)
  if (secciones.length === 0) {
    toast.warning(`El curso ${codigo} no tiene secciones en el horario propuesto de este ciclo.`)
    return
  }
  const libre = secciones.find(d => !personalStore.chocaConSeleccion(d))
  const elegida = libre ?? secciones[0]
  personalStore.agregar(elegida)
  if (libre) {
    toast.success(`${elegida.curso_nombre} agregado a tu horario`)
  }
  else {
    toast.warning(`${elegida.curso_nombre} agregado, pero choca con otro curso. Revísalo.`)
  }
}

function onAutoArmar(payload: { cursos: string[]; jornada: 'manana' | 'tarde' | 'ambas' }) {
  personalStore.autoArmar(payload.cursos, payload.jornada)
  asistentOpen.value = false
  nextTick(() => {
    const colocados = personalStore.bloquesColocados.length
    if (colocados === 0) {
      toast.warning('No se pudo armar: ninguno de los cursos seleccionados tiene secciones en el horario propuesto de este ciclo.')
    }
    else if (personalStore.conflictoIds.length > 0) {
      toast.info(`Horario armado con ${colocados} bloque(s), pero quedaron choques. Revisa los bloques en rojo.`)
    }
    else {
      toast.success(`¡Horario armado con ${colocados} bloque(s), sin choques!`)
    }
  })
}

async function onGuardar() {
  guardandoHorario.value = true
  try {
    await personalStore.guardar()
  }
  finally {
    guardandoHorario.value = false
  }
}

const printArea = ref<{ imprimir: () => Promise<void> } | null>(null)

function onImprimir() {
  printArea.value?.imprimir()
}

const printChips = computed(() => {
  const chips: string[] = []
  if (personalStore.estudiante.semestre !== null) chips.push(`Semestre ${personalStore.estudiante.semestre}`)
  if (personalStore.resumen.cursos > 0) chips.push(`${personalStore.resumen.cursos} curso${personalStore.resumen.cursos !== 1 ? 's' : ''}`)
  if (personalStore.estudiante.ra) chips.push(`Carné ${personalStore.estudiante.ra}`)
  return chips
})

function onReiniciar() {
  personalStore.reiniciarHorario()
  reiniciarOpen.value = false
  toast.info('Horario reiniciado. Empiezas de cero (aún no guardado).')
}
</script>

<template>
  <div class="px-4 sm:px-6 pt-6 space-y-4">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <div class="space-y-1">
        <h1 class="text-xl font-black tracking-tight">Mi Horario</h1>
        <!-- Info bar -->
        <div class="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span v-if="personalStore.propuesto">
            Basado en: <strong class="text-foreground">{{ personalStore.propuesto.nombre }}</strong>
          </span>
          <template v-if="personalStore.estudiante.carrera_id !== null || personalStore.estudiante.semestre !== null">
            <span class="w-px h-3 bg-border inline-block" />
            <span
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md bg-card"
            >
              Sem. {{ personalStore.estudiante.semestre ?? '?' }}
            </span>
          </template>
          <!-- Estado de completitud -->
          <span
            v-if="personalStore.horarioCompleto"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <Icon name="lucide:check" class="size-3" />
            Horario completo
          </span>
          <span
            v-else-if="personalStore.cursosPendientesFaltantes.length > 0"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md  bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
          >
            Te falta agregar {{ personalStore.cursosPendientesFaltantes.length }} curso{{ personalStore.cursosPendientesFaltantes.length !== 1 ? 's' : '' }}
          </span>
          <template v-if="personalStore.conflictosLocales.length > 0">
            <button
              type="button"
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-md  bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 cursor-pointer hover:brightness-95 active:translate-y-px transition"
              @click="conflictsOpen = true"
            >
              <Icon name="lucide:triangle-alert" class="size-3" />
              {{ personalStore.conflictosLocales.length }} conflicto{{ personalStore.conflictosLocales.length !== 1 ? 's' : '' }}
            </button>
          </template>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap items-center gap-2 shrink-0">
        <Button variant="tonal" size="sm" icon="lucide:eye" @click="propuestoOpen = true">
          Ver propuesto
        </Button>
        <Button variant="tonal" size="sm" icon="lucide:copy" @click="onDuplicarPropuesto">
          Duplicar propuesto
        </Button>
        <Button size="sm" icon="lucide:wand-sparkles" @click="asistentOpen = true">
          Armar automáticamente
        </Button>
        <Button variant="tonal" size="sm" icon="lucide:printer" @click="onImprimir">
          Imprimir / PDF
        </Button>
        <Button
          variant="text"
          severity="danger"
          size="sm"
          icon="lucide:rotate-ccw"
          :disabled="personalStore.bloquesColocados.length === 0"
          @click="reiniciarOpen = true"
        >
          Reiniciar horario
        </Button>
        <Button
          size="sm"
          icon="lucide:save"
          :loading="guardandoHorario || personalStore.loadingSave"
          @click="onGuardar"
        >
          Guardar
        </Button>
      </div>
    </div>

    <!-- ── Skeleton de carga inicial: evita el parpadeo de "horario vacío" ── -->
    <template v-if="cargandoInicial">
      <div class="border border-black rounded-xl  bg-card p-4 space-y-3">
        <div class="h-5 w-32 rounded bg-muted animate-pulse" />
        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          <div v-for="i in 6" :key="i" class="h-14 rounded-lg bg-muted animate-pulse border border-black/20" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-4 items-start">
        <div class="hidden lg:block border border-black rounded-xl  bg-card p-4 space-y-1.5">
          <div v-for="i in 6" :key="i" class="h-14 rounded-[0.6rem] bg-muted animate-pulse border border-black/20" />
        </div>
        <div class="border border-black rounded-xl  bg-card p-4">
          <div class="grid grid-cols-[56px_repeat(5,1fr)] gap-1.5 mb-1.5">
            <div />
            <div v-for="i in 5" :key="i" class="h-8 rounded-lg bg-muted animate-pulse" />
          </div>
          <div v-for="row in 8" :key="row" class="grid grid-cols-[56px_repeat(5,1fr)] gap-1.5 mb-1.5">
            <div class="h-11 rounded bg-transparent" />
            <div v-for="col in 5" :key="col" class="h-11 rounded-lg bg-muted/60 animate-pulse border border-black/10" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>

    <!-- ── "Mi avance" academic panel ─────────────────────────────────────── -->
    <div
      v-if="personalStore.statsAcademicas"
      class="border border-black rounded-xl  bg-card p-4 space-y-3 print:hidden"
    >
      <div class="flex items-center justify-between gap-2 flex-wrap">
        <h2 class="text-sm font-black flex items-center gap-1.5">
          <Icon name="lucide:graduation-cap" class="size-4 text-cics-primary" />
          Mi avance
        </h2>
        <Button variant="tonal" size="sm" icon="lucide:trending-up" to="/dashboard/pensum/progress">
          Ver mi progreso
        </Button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
        <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
            {{ personalStore.statsAcademicas.cursosAprobados }}<span class="text-sm text-muted-foreground">/{{ personalStore.statsAcademicas.cursosTotales }}</span>
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Cursos aprobados</div>
        </div>
        <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
            {{ personalStore.statsAcademicas.creditosGanados }}<span class="text-sm text-muted-foreground">/{{ personalStore.statsAcademicas.creditosCarrera }}</span>
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos ganados</div>
        </div>
        <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
            {{ personalStore.statsAcademicas.creditosObligatoriosGanados }}<span class="text-sm text-muted-foreground">/{{ personalStore.statsAcademicas.creditosObligatoriosCarrera }}</span>
          </div>
          <div class="relative h-1.5 mt-1.5 rounded-full border border-black overflow-hidden bg-card">
            <div
              class="absolute inset-y-0 left-0 bg-cics-blue transition-all"
              :style="{ width: personalStore.statsAcademicas.pctAvanceObligatorios + '%' }"
            />
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Avance obligatorios ({{ personalStore.statsAcademicas.pctAvanceObligatorios }}%)</div>
        </div>
        <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
            {{ personalStore.statsAcademicas.pctAvance }}%
          </div>
          <div class="relative h-1.5 mt-1.5 rounded-full border border-black overflow-hidden bg-card">
            <div
              class="absolute inset-y-0 left-0 bg-cics-primary transition-all"
              :style="{ width: personalStore.statsAcademicas.pctAvance + '%' }"
            />
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Avance de carrera</div>
        </div>
        <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
            {{ personalStore.statsAcademicas.creditosDisponibles }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos disponibles</div>
        </div>
        <button
          type="button"
          class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center cursor-pointer hover:brightness-95 active:translate-y-px transition"
          :disabled="personalStore.conflictoIds.length === 0"
          :class="{ 'cursor-default hover:brightness-100 active:translate-y-0': personalStore.conflictoIds.length === 0 }"
          @click="conflictsOpen = true"
        >
          <div
            class="text-xl font-extrabold tabular-nums leading-none"
            :class="personalStore.conflictoIds.length > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'"
          >
            {{ personalStore.conflictoIds.length }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflictos</div>
        </button>
      </div>

      <!-- Avisos de carga del ciclo y jornada -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span v-if="personalStore.resumen.cursos > 0">
          {{ personalStore.resumen.cursos }} curso{{ personalStore.resumen.cursos !== 1 ? 's' : '' }} este ciclo
        </span>
        <span v-if="personalStore.resumenJornada.jornada === 'mañana' || personalStore.resumenJornada.jornada === 'tarde'">
          Tu horario es mayormente de {{ personalStore.resumenJornada.jornada }}
        </span>
        <span v-else-if="personalStore.resumenJornada.jornada === 'mixta'">
          Tu horario combina mañana y tarde
        </span>
        <span v-if="personalStore.resumenJornada.horasLibres > 0">
          Tienes {{ personalStore.resumenJornada.horasLibres }} periodo{{ personalStore.resumenJornada.horasLibres !== 1 ? 's' : '' }} libre{{ personalStore.resumenJornada.horasLibres !== 1 ? 's' : '' }} entre clases
        </span>
      </div>
    </div>

    <!-- ── Pending courses banner ─────────────────────────────────────────── -->
    <div
      v-if="personalStore.cursosPendientesFaltantes.length > 0"
      class="border border-black rounded-xl  bg-amber-50 dark:bg-amber-950/30 p-4 print:hidden"
    >
      <p class="text-xs font-black mb-2 flex items-center gap-1.5">
        <Icon name="lucide:list-todo" class="size-4 text-cics-primary" />
        Te faltan por agregar (obligatorios de tu semestre)
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="codigo in personalStore.pendientesConOferta"
          :key="codigo"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-full bg-card pl-2.5 pr-1 py-0.5 text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
        >
          <span class="max-w-48 truncate" :title="personalStore.nombrePorCurso.get(codigo) ?? codigo">
            {{ codigo }}<template v-if="personalStore.nombrePorCurso.get(codigo)"> — {{ personalStore.nombrePorCurso.get(codigo) }}</template>
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-0.5 shrink-0 rounded-full border border-black bg-cics-primary text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 hover:brightness-110 active:translate-y-px"
            @click="onAgregarPendiente(codigo)"
          >
            <Icon name="lucide:plus" class="size-3" />
            Agregar
          </button>
        </span>
        <span
          v-for="codigo in personalStore.pendientesSinOferta"
          :key="codigo"
          class="inline-flex items-center gap-1.5 border-2 border-dashed border-black/40 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground max-w-64 truncate"
          :title="`${personalStore.nombrePorCurso.get(codigo) ?? codigo}: sin secciones en el horario propuesto de este ciclo`"
        >
          {{ codigo }}<template v-if="personalStore.nombrePorCurso.get(codigo)"> — {{ personalStore.nombrePorCurso.get(codigo) }}</template>
          <span class="text-[9px] font-extrabold uppercase shrink-0">Sin oferta</span>
        </span>
      </div>
      <p
        v-if="personalStore.pendientesSinOferta.length > 0"
        class="text-[10px] text-muted-foreground mt-2"
      >
        Los cursos marcados "Sin oferta" están en tu pensum pero no tienen secciones en el horario
        propuesto de este ciclo; no es posible agregarlos.
      </p>
    </div>

    <!-- ── Empty state / onboarding ───────────────────────────────────────── -->
    <div
      v-if="!personalStore.loading && personalStore.bloquesColocados.length === 0"
      class="border border-black rounded-xl  bg-card p-6 text-center space-y-3 print:hidden"
    >
      <Icon name="lucide:calendar-plus" class="size-10 text-cics-primary mx-auto" />
      <p class="text-sm font-black">Aún no has armado tu horario</p>
      <p class="text-xs text-muted-foreground max-w-md mx-auto">
        Duplica el horario propuesto de tu semestre y edítalo, deja que el asistente lo arme por ti,
        o arrastra cursos desde el catálogo a la grilla.
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <Button variant="tonal" size="sm" icon="lucide:copy" @click="onDuplicarPropuesto">
          Duplicar propuesto
        </Button>
        <Button size="sm" icon="lucide:wand-sparkles" @click="asistentOpen = true">
          Armar automáticamente
        </Button>
      </div>
    </div>

    <!-- ── Error state ────────────────────────────────────────────────────── -->
    <div
      v-if="personalStore.error"
      class="border border-black rounded-xl  bg-red-50 dark:bg-red-950/30 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden"
    >
      <p class="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
        <Icon name="lucide:circle-alert" class="size-4" />
        {{ personalStore.error }}
      </p>
      <Button
        variant="tonal"
        size="sm"
        icon="lucide:rotate-ccw"
        @click="personalStore.cargarPropuesto().then(() => personalStore.cargarContextoEstudiante()).then(() => personalStore.cargar())"
      >
        Reintentar
      </Button>
    </div>

    <!-- ── Mobile: catalog toggle button ────────────────────────────────── -->
    <div class="flex lg:hidden print:hidden">
      <Button variant="tonal" size="sm" icon="lucide:menu" @click="catalogoVisible = !catalogoVisible">
        {{ catalogoVisible ? 'Ocultar catálogo' : 'Ver catálogo de cursos' }}
      </Button>
    </div>

    <!-- ── Two-column layout ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-4 items-start">

      <!-- ── Left: Course catalog panel ────────────────────────────────────── -->
      <aside
        :class="[
          'border border-black rounded-xl  bg-card p-4 space-y-3 lg:sticky lg:top-4 flex-col print:hidden',
          'max-h-[calc(100vh-6rem)]',
          catalogoVisible ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <div class="shrink-0 space-y-2">
          <h2 class="text-sm font-black">Cursos disponibles · horario propuesto</h2>

          <!-- Search -->
          <CInputText
            v-model="busqueda"
            type="search"
            prepend-icon="lucide:search"
            clearable
            placeholder="Buscar curso o código..."
          />

          <!-- Carrera filter -->
          <CSelect
            v-model="filtroCatCarrera"
            :items="carrerasEnCatalogo"
            option-label="label"
            option-value="value"
            clearable
            placeholder="Todas las carreras"
          />

          <!-- Semestre filter -->
          <CSelect
            v-model="filtroCatSemestre"
            :items="semestresEnCatalogo"
            option-label="label"
            option-value="value"
            clearable
            placeholder="Todos los semestres"
          />

          <p class="text-[10px] text-muted-foreground leading-relaxed">
            Arrastra un curso a la grilla o pulsa <strong>+</strong> para agregarlo.
            Los cursos <strong>pendientes</strong> de tu semestre están marcados.
          </p>
        </div>

        <!-- Catalog list -->
        <div class="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
          <template v-if="personalStore.loading">
            <div v-for="i in 6" :key="i" class="h-14 rounded-[0.6rem] bg-muted animate-pulse border-2 border-black" />
          </template>
          <template v-else-if="catalogoFiltrado.length === 0">
            <div class="text-center py-6 space-y-1.5">
              <Icon name="lucide:search-x" class="size-8 text-muted-foreground/40 mx-auto" />
              <p class="text-xs text-muted-foreground">No hay cursos que coincidan con los filtros.</p>
            </div>
          </template>
          <TransitionGroup v-else name="cat-list">
            <CourseCatalogItem
              v-for="detalle in catalogoFiltrado"
              :key="detalle.detalle_id"
              :detalle="detalle"
              :added="personalStore.estaSeleccionado(detalle)"
              :pending="personalStore.estudiante.cursos_pendientes.includes(detalle.curso_codigo)"
              @add="onPersonalDrop({ detalleId: detalle.detalle_id })"
              @remove="personalStore.quitar(detalle)"
            />
          </TransitionGroup>
        </div>
      </aside>

      <!-- ── Right: Personal schedule grid ─────────────────────────────────── -->
      <SchedulePrintArea
        ref="printArea"
        titulo="Mi Horario"
        :subtitulo="personalStore.propuesto ? `Basado en: ${personalStore.propuesto.nombre}` : undefined"
        :chips="printChips"
        class="border border-black rounded-xl  bg-card p-4 overflow-x-auto relative min-h-64"
      >
        <div
          v-if="personalStore.loading"
          class="absolute inset-0 z-10 flex items-center justify-center bg-card/70 rounded-xl"
        >
          <div class="flex items-center gap-2 text-sm font-semibold">
            <Icon name="svg-spinners:bars-rotate-fade" class="size-5" />
            Cargando...
          </div>
        </div>
        <ScheduleGrid
          :detalles="personalStore.bloquesColocados"
          :periodos="personalStore.periodos"
          :conflict-ids="personalStore.conflictoIds"
          :editable="false"
          :readonly="false"
          :catalog-mode="true"
          :clickable="true"
          @drop="onPersonalDrop"
          @remove-block="onRemoveBlock"
          @click-block="onClickBlock"
        />
        <p class="text-[10px] text-muted-foreground mt-2 print:hidden">
          Tip: arrastra un curso a cualquier día/hora que prefieras (es solo tu organización personal,
          no cambia tu inscripción real); si choca con otro, se marca en rojo. Haz clic en un bloque
          para <strong>cambiar de sección</strong>, quitarlo o volver a su horario oficial.
        </p>
      </SchedulePrintArea>

    </div>

    </template>

    <!-- ── Proposed schedule dialog ───────────────────────────────────────── -->
    <ProposedScheduleDialog
      v-model:open="propuestoOpen"
      :detalles="personalStore.catalogo"
      :periodos="personalStore.periodos"
      :horario-nombre="personalStore.propuesto?.nombre ?? ''"
    />

    <!-- ── Conflicts dialog ────────────────────────────────────────────────── -->
    <ConflictsDialog
      v-model:open="conflictsOpen"
      :conflictos="personalStore.conflictosLocales"
      :total-conflictos="personalStore.conflictosLocales.length"
      :aptitud="null"
      :loading="false"
      nota="Estos conflictos son solo de tu horario personal (de referencia): no afectan tu horario oficial ni impiden guardar, imprimir o exportar tu horario. Puedes dejarlos así si te conviene esa organización, o resolverlos cambiando de sección o moviendo el bloque."
    />

    <!-- ── Schedule assistant dialog ──────────────────────────────────────── -->
    <ScheduleAssistantDialog
      v-model:open="asistentOpen"
      :cursos-catalogo="cursosUnicos"
      :cursos-preseleccionados="personalStore.estudiante.cursos_pendientes"
      :sugerencia="personalStore.sugerenciaHorario"
      @armar="onAutoArmar"
    />

    <!-- ── Reset confirm dialog ────────────────────────────────────────────── -->
    <Dialog :open="reiniciarOpen" @update:open="reiniciarOpen = $event">
      <DialogContent title="¿Reiniciar tu horario?" closeButton>
        <p class="text-sm text-muted-foreground">
          Se vaciará tu selección actual ({{ personalStore.resumen.cursos }} curso{{ personalStore.resumen.cursos !== 1 ? 's' : '' }}).
          Si ya lo habías guardado, sigue existiendo hasta que presiones "Guardar" de nuevo.
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <Button variant="tonal" size="sm" @click="reiniciarOpen = false">
            Cancelar
          </Button>
          <Button severity="danger" size="sm" icon="lucide:rotate-ccw" @click="onReiniciar">
            Reiniciar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- ── Duplicate-without-offer confirm dialog ─────────────────────────── -->
    <Dialog :open="duplicarSinOfertaOpen" @update:open="duplicarSinOfertaOpen = $event">
      <DialogContent title="Tu semestre no tiene oferta este ciclo" closeButton>
        <p class="text-sm text-muted-foreground">
          El horario propuesto no tiene secciones para tu carrera y semestre
          (Sem. {{ personalStore.estudiante.semestre ?? '?' }}) este ciclo. Puedes duplicarlo de
          todos modos: se copiará el propuesto
          <strong>{{ duplicarAlcance === 'carrera' ? 'de tu carrera (todos los semestres)' : 'completo (todas las carreras)' }}</strong>
          — {{ duplicarAlcanceCount }} sección{{ duplicarAlcanceCount !== 1 ? 'es' : '' }} — y
          luego quitas los cursos que no te correspondan.
        </p>
        <p class="text-xs text-muted-foreground mt-2">
          También puedes cancelar y usar el catálogo de la izquierda con el filtro
          "Todos los semestres" para agregar solo los cursos que quieras.
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <Button variant="tonal" size="sm" @click="duplicarSinOfertaOpen = false">
            Cancelar
          </Button>
          <Button size="sm" icon="lucide:copy" @click="onDuplicarDeTodosModos">
            Duplicar de todos modos
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- ── Move-block confirm dialog ──────────────────────────────────────── -->
    <Dialog :open="moverOpen" @update:open="moverOpen = $event">
      <DialogContent title="Confirmar movimiento" closeButton>
        <template v-if="moverPendiente">
          <p class="text-sm">
            ¿Colocar <strong>{{ moverPendiente.detalle.curso_nombre }}</strong> en
            <strong>{{ labelHorario(moverPendiente.diaHorarioId, moverPendiente.periodoInicioId, moverPendiente.periodoFinId) }}</strong>?
          </p>
          <p class="text-xs text-muted-foreground mt-2">
            Este es tu horario personal de referencia, no el oficial de la sección: puedes ponerlo
            donde te convenga. Si choca con otro curso, se marcará en rojo en la grilla, pero el
            cambio se aplica igual.
          </p>
          <div class="flex gap-2 justify-end mt-4">
            <Button variant="tonal" size="sm" @click="onCancelarMover">
              Cancelar
            </Button>
            <Button size="sm" icon="lucide:check" @click="onConfirmarMover">
              Colocar aquí
            </Button>
          </div>
        </template>
      </DialogContent>
    </Dialog>

    <!-- ── Swap section dialog ────────────────────────────────────────────── -->
    <SwapSectionDialog
      v-model:open="swapOpen"
      :actual="swapDetalle"
      :alternativas="swapAlternativas"
      :conflictivas="swapConflictivas"
      @swap="onSwap"
      @remove="onRemoveFromSwap"
      @restaurar="() => swapDetalle && onRestaurarPosicion(swapDetalle)"
    />

  </div>
</template>

<style scoped>
.cat-list-enter-active,
.cat-list-leave-active {
  transition: all 0.18s ease;
}
.cat-list-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.cat-list-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
