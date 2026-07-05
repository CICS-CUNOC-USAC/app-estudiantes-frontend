<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { toast } from 'vue-sonner'
import type { HorarioDetalle } from '~/lib/api/schedules-generator/types'

definePageMeta({
  layout: 'dashboard',
  title: 'Mi Horario',
  wideScreen: true,
})

const personalStore = usePersonalScheduleStore()

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  await personalStore.cargarPropuesto()
  await personalStore.cargarContextoEstudiante()
  await personalStore.cargar()
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

const swapOpen = ref(false)
const swapDetalle = ref<HorarioDetalle | null>(null)

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

function onPersonalDrop(payload: { detalleId: number }) {
  const detalle = personalStore.catalogo.find(d => d.detalle_id === payload.detalleId)
  if (!detalle) return
  if (personalStore.estaSeleccionado(detalle)) return
  personalStore.agregar(detalle)
  toast.success(`${detalle.curso_nombre} agregado a tu horario`)
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

function onDuplicarPropuesto() {
  personalStore.duplicarPropuesto()
  toast.success('Horario propuesto duplicado. Ahora puedes personalizarlo.')
}

function onAgregarPendiente(codigo: string) {
  const secciones = personalStore.catalogo.filter(d => d.curso_codigo === codigo && !d.es_laboratorio)
  if (secciones.length === 0) {
    toast.error(`No hay secciones disponibles de ${codigo}`)
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
    if (personalStore.conflictoIds.length > 0) {
      toast.info('Horario armado, pero quedaron choques. Revisa los bloques en rojo.')
    }
    else if (personalStore.cursosPendientesFaltantes.length > 0) {
      toast.info('Horario armado; algunos cursos quedaron fuera por choque de horario.')
    }
    else {
      toast.success('¡Horario armado sin choques!')
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

function onImprimir() {
  window.print()
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
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-card"
            >
              Sem. {{ personalStore.estudiante.semestre ?? '?' }}
            </span>
          </template>
          <!-- Estado de completitud -->
          <span
            v-if="personalStore.horarioCompleto"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <Icon name="lucide:check" class="size-3" />
            Horario completo
          </span>
          <span
            v-else-if="personalStore.cursosPendientesFaltantes.length > 0"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
          >
            Te falta agregar {{ personalStore.cursosPendientesFaltantes.length }} curso{{ personalStore.cursosPendientesFaltantes.length !== 1 ? 's' : '' }}
          </span>
          <template v-if="personalStore.conflictosLocales.length > 0">
            <span
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            >
              <Icon name="lucide:triangle-alert" class="size-3" />
              {{ personalStore.conflictosLocales.length }} conflicto{{ personalStore.conflictosLocales.length !== 1 ? 's' : '' }}
            </span>
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
          size="sm"
          icon="lucide:save"
          :loading="guardandoHorario || personalStore.loadingSave"
          @click="onGuardar"
        >
          Guardar
        </Button>
      </div>
    </div>

    <!-- ── "Mi avance" academic panel ─────────────────────────────────────── -->
    <div
      v-if="personalStore.statsAcademicas"
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 space-y-3 print:hidden"
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
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
            {{ personalStore.statsAcademicas.cursosAprobados }}<span class="text-sm text-muted-foreground">/{{ personalStore.statsAcademicas.cursosTotales }}</span>
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Cursos aprobados</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
            {{ personalStore.statsAcademicas.creditosGanados }}<span class="text-sm text-muted-foreground">/{{ personalStore.statsAcademicas.creditosCarrera }}</span>
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos ganados</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
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
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
            {{ personalStore.statsAcademicas.creditosDisponibles }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos disponibles</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div
            class="text-xl font-extrabold tabular-nums leading-none"
            :class="personalStore.excedeCreditos ? 'text-red-500' : 'text-foreground'"
          >
            {{ personalStore.creditosEnHorario }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos en mi horario</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div
            class="text-xl font-extrabold tabular-nums leading-none"
            :class="personalStore.conflictoIds.length > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'"
          >
            {{ personalStore.conflictoIds.length }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflictos</div>
        </div>
      </div>

      <!-- Avisos de carga del ciclo y jornada -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span v-if="personalStore.excedeCreditos" class="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
          <Icon name="lucide:triangle-alert" class="size-3.5" />
          Superas tus créditos disponibles este ciclo
        </span>
        <span v-if="personalStore.resumen.cursos > 0">
          {{ personalStore.creditosEnHorario }} créditos · {{ personalStore.resumen.cursos }} curso{{ personalStore.resumen.cursos !== 1 ? 's' : '' }} este ciclo
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
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-amber-50 dark:bg-amber-950/30 p-4 print:hidden"
    >
      <p class="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Icon name="lucide:list-todo" class="size-4 text-cics-primary" />
        Te faltan por agregar
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="codigo in personalStore.cursosPendientesFaltantes"
          :key="codigo"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-full bg-card pl-2.5 pr-1 py-0.5 text-xs font-bold shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
        >
          {{ codigo }}
          <button
            type="button"
            class="inline-flex items-center gap-0.5 rounded-full border border-black bg-cics-primary text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 hover:brightness-110 active:translate-y-px"
            @click="onAgregarPendiente(codigo)"
          >
            <Icon name="lucide:plus" class="size-3" />
            Agregar
          </button>
        </span>
      </div>
    </div>

    <!-- ── Empty state / onboarding ───────────────────────────────────────── -->
    <div
      v-if="!personalStore.loading && personalStore.bloquesColocados.length === 0"
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-6 text-center space-y-3 print:hidden"
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
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-red-50 dark:bg-red-950/30 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden"
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
          'border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 space-y-3 lg:sticky lg:top-4 flex-col print:hidden',
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
      <div
        id="horario-print"
        class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 overflow-x-auto relative min-h-64"
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
          Tip: haz clic en un bloque para <strong>cambiar de sección</strong> o quitarlo.
          Cada sección tiene día y hora fijos; mover un curso significa elegir otra sección.
        </p>
      </div>

    </div>

    <!-- ── Proposed schedule dialog ───────────────────────────────────────── -->
    <ProposedScheduleDialog
      v-model:open="propuestoOpen"
      :detalles="personalStore.catalogo"
      :periodos="personalStore.periodos"
      :horario-nombre="personalStore.propuesto?.nombre ?? ''"
    />

    <!-- ── Schedule assistant dialog ──────────────────────────────────────── -->
    <ScheduleAssistantDialog
      v-model:open="asistentOpen"
      :cursos-catalogo="cursosUnicos"
      :cursos-preseleccionados="personalStore.estudiante.cursos_pendientes"
      @armar="onAutoArmar"
    />

    <!-- ── Swap section dialog ────────────────────────────────────────────── -->
    <SwapSectionDialog
      v-model:open="swapOpen"
      :actual="swapDetalle"
      :alternativas="swapAlternativas"
      :conflictivas="swapConflictivas"
      @swap="onSwap"
      @remove="onRemoveFromSwap"
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

<style>
/* Imprimir: solo la grilla del horario personal */
@media print {
  body * {
    visibility: hidden;
  }
  #horario-print,
  #horario-print * {
    visibility: visible;
  }
  #horario-print {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
