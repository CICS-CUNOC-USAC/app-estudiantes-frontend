<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import { Dialog } from '~/components/ui/dialog'
import type { HorarioDetalle, EditarDetalleInput } from '~/lib/api/schedules-generator/types'
import { csvUrl, pdfUrl } from '~/lib/api/schedules-generator/horarios'

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

const route = useRoute()

onMounted(async () => {
  await store.fetchHorariosAction()
  await store.fetchCatalogos()
  if (store.horarios.length > 0) {
    // ?id= lets the algorithm page land here with the freshly generated schedule selected
    const queryId = route.query.id ? +String(route.query.id) : null
    const porQuery = queryId !== null ? store.horarios.find(h => h.id === queryId) : undefined
    const activo = porQuery ?? store.horarios.find(h => h.es_activo) ?? store.horarios[0]
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

// Items for CSelect (values travel as strings). The short date helps tell
// apart versions with similar names.
const horarioItems = computed(() =>
  store.horarios.map(h => ({
    label: `#${h.id} · ${h.nombre}`
      + (h.fecha_generacion ? ` · ${new Date(h.fecha_generacion).toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: '2-digit' })}` : '')
      + (h.es_activo ? ' ✓ Activo' : ''),
    value: String(h.id),
  })),
)

const selectedHorarioStr = computed<string | null>({
  get: () => (selectedHorarioId.value !== null ? String(selectedHorarioId.value) : null),
  set: (v) => {
    selectedHorarioId.value = v ? +v : null
    onSelectHorario()
  },
})

const carreraItems = computed(() =>
  store.carreras.map(c => ({ label: c.nombre, value: String(c.id) })),
)

// Version date: when the algorithm generated this schedule. The scheduler DB
// does not store a date per manual edit, so if any block has modificado_manual
// the UI labels it "con ediciones manuales posteriores".
const fechaGeneracion = computed(() => {
  const f = horarioSeleccionado.value?.fecha_generacion
  if (!f) return null
  return new Date(f).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
})

// ── Print / PDF ──
const printArea = ref<{ imprimir: () => Promise<void> } | null>(null)

const printChips = computed(() => {
  const chips: string[] = []
  if (horarioSeleccionado.value?.es_activo) chips.push('Oficial')
  if (fechaGeneracion.value) chips.push(`Generado el ${fechaGeneracion.value}`)
  const carrera = store.carreras.find(c => String(c.id) === filtroCarrera.value)
  if (carrera) chips.push(carrera.nombre)
  if (filtroSemestre.value) chips.push(`Semestre ${filtroSemestre.value}`)
  return chips
})

const semestreItems = computed(() =>
  Array.from({ length: 10 }, (_, i) => ({ label: `Semestre ${i + 1}`, value: String(i + 1) })),
)

// ── Handlers ──────────────────────────────────────────────────────────────────

async function onSelectHorario() {
  if (selectedHorarioId.value === null) return
  await store.fetchHorarioAction(selectedHorarioId.value)
}

async function onFiltroCarrera(val: string | null) {
  filtroCarrera.value = val ?? ''
  store.setFiltros({ carrera_id: val ? +val : null })
  if (selectedHorarioId.value !== null) await store.fetchHorarioAction(selectedHorarioId.value)
}

async function onFiltroSemestre(val: string | null) {
  filtroSemestre.value = val ?? ''
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

async function onExportarPdf() {
  if (selectedHorarioId.value === null) return

  try {

    const response = await fetch(pdfUrl(selectedHorarioId.value), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al generar el documento PDF');
    }

    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(pdfBlob);

    window.open(url, '_blank');

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);

  } catch (error) {
    console.error("Error al visualizar:", error);
  } 
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

// The day pattern (Mon/Wed/Fri vs Tue/Thu) is fixed by the grid's active tab,
// so a drop can only change hour and/or room, never the day group.
async function onDrop(payload: { detalleId: number; nuevoPeriodoId: number; salonId: number | null }) {
  const det = store.detalles.find(d => d.detalle_id === payload.detalleId)
  if (!det) return

  const span = det.periodo_fin_id - det.periodo_inicio_id + 1
  const cambios: EditarDetalleInput = {
    periodo_inicio_id: payload.nuevoPeriodoId,
    periodo_fin_id: payload.nuevoPeriodoId + span - 1,
  }
  const cambiaSalon = payload.salonId !== det.salon_id
  if (cambiaSalon) cambios.salon_id = payload.salonId

  try {
    const resp = await store.editarDetalleAction(payload.detalleId, cambios)
    if (resp?.advertencias?.length) {
      toast.warning(`Movido con ${resp.advertencias.length} advertencia(s). Revisa conflictos.`)
    }
    else {
      toast.success(cambiaSalon ? 'Bloque reubicado (salón y horario actualizados)' : 'Bloque reubicado')
    }
  }
  catch {
    toast.error('No se pudo reubicar el bloque')
  }
}

function onClickBlock(detalle: HorarioDetalle) {
  editDetalle.value = detalle
  editOpen.value = true
}

async function onSaveDetalle(cambios: EditarDetalleInput) {
  if (!editDetalle.value) return
  try {
    const resp = await store.editarDetalleAction(editDetalle.value.detalle_id, cambios)
    if (resp?.advertencias?.length) {
      toast.warning(`Guardado con ${resp.advertencias.length} advertencia(s). Revisa conflictos.`)
    }
    else {
      toast.success('Bloque actualizado')
    }
    editOpen.value = false
  }
  catch {
    toast.error('No se pudo actualizar el bloque')
  }
}
</script>

<template>
  <div class="px-4 sm:px-6 pt-6 space-y-6">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Icon name="lucide:calendar-days" class="size-5 shrink-0" />
          <h1 class="text-xl font-black tracking-tight">Horario Oficial — Visualizar y Editar</h1>
        </div>
        <p class="text-sm text-muted-foreground">
          Visualiza los horarios ya generados y marca uno como oficial. Arrastra un curso a otra
          fila para cambiar su hora o a otra columna para cambiar su salón.
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
            <CSelect
              v-model="selectedHorarioStr"
              :items="horarioItems"
              option-label="label"
              option-value="value"
              :placeholder="store.horarios.length === 0 ? 'Sin horarios' : 'Selecciona un horario'"
              :disabled="store.horarios.length === 0"
              class="min-w-56"
            />
            <span
              v-if="horarioSeleccionado"
              class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-card font-mono"
            >
              ID #{{ horarioSeleccionado.id }}
            </span>
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
            <span v-if="fechaGeneracion">
              Generado: <strong>{{ fechaGeneracion }}</strong>
            </span>
            <span v-if="store.tieneEdicionManual" class="text-amber-600 dark:text-amber-400">
              <strong>Con ediciones manuales posteriores</strong>
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
          <Button severity="danger" size="sm" icon="lucide:triangle-alert" @click="onOpenConflictos">
            Conflictos
          </Button>
          <Button severity="success" size="sm" icon="lucide:download" @click="onExportarCsv">
            Exportar CSV
          </Button>
          <Button variant="tonal" size="sm" icon="lucide:printer" @click="onExportarPdf">
            Imprimir / PDF
          </Button>
          <Button
            variant="tonal"
            size="sm"
            icon="lucide:check"
            :disabled="horarioSeleccionado?.es_activo === true"
            @click="onActivar"
          >
            Activar
          </Button>
          <Button
            variant="text"
            severity="danger"
            size="sm"
            icon="lucide:trash-2"
            aria-label="Eliminar horario"
            @click="deleteOpen = true"
          />
        </div>
      </div>

      <div v-if="horarioSeleccionado" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
            {{ horarioSeleccionado.aptitud_final !== null ? aptitudPct + '%' : '—' }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Aptitud</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div class="text-xl font-extrabold text-foreground tabular-nums leading-none">
            {{ horarioSeleccionado.generaciones_ejecutadas ?? '—' }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Generaciones</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div
            class="text-xl font-extrabold tabular-nums leading-none"
            :class="store.conflictoIds.length > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'"
          >
            {{ store.conflictoIds.length }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflictos</div>
        </div>
        <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
          <div
            class="text-xl font-extrabold leading-none"
            :class="horarioSeleccionado.es_activo ? 'text-green-600 dark:text-green-400' : 'text-foreground'"
          >
            {{ horarioSeleccionado.es_activo ? 'Oficial' : 'Borrador' }}
          </div>
          <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Estado</div>
        </div>
      </div>
    </div>

    <!-- ── Filters ─────────────────────────────────────────────────────────── -->
    <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4">
      <div class="flex flex-wrap items-center gap-3">
        <CSelect
          :model-value="filtroCarrera || null"
          :items="carreraItems"
          option-label="label"
          option-value="value"
          clearable
          placeholder="Todas las carreras"
          class="min-w-48"
          @update:model-value="onFiltroCarrera"
        />

        <CSelect
          :model-value="filtroSemestre || null"
          :items="semestreItems"
          option-label="label"
          option-value="value"
          clearable
          placeholder="Todos los semestres"
          class="min-w-44"
          @update:model-value="onFiltroSemestre"
        />

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
          <span class="flex items-center gap-1">
            <span class="w-3 h-3 rounded border-2 border-red-500 bg-red-100 dark:bg-red-900 inline-block animate-pulse" />
            Conflicto
          </span>
        </div>
      </div>
    </div>

    <!-- ── Error state ─────────────────────────────────────────────────────── -->
    <div
      v-if="store.error"
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-red-50 dark:bg-red-950/30 p-4 flex flex-wrap items-center justify-between gap-3"
    >
      <p class="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
        <Icon name="lucide:circle-alert" class="size-4" />
        {{ store.error }}
      </p>
      <Button
        variant="tonal"
        size="sm"
        icon="lucide:rotate-ccw"
        @click="store.fetchHorariosAction().then(() => selectedHorarioId !== null && store.fetchHorarioAction(selectedHorarioId))"
      >
        Reintentar
      </Button>
    </div>

    <!-- ── Empty state ─────────────────────────────────────────────────────── -->
    <div
      v-if="!store.loading && !store.error && store.horarios.length === 0"
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-6 text-center space-y-2"
    >
      <Icon name="lucide:calendar-off" class="size-10 text-muted-foreground/40 mx-auto" />
      <p class="text-sm font-black">No hay horarios generados</p>
      <p class="text-xs text-muted-foreground">Genera uno desde la página del algoritmo.</p>
      <Button variant="tonal" size="sm" icon="lucide:brain-circuit" to="/admin/schedules-generator/algoritmo">
        Ir al algoritmo
      </Button>
    </div>

    <!-- ── Schedule grid ───────────────────────────────────────────────────── -->
    <SchedulePrintArea
      ref="printArea"
      :titulo="horarioSeleccionado ? `Horario: ${horarioSeleccionado.nombre}` : 'Horario'"
      :subtitulo="horarioSeleccionado ? `ID #${horarioSeleccionado.id}` : undefined"
      :chips="printChips"
      class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 overflow-x-auto relative min-h-40"
    >
      <div
        v-if="store.loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-card/70 rounded-xl"
      >
        <div class="flex items-center gap-2 text-sm font-semibold">
          <Icon name="svg-spinners:bars-rotate-fade" class="size-5" />
          Cargando...
        </div>
      </div>
      <RoomScheduleGrid
        :detalles="store.detallesFiltrados"
        :periodos="store.periodos"
        :conflict-ids="store.conflictoIds"
        :salones="store.salones"
        :show-empty-salones="true"
        :editable="true"
        :readonly="false"
        @drop="onDrop"
        @click-block="onClickBlock"
      />
    </SchedulePrintArea>

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
      :conflictos="store.conflictosLegibles"
      :total-conflictos="store.conflictosData?.total_conflictos ?? 0"
      :aptitud="store.conflictosData?.aptitud_recalculada ?? null"
      :loading="store.loading"
    />

    <!-- ── Delete confirm dialog ──────────────────────────────────────────── -->
    <Dialog :open="deleteOpen" @update:open="deleteOpen = $event">
      <DialogContent title="¿Eliminar este horario?" closeButton>
        <p class="text-sm text-muted-foreground">
          Esta acción no se puede deshacer. El horario
          <strong>{{ horarioSeleccionado?.nombre }}</strong> será eliminado permanentemente.
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <Button variant="tonal" size="sm" @click="deleteOpen = false">
            Cancelar
          </Button>
          <Button
            severity="danger"
            size="sm"
            icon="lucide:trash-2"
            :loading="deleteLoading"
            @click="onDelete"
          >
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  </div>
</template>
