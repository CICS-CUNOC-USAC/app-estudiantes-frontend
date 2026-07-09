<script setup lang="ts">
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
  curso_nombre: string
  seccion_letra: string | null
  seccion_id: number | null
  seccion_lab_id: number | null
  salon_id: number | null
  salon_nombre: string | null
  salon_es_laboratorio: boolean | null
  docente_id: number | null
  periodo_inicio_id: number
  periodo_fin_id: number
  dia_horario_id: number
  es_laboratorio: boolean
  modificado_manual: boolean
  [key: string]: unknown
}

defineProps<{
  open: boolean
  detalles: HorarioDetalle[]
  periodos: Period[]
  horarioNombre: string
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-950/50 backdrop-blur-sm"
          @click="emit('update:open', false)"
        />

        <!-- Panel -->
        <div
          class="relative bg-card border-2 border-black rounded-xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] w-11/12 max-w-5xl max-h-[90vh] overflow-auto p-6 dark:bg-neutral-900"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-1">
            <div>
              <h2 class="text-xl font-semibold">Horario propuesto</h2>
              <p class="text-sm text-muted-foreground mt-0.5">{{ horarioNombre }}</p>
            </div>
            <button
              type="button"
              class="ml-4 flex-shrink-0 rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Cerrar"
              @click="emit('update:open', false)"
            >
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <!-- Room grid: the proposed schedule has several sections at the same
               hour (different rooms); the weekly grid would only show one -->
          <div class="mt-4">
            <RoomScheduleGrid
              :editable="false"
              :readonly="true"
              :detalles="detalles"
              :periodos="periodos"
            />
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm cursor-pointer bg-card text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
              @click="emit('update:open', false)"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
