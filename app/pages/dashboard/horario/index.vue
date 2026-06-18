<script setup lang="ts">
import { ref, computed } from 'vue'
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
const filtroCatCarrera = ref<string>('')
const filtroCatSemestre = ref<string>('')

// ── Dialog state ──────────────────────────────────────────────────────────────

const propuestoOpen = ref(false)
const asistentOpen = ref(false)
const guardandoHorario = ref(false)
const catalogoVisible = ref(false)

// ── Computed: unique carrera ids present in catalogo ─────────────────────────

const carrerasEnCatalogo = computed(() => {
  const seen = new Map<number, string>()
  for (const d of personalStore.catalogo) {
    if (d.carrera_id !== null && d.carrera_nombre !== null && !seen.has(d.carrera_id)) {
      seen.set(d.carrera_id, d.carrera_nombre)
    }
  }
  return Array.from(seen.entries()).map(([id, nombre]) => ({ id, nombre }))
})

// ── Computed: unique semestres present in catalogo ────────────────────────────

const semestresEnCatalogo = computed(() => {
  const s = new Set<number>()
  for (const d of personalStore.catalogo) s.add(d.semestre)
  return [...s].sort((a, b) => a - b)
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

// ── Handlers ──────────────────────────────────────────────────────────────────

function onPersonalDrop(payload: { detalleId: number }) {
  const detalle = personalStore.catalogo.find(d => d.detalle_id === payload.detalleId)
  if (detalle) personalStore.agregar(detalle)
}

function onRemoveBlock(detalle: HorarioDetalle) {
  personalStore.quitar(detalle)
}

function onAutoArmar(payload: { cursos: string[]; jornada: 'manana' | 'tarde' | 'ambas' }) {
  personalStore.autoArmar(payload.cursos, payload.jornada)
  asistentOpen.value = false
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
</script>

<template>
  <div class="px-4 sm:px-6 pt-6 space-y-4">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          <template v-if="personalStore.resumen.cursos > 0">
            <span class="w-px h-3 bg-border inline-block" />
            <span>{{ personalStore.resumen.cursos }} curso{{ personalStore.resumen.cursos !== 1 ? 's' : '' }}</span>
          </template>
          <template v-if="personalStore.conflictosLocales.length > 0">
            <span
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
            >
              {{ personalStore.conflictosLocales.length }} conflicto{{ personalStore.conflictosLocales.length !== 1 ? 's' : '' }}
            </span>
          </template>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-card text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
          @click="propuestoOpen = true"
        >
          Ver propuesto
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-cics-primary text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
          @click="asistentOpen = true"
        >
          Armar automáticamente
        </button>
        <button
          type="button"
          :disabled="guardandoHorario || personalStore.loadingSave"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-cics-blue text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none"
          @click="onGuardar"
        >
          <svg
            v-if="guardandoHorario || personalStore.loadingSave"
            class="animate-spin w-3.5 h-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Guardar
        </button>
      </div>
    </div>

    <!-- ── Mobile: catalog toggle button ────────────────────────────────── -->
    <div class="flex lg:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-card text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        @click="catalogoVisible = !catalogoVisible"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {{ catalogoVisible ? 'Ocultar catálogo' : 'Ver catálogo de cursos' }}
        <span
          v-if="personalStore.resumen.cursos === 0"
          class="inline-flex items-center text-[0.6rem] font-extrabold uppercase py-[0.15rem] px-2 border-2 border-black rounded-full bg-cics-primary text-white"
        >Nuevo</span>
      </button>
    </div>

    <!-- ── Two-column layout ──────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] 2xl:grid-cols-[380px_1fr] gap-4 items-start">

      <!-- ── Left: Course catalog panel ────────────────────────────────────── -->
      <aside
        :class="[
          'border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 space-y-3 lg:sticky lg:top-4 flex flex-col',
          'max-h-[calc(100vh-6rem)]',
          catalogoVisible ? 'flex' : 'hidden lg:flex',
        ]"
      >
        <div class="shrink-0 space-y-2">
          <h2 class="text-sm font-black">Cursos disponibles · horario propuesto</h2>

          <!-- Search -->
          <input
            v-model="busqueda"
            type="search"
            placeholder="Buscar curso o código..."
            class="w-full appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800 placeholder:text-muted-foreground placeholder:font-normal"
          />

          <!-- Carrera filter -->
          <select
            v-model="filtroCatCarrera"
            class="w-full appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
          >
            <option value="">Todas las carreras</option>
            <option v-for="c in carrerasEnCatalogo" :key="c.id" :value="String(c.id)">
              {{ c.nombre }}
            </option>
          </select>

          <!-- Semestre filter -->
          <select
            v-model="filtroCatSemestre"
            class="w-full appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
          >
            <option value="">Todos los semestres</option>
            <option v-for="s in semestresEnCatalogo" :key="s" :value="String(s)">
              Semestre {{ s }}
            </option>
          </select>

          <p class="text-[10px] text-muted-foreground leading-relaxed">
            Por defecto se muestran los cursos de tu semestre, pero puedes elegir "Todos los semestres".
          </p>
        </div>

        <!-- Catalog list -->
        <div class="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
          <template v-if="personalStore.loading">
            <div v-for="i in 6" :key="i" class="h-14 rounded-[0.6rem] bg-muted animate-pulse border-2 border-black" />
          </template>
          <template v-else-if="catalogoFiltrado.length === 0">
            <p class="text-center text-xs text-muted-foreground py-6">
              No hay cursos que coincidan con los filtros.
            </p>
          </template>
          <CourseCatalogItem
            v-for="detalle in catalogoFiltrado"
            :key="detalle.detalle_id"
            :detalle="detalle"
            :added="personalStore.estaSeleccionado(detalle)"
            @add="personalStore.agregar(detalle)"
            @remove="personalStore.quitar(detalle)"
          />
        </div>
      </aside>

      <!-- ── Right: Personal schedule grid ─────────────────────────────────── -->
      <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 overflow-x-auto relative min-h-64">
        <div
          v-if="personalStore.loading"
          class="absolute inset-0 z-10 flex items-center justify-center bg-card/70 rounded-xl"
        >
          <div class="flex items-center gap-2 text-sm font-semibold">
            <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Cargando...
          </div>
        </div>
        <ScheduleGrid
          :detalles="personalStore.bloquesColocados"
          :periodos="personalStore.periodos"
          :editable="false"
          :readonly="false"
          :catalog-mode="true"
          @drop="onPersonalDrop"
          @remove-block="onRemoveBlock"
        />
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

  </div>
</template>
