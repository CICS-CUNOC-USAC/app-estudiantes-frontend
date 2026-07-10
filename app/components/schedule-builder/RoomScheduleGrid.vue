<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Room-occupancy grid: rows = periods (hours), columns = rooms. Many courses
 * can share the same hour (one per room), which the classic weekly grid cannot
 * show. dia_horario only has two patterns (1 = Mon/Wed/Fri, 2 = Tue/Thu), so
 * the day is picked with a tab; printing outputs BOTH groups.
 */

interface Period {
  id: number
  numero: number
  hora_inicio: string
  hora_fin: string
  es_manana: boolean
  es_tarde: boolean
}

interface HorarioDetalle {
  detalle_id: number
  dia_horario_id: number
  periodo_inicio_id: number
  periodo_fin_id: number
  es_laboratorio: boolean
  modificado_manual: boolean
  seccion_id: number | null
  seccion_lab_id: number | null
  salon_id: number | null
  salon_nombre: string | null
  salon_es_laboratorio: boolean | null
  [key: string]: unknown
}

interface Salon {
  id: number
  nombre: string
  es_laboratorio: boolean
  activo: boolean
}

const props = defineProps<{
  detalles: HorarioDetalle[]
  periodos: Period[]
  editable: boolean
  readonly: boolean
  conflictIds?: number[]
  /** Room catalog; with showEmptySalones it adds empty columns as drop targets */
  salones?: Salon[]
  /** Show ALL active rooms even without courses (occupancy/editing view) */
  showEmptySalones?: boolean
}>()

const emit = defineEmits<{
  'drop': [payload: { detalleId: number; nuevoPeriodoId: number; salonId: number | null; celdaOcupadaPor?: number }]
  'click-block': [detalle: HorarioDetalle]
}>()

const DIA_GRUPOS = [
  { id: 1, label: 'Lun · Mié · Vie', largo: 'Lunes · Miércoles · Viernes' },
  { id: 2, label: 'Mar · Jue', largo: 'Martes · Jueves' },
] as const

const diaActivo = ref<number>(1)

const conflictSet = computed(() => new Set(props.conflictIds ?? []))

interface ColumnaSalon {
  key: string
  id: number | null
  nombre: string
  esLab: boolean
}

function salonKey(salonId: number | null): string {
  return salonId !== null ? `s-${salonId}` : 'sin-salon'
}

function columnasDe(detallesDia: HorarioDetalle[]): ColumnaSalon[] {
  const map = new Map<string, ColumnaSalon>()
  if (props.showEmptySalones) {
    for (const s of props.salones ?? []) {
      if (!s.activo) continue
      map.set(`s-${s.id}`, { key: `s-${s.id}`, id: s.id, nombre: s.nombre, esLab: s.es_laboratorio })
    }
  }
  for (const d of detallesDia) {
    const key = salonKey(d.salon_id)
    if (!map.has(key)) {
      map.set(key, {
        key,
        id: d.salon_id,
        nombre: d.salon_nombre ?? 'Sin salón',
        esLab: d.salon_es_laboratorio === true,
      })
    }
  }
  const cols = [...map.values()]
  cols.sort((a, b) => {
    if (a.id === null) return 1
    if (b.id === null) return -1
    return a.nombre.localeCompare(b.nombre, 'es', { numeric: true, sensitivity: 'base' })
  })
  return cols
}

const grupos = computed(() =>
  DIA_GRUPOS.map((g) => {
    const detallesDia = props.detalles.filter(d => d.dia_horario_id === g.id)
    return { ...g, detalles: detallesDia, columnas: columnasDe(detallesDia) }
  }),
)

// Blocks STARTING at this cell; more than one means a room clash, which must
// stay visible, never hidden
function bloquesEn(detallesDia: HorarioDetalle[], col: ColumnaSalon, periodId: number): HorarioDetalle[] {
  return detallesDia.filter(d => salonKey(d.salon_id) === col.key && d.periodo_inicio_id === periodId)
}

// Is this cell covered by a multi-period block that started earlier?
function estaCubierta(detallesDia: HorarioDetalle[], col: ColumnaSalon, periodId: number): boolean {
  return detallesDia.some(d =>
    salonKey(d.salon_id) === col.key
    && d.periodo_inicio_id < periodId
    && d.periodo_fin_id >= periodId,
  )
}

