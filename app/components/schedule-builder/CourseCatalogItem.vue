<script setup lang="ts">
interface HorarioDetalle {
  detalle_id: number
  curso_nombre: string
  curso_codigo: string
  semestre: number
  seccion_letra: string | null
  salon_nombre: string | null
  docente_nombre: string | null
  hora_inicio: string
  hora_fin: string
  dias_nombre: string
  es_laboratorio: boolean
  seccion_id: number | null
  seccion_lab_id: number | null
  dia_horario_id: number
  periodo_inicio_id: number
  periodo_fin_id: number
}

const props = defineProps<{
  detalle: HorarioDetalle
  added: boolean
  pending?: boolean
}>()

const emit = defineEmits<{
  add: []
  remove: []
}>()

function onDragStart(e: DragEvent) {
  if (props.added) return
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
  e.dataTransfer?.setData('detalleId', props.detalle.detalle_id.toString())
  e.dataTransfer?.setData('detalle', JSON.stringify(props.detalle))
}

function formatHour(h: string | null | undefined) {
  // Con datos reales la hora puede venir null (LEFT JOIN a periodos en el backend);
  // sin este guard, un solo detalle sin hora tira toda la vista de Mi Horario.
  if (!h) return '—'
  // trim seconds if present: "13:40:00" → "13:40"
  return h.length > 5 ? h.slice(0, 5) : h
}
</script>

<template>
  <div
    :draggable="!added"
    :class="[
      'border-2 border-black rounded-[0.6rem] p-2.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] select-none transition-transform',
      added
        ? 'opacity-50 bg-card cursor-default'
        : [
            'bg-card cursor-grab',
            detalle.es_laboratorio
              ? 'bg-cyan-200 dark:bg-cyan-900'
              : '',
            'hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]',
          ],
    ]"
    @dragstart="onDragStart"
  >
    <div class="flex items-start gap-2">
      <!-- Main content -->
      <div class="min-w-0 flex-1 space-y-0.5">
        <!-- Row 1: course name + section badge + lab badge -->
        <div class="flex flex-wrap items-center gap-1">
          <span class="text-xs font-black leading-tight truncate max-w-[12rem]">
            {{ detalle.curso_nombre }}
          </span>
          <span
            v-if="detalle.seccion_letra"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-yellow-100 dark:bg-yellow-900"
          >
            Sec {{ detalle.seccion_letra }}
          </span>
          <span
            v-if="detalle.es_laboratorio"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-cyan-200 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-100"
          >
            Lab
          </span>
          <span
            v-if="pending && !added"
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-cics-primary text-white"
          >
            Pendiente
          </span>
        </div>

        <!-- Row 2: time + days -->
        <p class="text-[10px] text-muted-foreground leading-tight">
          {{ formatHour(detalle.hora_inicio) }}–{{ formatHour(detalle.hora_fin) }} · {{ detalle.dias_nombre }}
        </p>

        <!-- Row 3: classroom + teacher -->
        <p class="text-[10px] text-muted-foreground leading-tight">
          <template v-if="detalle.salon_nombre">{{ detalle.salon_nombre }}</template>
          <template v-if="detalle.salon_nombre && detalle.docente_nombre"> · </template>
          <template v-if="detalle.docente_nombre">{{ detalle.docente_nombre }}</template>
          <template v-if="!detalle.salon_nombre && !detalle.docente_nombre">—</template>
        </p>
      </div>

      <!-- Action button -->
      <button
        v-if="added"
        type="button"
        class="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-white font-black text-sm bg-red-500 hover:bg-red-600 shrink-0 shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px transition-transform"
        aria-label="Quitar curso"
        @click.stop="emit('remove')"
      >
        −
      </button>
      <button
        v-else
        type="button"
        class="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-white font-black text-sm bg-green-500 hover:bg-green-600 shrink-0 shadow-[1px_1px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px transition-transform"
        aria-label="Agregar curso"
        @click.stop="emit('add')"
      >
        +
      </button>
    </div>
  </div>
</template>
