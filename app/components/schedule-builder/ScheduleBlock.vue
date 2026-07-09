<script setup lang="ts">
import { ref, computed } from 'vue'

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
  seccion_letra?: string | null
  salon_nombre?: string | null
  docente_nombre?: string | null
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
  'dragend': [e: DragEvent]
}>()

const dragging = ref(false)

// Codificación por color por semestre (paleta fija, con dark:)
const SEMESTRE_COLORS = [
  'bg-orange-500 dark:bg-orange-400',
  'bg-sky-500 dark:bg-sky-400',
  'bg-emerald-500 dark:bg-emerald-400',
  'bg-violet-500 dark:bg-violet-400',
  'bg-rose-500 dark:bg-rose-400',
  'bg-amber-500 dark:bg-amber-400',
  'bg-teal-500 dark:bg-teal-400',
  'bg-fuchsia-500 dark:bg-fuchsia-400',
]

const semestreColor = computed(() => {
  const s = Number(props.detalle.semestre)
  if (!Number.isFinite(s) || s <= 0) return 'bg-neutral-400 dark:bg-neutral-500'
  return SEMESTRE_COLORS[(s - 1) % SEMESTRE_COLORS.length]
})

function onDragStart(e: DragEvent) {
  dragging.value = true
  emit('dragstart', e)
}

function onDragEnd(e: DragEvent) {
  dragging.value = false
  emit('dragend', e)
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
      // Estático (sin animate-pulse): el parpadeo continuo resultaba muy invasivo
      // con varios conflictos en pantalla a la vez; el borde+ring ya es visible.
      isConflict
        ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.5),2px_2px_0_0_rgba(0,0,0,1)]'
        : '',
      dragging ? 'opacity-40 rotate-1 scale-95' : '',
    ]"
  >
    <!-- Barra lateral de color por semestre -->
    <span
      class="absolute left-0 top-0 bottom-0 w-1 rounded-l-[0.45rem]"
      :class="semestreColor"
    />
    <!-- X Remove button -->
    <button
      v-if="showRemove"
      @click.stop="emit('remove')"
      class="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full border-2 border-black bg-red-500 text-white text-[11px] flex items-center justify-center cursor-pointer z-10"
    >
      ×
    </button>

    <!-- Row 1: course name + section badge -->
    <div class="flex items-start justify-between gap-1 pl-1">
      <span
        class="text-[11px] font-black leading-tight text-foreground flex-1 min-w-0 truncate"
        :title="String(detalle.curso_nombre ?? '')"
      >
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
    <div
      class="text-[9px] text-muted-foreground mt-0.5 truncate pl-1"
      :title="[detalle.salon_nombre, detalle.docente_nombre].filter(Boolean).join(' · ')"
    >
      {{ [detalle.salon_nombre, detalle.docente_nombre].filter(Boolean).join(' · ') || '—' }}
    </div>

    <!-- Row 3: type · semester -->
    <div class="text-[8px] uppercase font-bold tracking-wide opacity-60 text-foreground mt-0.5 pl-1">
      {{ detalle.es_laboratorio ? 'Lab' : 'Teórica' }}
      <span v-if="detalle.semestre"> · S{{ detalle.semestre }}</span>
    </div>
  </div>
</template>
