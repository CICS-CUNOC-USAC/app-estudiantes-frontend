<script setup lang="ts">
import { ref } from 'vue'

interface HorarioDetalle {
  detalle_id: number
  dia_horario_id: number
  periodo_inicio_id: number
  periodo_fin_id: number
  es_laboratorio: boolean
  modificado_manual: boolean
  seccion_id: number | null
  seccion_lab_id: number | null
  curso_nombre?: string
  seccion_letra?: string
  salon_nombre?: string
  docente_nombre?: string
  semestre?: number | string
}

const props = defineProps<{
  detalle: HorarioDetalle
  editable: boolean
  readonly: boolean
  showRemove: boolean
  isConflict: boolean
}>()

const emit = defineEmits<{
  'click': []
  'remove': []
  'dragstart': [e: DragEvent]
}>()

const dragging = ref(false)

function onDragStart(e: DragEvent) {
  dragging.value = true
  emit('dragstart', e)
}

function onDragEnd() {
  dragging.value = false
}

function onClick() {
  if (!props.readonly) {
    emit('click')
  }
}
</script>

<template>
  <div
    :draggable="editable"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @click="onClick"
    class="border-2 border-black rounded-[0.6rem] p-1.5 select-none relative shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all duration-100"
    :class="[
      detalle.es_laboratorio
        ? 'bg-cyan-200 dark:bg-cyan-900'
        : 'bg-white dark:bg-neutral-800',
      editable
        ? 'cursor-grab hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]'
        : '',
      detalle.modificado_manual
        ? 'outline outline-2 outline-dashed outline-cics-primary outline-offset-1'
        : '',
      isConflict
        ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.5),2px_2px_0_0_rgba(0,0,0,1)] animate-pulse'
        : '',
      dragging ? 'opacity-40' : '',
    ]"
  >
    <!-- X Remove button -->
    <button
      v-if="showRemove"
      @click.stop="emit('remove')"
      class="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full border-2 border-black bg-red-500 text-white text-[11px] flex items-center justify-center cursor-pointer z-10"
    >
      ×
    </button>

    <!-- Row 1: course name + section badge -->
    <div class="flex items-start justify-between gap-1">
      <span class="text-[11px] font-black leading-tight text-foreground flex-1 min-w-0 truncate">
        {{ detalle.curso_nombre ?? '—' }}
      </span>
      <span
        v-if="detalle.seccion_letra"
        class="text-[9px] border border-black/40 rounded px-1 text-foreground shrink-0 leading-tight"
      >
        {{ detalle.seccion_letra }}
      </span>
    </div>

    <!-- Row 2: room · teacher -->
    <div class="text-[9px] opacity-70 mt-0.5 text-foreground truncate">
      {{ [detalle.salon_nombre, detalle.docente_nombre].filter(Boolean).join(' · ') || '—' }}
    </div>

    <!-- Row 3: type · semester -->
    <div class="text-[8px] uppercase font-bold tracking-wide opacity-60 text-foreground mt-0.5">
      {{ detalle.es_laboratorio ? 'Lab' : 'Teórica' }}
      <span v-if="detalle.semestre"> · S{{ detalle.semestre }}</span>
    </div>
  </div>
</template>
