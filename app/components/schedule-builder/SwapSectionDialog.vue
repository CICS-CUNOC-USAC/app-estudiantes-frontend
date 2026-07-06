<script setup lang="ts">
import { computed } from 'vue'
import { Dialog } from '~/components/ui/dialog'
import type { HorarioDetalle } from '~/lib/api/schedules-generator/types'

const props = defineProps<{
  open: boolean
  actual: HorarioDetalle | null
  alternativas: HorarioDetalle[]
  // detalle_id de alternativas que chocarían con el resto de la selección
  conflictivas: number[]
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'swap': [nueva: HorarioDetalle]
  'remove': []
  'restaurar': []
}>()

const conflictSet = computed(() => new Set(props.conflictivas))

function formatHour(h: string | null | undefined) {
  // La hora puede venir null desde el backend (LEFT JOIN a periodos)
  if (!h) return '—'
  return h.length > 5 ? h.slice(0, 5) : h
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Cambiar de sección" closeButton>
      <template v-if="actual">
        <!-- Sección actual -->
        <div class="mb-4 border-2 border-black rounded-[0.625rem] bg-muted p-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
          <p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Sección actual</p>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-black">{{ actual.curso_nombre }}</span>
            <span
              v-if="actual.seccion_letra"
              class="inline-flex items-center text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-yellow-100 dark:bg-yellow-900"
            >
              Sec {{ actual.seccion_letra }}
            </span>
            <span
              v-if="actual.es_laboratorio"
              class="inline-flex items-center text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-cyan-200 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-100"
            >
              Lab
            </span>
            <span
              v-if="actual.modificado_manual"
              class="inline-flex items-center text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200"
            >
              Movido por ti
            </span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            {{ formatHour(actual.hora_inicio) }}–{{ formatHour(actual.hora_fin) }} · {{ actual.dias_nombre }}
            <template v-if="actual.docente_nombre"> · {{ actual.docente_nombre }}</template>
          </p>
          <p v-if="actual.modificado_manual" class="text-[10px] text-orange-700 dark:text-orange-300 mt-1">
            Este horario ya no es el oficial de la sección; solo es tu referencia personal.
          </p>
        </div>

        <!-- Alternativas -->
        <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Otras secciones disponibles
        </p>

        <p v-if="alternativas.length === 0" class="text-sm text-muted-foreground py-4 text-center">
          Este curso no tiene otras secciones{{ actual.es_laboratorio ? ' de laboratorio' : '' }}.
        </p>

        <div v-else class="space-y-2 max-h-72 overflow-y-auto pr-1">
          <button
            v-for="alt in alternativas"
            :key="alt.detalle_id"
            type="button"
            class="w-full text-left border-2 border-black rounded-[0.625rem] p-3 bg-card shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            :class="conflictSet.has(alt.detalle_id) ? 'border-red-500' : ''"
            @click="emit('swap', alt)"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex flex-wrap items-center gap-2 min-w-0">
                <span
                  v-if="alt.seccion_letra"
                  class="inline-flex items-center text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-yellow-100 dark:bg-yellow-900"
                >
                  Sec {{ alt.seccion_letra }}
                </span>
                <span class="text-xs font-semibold truncate">
                  {{ formatHour(alt.hora_inicio) }}–{{ formatHour(alt.hora_fin) }} · {{ alt.dias_nombre }}
                </span>
              </div>
              <span
                v-if="conflictSet.has(alt.detalle_id)"
                class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 shrink-0"
              >
                <Icon name="lucide:triangle-alert" class="size-3" />
                Choca
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 shrink-0"
              >
                <Icon name="lucide:check" class="size-3" />
                Libre
              </span>
            </div>
            <p class="text-[11px] text-muted-foreground mt-1 truncate">
              {{ [alt.salon_nombre, alt.docente_nombre].filter(Boolean).join(' · ') || '—' }}
            </p>
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-3 border-t-2 border-dashed border-border flex flex-wrap justify-between gap-2">
          <div class="flex flex-wrap gap-2">
            <Button variant="tonal" severity="danger" size="sm" icon="lucide:trash-2" @click="emit('remove')">
              Quitar del horario
            </Button>
            <Button
              v-if="actual.modificado_manual"
              variant="tonal"
              size="sm"
              icon="lucide:rotate-ccw"
              @click="emit('restaurar')"
            >
              Volver a horario oficial
            </Button>
          </div>
          <Button variant="tonal" size="sm" @click="emit('update:open', false)">
            Cerrar
          </Button>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>
