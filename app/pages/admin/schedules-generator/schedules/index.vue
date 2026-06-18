<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HorarioDetalle, EditarDetalleInput } from '~/lib/api/schedules-generator/types'
import { csvUrl } from '~/lib/api/schedules-generator/horarios'

definePageMeta({
  layout: 'admin',
  subject: ['all'],
  action: ['manage'],
  wideScreen: true,
})

const store = useOfficialScheduleStore()

// ── Local UI state ────────────────────────────────────────────────────────────

const selectedHorarioId = ref<number | null>(null)

const editOpen = ref(false)
const editDetalle = ref<HorarioDetalle | null>(null)

const conflictsOpen = ref(false)
const deleteOpen = ref(false)
const deleteLoading = ref(false)

const filtroCarrera = ref<string>('')
const filtroSemestre = ref<string>('')
const filtroTipo = ref<'' | 'cursos' | 'laboratorios'>('')

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  await store.fetchHorariosAction()
  await store.fetchCatalogos()
  if (store.horarios.length > 0) {
    const activo = store.horarios.find(h => h.es_activo) ?? store.horarios[0]
    selectedHorarioId.value = activo.id
    await store.fetchHorarioAction(activo.id)
  }
})

// ── Computed ──────────────────────────────────────────────────────────────────

const horarioSeleccionado = computed(() =>
  store.horarios.find(h => h.id === selectedHorarioId.value) ?? null,
)

const aptitudPct = computed(() => {
  const a = horarioSeleccionado.value?.aptitud_final
  if (a === null || a === undefined) return 0
  return Math.round(a * 100)
})

// ── Handlers ──────────────────────────────────────────────────────────────────

async function onSelectHorario() {
  if (selectedHorarioId.value === null) return
  await store.fetchHorarioAction(selectedHorarioId.value)
}

async function onFiltroCarrera(val: string) {
  filtroCarrera.value = val
  store.setFiltros({ carrera_id: val ? +val : null })
  if (selectedHorarioId.value !== null) await store.fetchHorarioAction(selectedHorarioId.value)
}

async function onFiltroSemestre(val: string) {
  filtroSemestre.value = val
  store.setFiltros({ semestre: val ? +val : null })
  if (selectedHorarioId.value !== null) await store.fetchHorarioAction(selectedHorarioId.value)
}

function onFiltroTipo(val: '' | 'cursos' | 'laboratorios') {
  filtroTipo.value = val
  store.setFiltros({ tipo: val })
}

async function onOpenConflictos() {
  if (selectedHorarioId.value === null) return
  await store.fetchConflictosAction(selectedHorarioId.value)
  conflictsOpen.value = true
}

function onExportarCsv() {
  if (selectedHorarioId.value === null) return
  window.open(csvUrl(selectedHorarioId.value), '_blank')
}

async function onActivar() {
  if (selectedHorarioId.value === null) return
  await store.activar(selectedHorarioId.value)
}

async function onDelete() {
  if (selectedHorarioId.value === null) return
  deleteLoading.value = true
  try {
    await store.eliminar(selectedHorarioId.value)
    deleteOpen.value = false
    selectedHorarioId.value = store.horarios.length > 0 ? store.horarios[0].id : null
    if (selectedHorarioId.value !== null) await store.fetchHorarioAction(selectedHorarioId.value)
  }
  finally {
    deleteLoading.value = false
  }
}

function onDrop(payload: { detalleId: number; nuevoPeriodoId: number }) {
  const detalleEncontrado = store.detalles.find(d => d.detalle_id === payload.detalleId)
  if (!detalleEncontrado) return
  const span = detalleEncontrado.periodo_fin_id - detalleEncontrado.periodo_inicio_id + 1
  const cambios: EditarDetalleInput = {
    periodo_inicio_id: payload.nuevoPeriodoId,
    periodo_fin_id: payload.nuevoPeriodoId + span - 1,
  }
  store.editarDetalleAction(payload.detalleId, cambios)
}

function onClickBlock(detalle: HorarioDetalle) {
  editDetalle.value = detalle
  editOpen.value = true
}

async function onSaveDetalle(cambios: EditarDetalleInput) {
  if (!editDetalle.value) return
  await store.editarDetalleAction(editDetalle.value.detalle_id, cambios)
  editOpen.value = false
}
</script>

