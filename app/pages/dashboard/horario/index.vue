<script setup lang="ts">
import { ref, computed, nextTick, onErrorCaptured } from 'vue'
import { toast } from 'vue-sonner'
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

const moverDestinoLabel = computed(() =>
  moverPendiente.value
    ? labelHorario(moverPendiente.value.diaHorarioId, moverPendiente.value.periodoInicioId, moverPendiente.value.periodoFinId)
    : '',
)

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

// ── Computed: catalog entries annotated for the presentational panel ─────────

const catalogoPanelItems = computed(() =>
  catalogoFiltrado.value.map(detalle => ({
    detalle,
    added: personalStore.estaSeleccionado(detalle),
    pending: personalStore.estudiante.cursos_pendientes.includes(detalle.curso_codigo),
  })),
)

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

async function onReintentar() {
  await personalStore.cargarPropuesto()
  await personalStore.cargarContextoEstudiante()
  await personalStore.cargar()
}
</script>

<template>
  <div class="px-4 sm:px-6 pt-6 space-y-4">

    <PersonalScheduleHeader
      :propuesto-nombre="personalStore.propuesto?.nombre ?? null"
      :semestre="personalStore.estudiante.semestre"
      :show-semestre-badge="personalStore.estudiante.carrera_id !== null || personalStore.estudiante.semestre !== null"
      :horario-completo="personalStore.horarioCompleto"
      :cursos-faltantes="personalStore.cursosPendientesFaltantes.length"
      :conflictos-count="personalStore.conflictosLocales.length"
      :guardando="guardandoHorario || personalStore.loadingSave"
      :reiniciar-disabled="personalStore.bloquesColocados.length === 0"
      @ver-propuesto="propuestoOpen = true"
      @duplicar-propuesto="onDuplicarPropuesto"
      @armar="asistentOpen = true"
      @imprimir="onImprimir"
      @reiniciar="reiniciarOpen = true"
      @guardar="onGuardar"
      @ver-conflictos="conflictsOpen = true"
    />

    <!-- ── Skeleton de carga inicial: evita el parpadeo de "horario vacío" ── -->
    <PersonalScheduleSkeleton v-if="cargandoInicial" />

    <template v-else>

    <AcademicProgressPanel
      v-if="personalStore.statsAcademicas"
      :stats="personalStore.statsAcademicas"
      :conflictos-count="personalStore.conflictoIds.length"
      :resumen-cursos="personalStore.resumen.cursos"
      :resumen-jornada="personalStore.resumenJornada"
      @ver-conflictos="conflictsOpen = true"
    />

    <PendingCoursesBanner
      v-if="personalStore.cursosPendientesFaltantes.length > 0"
      :pendientes-con-oferta="personalStore.pendientesConOferta"
      :pendientes-sin-oferta="personalStore.pendientesSinOferta"
      :nombre-por-curso="personalStore.nombrePorCurso"
      @agregar="onAgregarPendiente"
    />

    <EmptyScheduleState
      v-if="!personalStore.loading && personalStore.bloquesColocados.length === 0"
      @duplicar-propuesto="onDuplicarPropuesto"
      @armar="asistentOpen = true"
    />

    <ScheduleErrorBanner
      v-if="personalStore.error"
      :message="personalStore.error"
      @retry="onReintentar"
    />

    <!-- ── Mobile: catalog toggle button ────────────────────────────────── -->
    <div class="flex lg:hidden print:hidden">
      <Button variant="tonal" size="sm" icon="lucide:menu" @click="catalogoVisible = !catalogoVisible">
        {{ catalogoVisible ? 'Ocultar catálogo' : 'Ver catálogo de cursos' }}
      </Button>
    </div>

    <!-- ── Two-column layout ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-4 items-start">

      <CourseCatalogPanel
        v-model:busqueda="busqueda"
        v-model:filtro-carrera="filtroCatCarrera"
        v-model:filtro-semestre="filtroCatSemestre"
        :visible="catalogoVisible"
        :loading="personalStore.loading"
        :carreras-items="carrerasEnCatalogo"
        :semestres-items="semestresEnCatalogo"
        :items="catalogoPanelItems"
        @add="onPersonalDrop({ detalleId: $event.detalle_id })"
        @remove="personalStore.quitar"
      />

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
    <ResetScheduleDialog
      v-model:open="reiniciarOpen"
      :cursos-count="personalStore.resumen.cursos"
      @confirm="onReiniciar"
    />

    <!-- ── Duplicate-without-offer confirm dialog ─────────────────────────── -->
    <DuplicateWithoutOfferDialog
      v-model:open="duplicarSinOfertaOpen"
      :semestre="personalStore.estudiante.semestre"
      :alcance="duplicarAlcance"
      :alcance-count="duplicarAlcanceCount"
      @confirm="onDuplicarDeTodosModos"
    />

    <!-- ── Move-block confirm dialog ──────────────────────────────────────── -->
    <MoveBlockConfirmDialog
      v-model:open="moverOpen"
      :detalle="moverPendiente?.detalle ?? null"
      :destino-label="moverDestinoLabel"
      @confirm="onConfirmarMover"
      @cancel="onCancelarMover"
    />

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
