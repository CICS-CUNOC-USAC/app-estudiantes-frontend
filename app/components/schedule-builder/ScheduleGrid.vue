<script setup lang="ts">
import { computed, ref } from 'vue'

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
  [key: string]: unknown
}

const props = defineProps<{
  detalles: HorarioDetalle[]
  periodos: Period[]
  editable: boolean
  readonly: boolean
  catalogMode?: boolean
}>()

const emit = defineEmits<{
  'drop': [payload: { detalleId: number; nuevoPeriodoId: number }]
  'click-block': [detalle: HorarioDetalle]
  'remove-block': [detalle: HorarioDetalle]
}>()

// dia_horario_id 1 = L/Mi/V (columns 1, 3, 5), dia_horario_id 2 = Ma/J (columns 2, 4)
const DIA_COLS: Record<number, number[]> = {
  1: [1, 3, 5],
  2: [2, 4],
}

const DAY_LABELS = ['L', 'Ma', 'Mi', 'J', 'V']

// Track which cells are being dragged over: key = "colIndex-periodId"
const dragOverCell = ref<string | null>(null)

// Find the first afternoon period index to add top margin separator
function isFirstAfternoon(period: Period): boolean {
  if (!period.es_tarde) return false
  const index = props.periodos.findIndex((p) => p.id === period.id)
  if (index <= 0) return false
  return props.periodos[index - 1].es_manana
}

// Returns the detalle (if any) that occupies the given column and starts at the given period
function getDetalle(colIndex: number, periodId: number): HorarioDetalle | null {
  for (const detalle of props.detalles) {
    const cols = DIA_COLS[detalle.dia_horario_id]
    if (!cols) continue
    if (cols.includes(colIndex) && detalle.periodo_inicio_id === periodId) {
      return detalle
    }
  }
  return null
}

// Returns true if this cell is "occupied" by a block that *started* in an earlier row
// (so we don't render a drop slot there when a multi-period block spans it)
function isSpannedOver(colIndex: number, periodId: number): boolean {
  for (const detalle of props.detalles) {
    const cols = DIA_COLS[detalle.dia_horario_id]
    if (!cols) continue
    if (
      cols.includes(colIndex) &&
      detalle.periodo_inicio_id < periodId &&
      detalle.periodo_fin_id >= periodId
    ) {
      return true
    }
  }
  return false
}

// Compute block height in px for a detalle spanning N periods
function blockHeight(detalle: HorarioDetalle): number {
  const n = detalle.periodo_fin_id - detalle.periodo_inicio_id + 1
  return n * 46 + (n - 1) * 6
}

// Max period id for drop validation
const maxPeriodId = computed<number>(() =>
  props.periodos.length > 0
    ? Math.max(...props.periodos.map((p) => p.id))
    : 0
)

// HTML5 drag & drop handlers
function onDragOver(e: DragEvent, colIndex: number, periodId: number) {
  e.preventDefault()
  dragOverCell.value = `${colIndex}-${periodId}`
}

function onDragLeave(colIndex: number, periodId: number) {
  if (dragOverCell.value === `${colIndex}-${periodId}`) {
    dragOverCell.value = null
  }
}

function onDrop(e: DragEvent, colIndex: number, period: Period) {
  e.preventDefault()
  dragOverCell.value = null

  const rawId = e.dataTransfer?.getData('detalleId')
  if (!rawId) return
  const detalleId = parseInt(rawId, 10)
  if (isNaN(detalleId)) return

  // Find the detalle to compute its span (may be absent for catalog drops)
  const detalle = props.detalles.find((d) => d.detalle_id === detalleId)

  if (detalle) {
    // Repositioning an existing block: validate it fits within bounds
    const span = detalle.periodo_fin_id - detalle.periodo_inicio_id + 1
    const nuevoFin = period.id + span - 1
    if (nuevoFin > maxPeriodId.value) return
  }
  // Catalog items (not yet in grid): emit without span validation

  emit('drop', { detalleId, nuevoPeriodoId: period.id })
}

function onBlockDragStart(e: DragEvent, detalle: HorarioDetalle) {
  e.dataTransfer?.setData('detalleId', detalle.detalle_id.toString())
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="min-w-205">

      <!-- Header row: empty time column + 5 day headers -->
      <div class="grid grid-cols-[56px_repeat(5,minmax(130px,1fr))] xl:grid-cols-[64px_repeat(5,minmax(160px,1fr))] gap-1.5 mb-1.5">
        <!-- Empty corner above time column -->
        <div />
        <!-- Day headers -->
        <div
          v-for="label in DAY_LABELS"
          :key="label"
          class="bg-cics-blue text-white border-2 border-black rounded-lg text-center text-xs font-black uppercase tracking-wider py-1.5"
        >
          {{ label }}
        </div>
      </div>

      <!-- Period rows -->
      <div class="space-y-1.5">
        <div
          v-for="period in periodos"
          :key="period.id"
        >
          <div
            class="grid grid-cols-[56px_repeat(5,minmax(130px,1fr))] xl:grid-cols-[64px_repeat(5,minmax(160px,1fr))] gap-1.5"
            :class="{ 'mt-3': isFirstAfternoon(period) }"
          >
            <!-- Time column -->
            <div class="text-[9px] xl:text-[10px] font-bold text-muted-foreground text-right pr-1 xl:pr-1.5 pt-1 whitespace-pre-line leading-tight">{{ period.hora_inicio.slice(0,5) }}&#10;{{ period.hora_fin.slice(0,5) }}</div>

            <!-- 5 day cells (columns 1–5) -->
            <template v-for="colIndex in [1, 2, 3, 4, 5]" :key="colIndex">
              <!-- Cell occupied by a block starting here -->
              <div
                v-if="getDetalle(colIndex, period.id)"
                class="relative"
                @dragover="catalogMode ? onDragOver($event, colIndex, period.id) : undefined"
                @dragleave="catalogMode ? onDragLeave(colIndex, period.id) : undefined"
                @drop="catalogMode ? onDrop($event, colIndex, period) : undefined"
              >
                <ScheduleBlock
                  :detalle="getDetalle(colIndex, period.id)!"
                  :editable="catalogMode ? false : editable"
                  :readonly="readonly"
                  :show-remove="catalogMode ?? false"
                  :is-conflict="false"
                  :style="{ minHeight: blockHeight(getDetalle(colIndex, period.id)!) + 'px' }"
                  @click="!catalogMode && emit('click-block', getDetalle(colIndex, period.id)!)"
                  @remove="emit('remove-block', getDetalle(colIndex, period.id)!)"
                  @dragstart="!catalogMode && onBlockDragStart($event, getDetalle(colIndex, period.id)!)"
                />
              </div>

              <!-- Cell spanned by a multi-period block that started earlier: render nothing -->
              <div v-else-if="isSpannedOver(colIndex, period.id)" />

              <!-- Empty drop slot -->
              <div
                v-else
                class="border-2 border-dashed border-border rounded-lg min-h-11.5 transition-colors duration-100"
                :class="{
                  'border-cics-primary bg-orange-50 dark:bg-orange-950/20':
                    (editable || catalogMode) && dragOverCell === `${colIndex}-${period.id}`,
                }"
                @dragover="(editable || catalogMode) ? onDragOver($event, colIndex, period.id) : undefined"
                @dragleave="(editable || catalogMode) ? onDragLeave(colIndex, period.id) : undefined"
                @drop="(editable || catalogMode) ? onDrop($event, colIndex, period) : undefined"
              />
            </template>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