<template>
  <div class="px-4 sm:px-6 pt-6 space-y-6">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h1 class="text-xl font-black tracking-tight">Horario Oficial — Visualizar y Editar</h1>
        </div>
        <p class="text-sm text-muted-foreground">
          Visualiza los horarios ya generados, edítalos arrastrando los cursos y marca uno como oficial.
        </p>
      </div>
      <span class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-card text-foreground self-start whitespace-nowrap">
        La generación con IA se hace en el genetic-scheduler
      </span>
    </div>

    <!-- ── Schedule selector ──────────────────────────────────────────────── -->
    <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 space-y-3">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <!-- Selector + meta -->
        <div class="space-y-2 flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <select
              v-model="selectedHorarioId"
              class="appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
              @change="onSelectHorario"
            >
              <option v-if="store.horarios.length === 0" :value="null" disabled>
                Sin horarios
              </option>
              <option
                v-for="h in store.horarios"
                :key="h.id"
                :value="h.id"
              >
                {{ h.nombre }}{{ h.es_activo ? ' ✓ Activo' : '' }}
              </option>
            </select>
            <span
              v-if="horarioSeleccionado?.es_activo"
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              Activo (oficial)
            </span>
          </div>

          <!-- Aptitud bar -->
          <div
            v-if="horarioSeleccionado?.aptitud_final !== null && horarioSeleccionado?.aptitud_final !== undefined"
            class="space-y-0.5"
          >
            <div class="flex items-center gap-2">
              <div class="relative h-3 w-48 rounded-full border-2 border-black overflow-hidden bg-muted">
                <div
                  class="absolute inset-y-0 left-0 h-full transition-all"
                  :style="{
                    width: aptitudPct + '%',
                    background: 'linear-gradient(90deg, #ef4444, #facc15 50%, #16a34a)',
                  }"
                />
                <div
                  class="absolute top-0 bottom-0 w-0.5 bg-black"
                  :style="{ left: aptitudPct + '%' }"
                />
              </div>
              <span class="text-xs font-bold tabular-nums">
                {{ horarioSeleccionado.aptitud_final.toFixed(4) }}
              </span>
            </div>
          </div>

          <!-- Meta info -->
          <div v-if="horarioSeleccionado" class="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <span v-if="horarioSeleccionado.generaciones_ejecutadas !== null">
              Generaciones: <strong>{{ horarioSeleccionado.generaciones_ejecutadas }}</strong>
            </span>
            <span v-if="horarioSeleccionado.tiempo_ejecucion_ms !== null">
              Tiempo: <strong>{{ (horarioSeleccionado.tiempo_ejecucion_ms / 1000).toFixed(1) }}s</strong>
            </span>
            <span v-if="horarioSeleccionado.metodo_seleccion">
              Selección: <strong>{{ horarioSeleccionado.metodo_seleccion }}</strong>
            </span>
            <span v-if="horarioSeleccionado.metodo_cruce">
              Cruce: <strong>{{ horarioSeleccionado.metodo_cruce }}</strong>
            </span>
            <span v-if="horarioSeleccionado.metodo_mutacion">
              Mutación: <strong>{{ horarioSeleccionado.metodo_mutacion }}</strong>
            </span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-red-500 text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
            @click="onOpenConflictos"
          >
            Conflictos
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-green-600 text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
            @click="onExportarCsv"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            :disabled="horarioSeleccionado?.es_activo === true"
            class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-cics-blue text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px disabled:opacity-40 disabled:pointer-events-none"
            @click="onActivar"
          >
            Activar
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-card text-red-600 shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-2.5 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
            aria-label="Eliminar horario"
            @click="deleteOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────────────────── -->
    <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Carrera -->
        <select
          :value="filtroCarrera"
          class="appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
          @change="onFiltroCarrera(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Todas las carreras</option>
          <option v-for="c in store.carreras" :key="c.id" :value="String(c.id)">
            {{ c.nombre }}
          </option>
        </select>

        <!-- Semestre -->
        <select
          :value="filtroSemestre"
          class="appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
          @change="onFiltroSemestre(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Todos</option>
          <option v-for="n in 10" :key="n" :value="String(n)">Semestre {{ n }}</option>
        </select>

        <!-- Tipo toggle -->
        <div class="flex items-center border-2 border-black rounded-[0.625rem] overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          <button
            v-for="opt in ([{ label: 'Todos', val: '' }, { label: 'Cursos', val: 'cursos' }, { label: 'Labs', val: 'laboratorios' }] as const)"
            :key="opt.val"
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-semibold transition-colors',
              filtroTipo === opt.val
                ? 'bg-cics-blue text-white'
                : 'bg-card text-foreground hover:bg-muted',
              opt.val !== 'laboratorios' ? 'border-r-2 border-black' : '',
            ]"
            @click="onFiltroTipo(opt.val)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-3 ml-auto text-[11px] font-medium text-muted-foreground">
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded border-2 border-black bg-white dark:bg-neutral-800 inline-block" />
            Teórica
          </span>
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded border-2 border-black bg-cyan-200 dark:bg-cyan-900 inline-block" />
            Lab
          </span>
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded border-2 border-black bg-amber-100 dark:bg-amber-900 inline-block" />
            Editado
          </span>
        </div>
      </div>
    </div>

    <!-- ── Schedule grid ───────────────────────────────────────────────────── -->
    <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 overflow-x-auto relative min-h-40">
      <div
        v-if="store.loading"
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
        :detalles="store.detallesFiltrados"
        :periodos="store.periodos"
        :editable="true"
        :readonly="false"
        @drop="onDrop"
        @click-block="onClickBlock"
      />
    </div>

    <!-- ── Edit detail dialog ─────────────────────────────────────────────── -->
    <EditDetailDialog
      v-if="editDetalle"
      v-model:open="editOpen"
      :detalle="editDetalle"
      :salones="store.salones"
      :docentes="store.docentes"
      :periodos="store.periodos"
      :loading="store.loadingDetalle"
      @save="onSaveDetalle"
    />

    <!-- ── Conflicts dialog ───────────────────────────────────────────────── -->
    <ConflictsDialog
      v-model:open="conflictsOpen"
      :conflictos="store.conflictos"
      :total-conflictos="store.conflictosData?.total_conflictos ?? 0"
      :aptitud="store.conflictosData?.aptitud_recalculada ?? null"
      :loading="store.loading"
    />

    <!-- ── Delete confirm dialog ──────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="deleteOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="deleteOpen = false"
        >
          <div class="border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-card p-6 w-full max-w-sm space-y-4">
            <h2 class="text-base font-black">¿Eliminar este horario?</h2>
            <p class="text-sm text-muted-foreground">
              Esta acción no se puede deshacer. El horario
              <strong>{{ horarioSeleccionado?.nombre }}</strong> será eliminado permanentemente.
            </p>
            <div class="flex gap-2 justify-end">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-card text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
                @click="deleteOpen = false"
              >
                Cancelar
              </button>
              <button
                type="button"
                :disabled="deleteLoading"
                class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm bg-red-500 text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none"
                @click="onDelete"
              >
                <svg v-if="deleteLoading" class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