function isFirstAfternoon(period: Period): boolean {
  if (!period.es_tarde) return false
  const index = props.periodos.findIndex(p => p.id === period.id)
  if (index <= 0) return false
  return props.periodos[index - 1]?.es_manana === true
}

function blockHeight(detalle: HorarioDetalle): number {
  const n = detalle.periodo_fin_id - detalle.periodo_inicio_id + 1
  return n * 46 + (n - 1) * 6
}

const maxPeriodId = computed<number>(() =>
  props.periodos.length > 0 ? Math.max(...props.periodos.map(p => p.id)) : 0,
)

function gridStyle(nCols: number) {
  return { gridTemplateColumns: `56px repeat(${nCols}, minmax(140px, 1fr))` }
}

// ── Drag & drop (editable only) ───────────────────────────────────────────────

const dragOverCell = ref<string | null>(null)

function cellKey(dia: number, col: ColumnaSalon, periodId: number): string {
  return `${dia}-${col.key}-${periodId}`
}

function onDragOver(e: DragEvent, dia: number, col: ColumnaSalon, periodId: number) {
  if (!props.editable) return
  e.preventDefault()
  dragOverCell.value = cellKey(dia, col, periodId)
}

function onDragLeave(dia: number, col: ColumnaSalon, periodId: number) {
  if (dragOverCell.value === cellKey(dia, col, periodId)) {
    dragOverCell.value = null
  }
}

function onDrop(e: DragEvent, detallesDia: HorarioDetalle[], col: ColumnaSalon, period: Period) {
  if (!props.editable) return
  e.preventDefault()
  dragOverCell.value = null

  const rawId = e.dataTransfer?.getData('detalleId')
  if (!rawId) return
  const detalleId = parseInt(rawId, 10)
  if (isNaN(detalleId)) return

  const detalle = props.detalles.find(d => d.detalle_id === detalleId)
  if (!detalle) return

  const span = detalle.periodo_fin_id - detalle.periodo_inicio_id + 1
  if (period.id + span - 1 > maxPeriodId.value) return

  const ocupante = bloquesEn(detallesDia, col, period.id).find(d => d.detalle_id !== detalleId)

  emit('drop', {
    detalleId,
    nuevoPeriodoId: period.id,
    salonId: col.id,
    celdaOcupadaPor: ocupante?.detalle_id,
  })
}

function onBlockDragStart(e: DragEvent, detalle: HorarioDetalle) {
  e.dataTransfer?.setData('detalleId', detalle.detalle_id.toString())
}
</script>

