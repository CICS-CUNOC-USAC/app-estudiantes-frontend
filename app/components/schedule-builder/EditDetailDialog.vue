<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog } from '~/components/ui/dialog'

interface Period {
  id: number
  hora_inicio: string
  hora_fin: string
  es_manana: boolean
  es_tarde: boolean
}

interface Teacher {
  id: number
  nombre: string
}

interface Salon {
  id: number
  nombre: string
  es_laboratorio: boolean
}

interface HorarioDetalle {
  detalle_id: number
  curso_nombre: string
  seccion_letra: string | null
  salon_id: number | null
  docente_id: number | null
  periodo_inicio_id: number
  periodo_fin_id: number
  dia_horario_id: number
  es_laboratorio: boolean
  [key: string]: unknown
}

const props = defineProps<{
  open: boolean
  detalle: HorarioDetalle | null
  salones: Salon[]
  docentes: Teacher[]
  periodos: Period[]
  loading: boolean
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'save': [cambios: {
    salon_id: number | null
    docente_id: number | null
    periodo_inicio_id: number
    periodo_fin_id: number
    dia_horario_id: number
  }]
}>()

const form = ref({
  salon_id: null as number | null,
  docente_id: null as number | null,
  periodo_inicio_id: 0,
  periodo_fin_id: 0,
  dia_horario_id: 1,
})

watch(
  () => props.detalle,
  (d) => {
    if (d) {
      form.value = {
        salon_id: d.salon_id,
        docente_id: d.docente_id,
        periodo_inicio_id: d.periodo_inicio_id,
        periodo_fin_id: d.periodo_fin_id,
        dia_horario_id: d.es_laboratorio ? 2 : d.dia_horario_id,
      }
    }
  },
  { immediate: true }
)

const diaChanged = computed(
  () => props.detalle !== null && form.value.dia_horario_id !== props.detalle.dia_horario_id
)

const selectClass =
  'appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] w-full focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800'

const labelClass = 'block text-xs font-semibold mb-1'

function handleSave() {
  emit('save', { ...form.value })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Editar bloque" closeButton>
      <!-- Subtitle -->
      <p v-if="detalle" class="text-sm text-muted-foreground -mt-2 mb-4">
        {{ detalle.curso_nombre }}
        <span v-if="detalle.seccion_letra"> · Sección {{ detalle.seccion_letra }}</span>
      </p>

      <div class="space-y-4">
        <!-- Salón -->
        <div>
          <label :class="labelClass">Salón</label>
          <select
            v-model.number="form.salon_id"
            :class="selectClass"
          >
            <option :value="null">— Sin salón —</option>
            <option
              v-for="s in salones"
              :key="s.id"
              :value="s.id"
            >
              {{ s.es_laboratorio ? '[Lab] ' : '' }}{{ s.nombre }}
            </option>
          </select>
        </div>

        <!-- Docente -->
        <div>
          <label :class="labelClass">Docente</label>
          <select
            v-model.number="form.docente_id"
            :class="selectClass"
          >
            <option :value="null">— Sin docente —</option>
            <option
              v-for="d in docentes"
              :key="d.id"
              :value="d.id"
            >
              {{ d.nombre }}
            </option>
          </select>
        </div>

        <!-- Periodo inicio -->
        <div>
          <label :class="labelClass">Periodo inicio</label>
          <select
            v-model.number="form.periodo_inicio_id"
            :class="selectClass"
          >
            <option
              v-for="p in periodos"
              :key="p.id"
              :value="p.id"
            >
              {{ p.hora_inicio }} – {{ p.hora_fin }}
            </option>
          </select>
        </div>

        <!-- Periodo fin -->
        <div>
          <label :class="labelClass">Periodo fin</label>
          <select
            v-model.number="form.periodo_fin_id"
            :class="selectClass"
          >
            <option
              v-for="p in periodos"
              :key="p.id"
              :value="p.id"
            >
              {{ p.hora_inicio }} – {{ p.hora_fin }}
            </option>
          </select>
        </div>

        <!-- Patrón de días -->
        <div>
          <label :class="labelClass">Patrón de días</label>
          <select
            v-model.number="form.dia_horario_id"
            :class="selectClass"
            :disabled="detalle?.es_laboratorio"
          >
            <option :value="1">Lunes, Miércoles y Viernes</option>
            <option :value="2">Martes y Jueves (lab)</option>
          </select>
          <p v-if="detalle?.es_laboratorio" class="mt-1 text-xs text-muted-foreground">
            Los laboratorios siempre usan Martes y Jueves.
          </p>
        </div>

        <!-- Warning badge on dia change -->
        <div
          v-if="diaChanged"
          class="flex items-start gap-2 rounded-[0.625rem] border-2 border-yellow-500 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800 shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-600"
        >
          <span>⚠</span>
          <span>Cambiar el patrón de días puede generar conflictos</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 flex justify-end gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm cursor-pointer bg-card text-foreground shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px"
          @click="emit('update:open', false)"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 border-2 border-black rounded-[0.625rem] font-semibold text-sm cursor-pointer bg-cics-primary text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] px-3 py-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:-translate-x-px hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          :disabled="loading"
          @click="handleSave"
        >
          <span v-if="loading" class="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Guardar cambio
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