<template>
  <div>
    <!-- Without periods no rows can be drawn: fail visibly, never silently -->
    <div
      v-if="periodos.length === 0"
      class="border-2 border-dashed border-red-400 rounded-xl p-6 text-center space-y-1"
    >
      <Icon name="lucide:calendar-x" class="size-8 text-red-400 mx-auto" />
      <p class="text-sm font-black text-red-600 dark:text-red-400">No se cargaron los periodos de clase</p>
      <p class="text-xs text-muted-foreground">
        Sin periodos no se puede dibujar el horario. Verifica que el genetic-scheduler esté
        corriendo y recarga la página.
      </p>
    </div>

    <template v-else>
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <div class="flex items-center border-2 border-black rounded-[0.625rem] overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          <button
            v-for="(g, i) in grupos"
            :key="g.id"
            type="button"
            :class="[
              'px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
              diaActivo === g.id ? 'bg-cics-blue text-white' : 'bg-card text-foreground hover:bg-muted',
              i === 0 ? 'border-r-2 border-black' : '',
            ]"
            @click="diaActivo = g.id"
          >
            {{ g.label }}
            <span
              class="text-[9px] font-extrabold rounded-full px-1.5 py-px border"
              :class="diaActivo === g.id ? 'border-white/60' : 'border-black/40 text-muted-foreground'"
            >
              {{ g.detalles.length }}
            </span>
          </button>
        </div>
        <span class="text-[11px] text-muted-foreground hidden sm:inline">
          Columnas = salones · filas = horas
        </span>
      </div>

      <!-- One block per day group: only the active one on screen, both when printing -->
      <div
        v-for="g in grupos"
        :key="g.id"
        :class="g.id === diaActivo ? '' : 'hidden print:block'"
        class="print:mb-6"
      >
        <p class="hidden print:block text-sm font-black uppercase tracking-wider mb-1.5">
          {{ g.largo }}
        </p>

        <div
          v-if="g.columnas.length === 0"
          class="border-2 border-dashed border-border rounded-xl p-8 text-center"
        >
          <p class="text-sm font-semibold text-muted-foreground">
            No hay cursos asignados en {{ g.largo }}.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <div class="min-w-fit">

            <div
              class="grid gap-1.5 mb-1.5 sticky top-0 z-10 bg-card py-1"
              :style="gridStyle(g.columnas.length)"
            >
              <div class="text-[9px] font-black uppercase tracking-wider text-muted-foreground self-end text-right pr-1">
                Hora
              </div>
              <div
                v-for="col in g.columnas"
                :key="col.key"
                class="border-2 border-black rounded-lg text-center text-xs font-black uppercase tracking-wider py-1.5 px-1 truncate"
                :class="col.id === null
                  ? 'bg-muted text-muted-foreground'
                  : col.esLab ? 'bg-cyan-700 text-white' : 'bg-cics-blue text-white'"
                :title="col.nombre + (col.esLab ? ' (laboratorio)' : '')"
              >
                {{ col.nombre }}
                <span v-if="col.esLab" class="text-[8px] opacity-80 font-bold">· LAB</span>
              </div>
            </div>

            <div class="space-y-1.5">
              <div v-for="period in periodos" :key="period.id">

                <div
                  v-if="isFirstAfternoon(period)"
                  class="flex items-center gap-2 mt-3 mb-1.5 pl-14"
                >
                  <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Tarde</span>
                  <span class="flex-1 border-t-2 border-dashed border-border" />
                </div>

                <div
                  class="grid gap-1.5"
                  :class="{ 'bg-muted/30 rounded-lg': period.es_tarde }"
                  :style="gridStyle(g.columnas.length)"
                >
                  <div class="text-[9px] xl:text-[10px] font-bold text-muted-foreground text-right pr-1 pt-1 whitespace-pre-line leading-tight">{{ (period.hora_inicio ?? '').slice(0, 5) }}&#10;{{ (period.hora_fin ?? '').slice(0, 5) }}</div>

                  <template v-for="col in g.columnas" :key="col.key">
                    <!-- Blocks starting here; more than one is a room clash shown side by side -->
                    <div
                      v-if="bloquesEn(g.detalles, col, period.id).length > 0"
                      class="relative flex gap-1"
                      @dragover="onDragOver($event, g.id, col, period.id)"
                      @dragleave="onDragLeave(g.id, col, period.id)"
                      @drop="onDrop($event, g.detalles, col, period)"
                    >
                      <ScheduleBlock
                        v-for="detalle in bloquesEn(g.detalles, col, period.id)"
                        :key="detalle.detalle_id"
                        :detalle="detalle"
                        :editable="editable"
                        :readonly="readonly"
                        :show-remove="false"
                        :is-conflict="conflictSet.has(detalle.detalle_id)"
                        :style="{ minHeight: blockHeight(detalle) + 'px' }"
                        class="flex-1 min-w-0"
                        @click="emit('click-block', detalle)"
                        @dragstart="onBlockDragStart($event, detalle)"
                      />
                    </div>

                    <!-- Cell covered by a multi-period block that started earlier -->
                    <div v-else-if="estaCubierta(g.detalles, col, period.id)" />

                    <div
                      v-else
                      class="border-2 border-dashed border-border rounded-lg min-h-11.5 transition-colors duration-100"
                      :class="{
                        'border-cics-primary bg-orange-50 dark:bg-orange-950/20':
                          editable && dragOverCell === cellKey(g.id, col, period.id),
                      }"
                      @dragover="onDragOver($event, g.id, col, period.id)"
                      @dragleave="onDragLeave(g.id, col, period.id)"
                      @drop="onDrop($event, g.detalles, col, period)"
                    />
                  </template>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </template>
  </div>
</template>
