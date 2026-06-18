<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog } from '~/components/ui/dialog'

interface CursoCatalogo {
  codigo: string
  nombre: string
  semestre: number
}

const props = defineProps<{
  open: boolean
  cursosCatalogo: CursoCatalogo[]
  cursosPreseleccionados: string[]
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'armar': [payload: { cursos: string[]; jornada: 'manana' | 'tarde' | 'ambas' }]
}>()

const cursosSeleccionados = ref<string[]>([])
const jornada = ref<'manana' | 'tarde' | 'ambas'>('ambas')

// Re-initialise when the dialog opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      cursosSeleccionados.value = [...props.cursosPreseleccionados]
      jornada.value = 'ambas'
    }
  }
)

// Groups for rendering
const semestreGroups = computed(() => {
  const map = new Map<number, CursoCatalogo[]>()
  for (const c of props.cursosCatalogo) {
    if (!map.has(c.semestre)) map.set(c.semestre, [])
    map.get(c.semestre)!.push(c)
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0])
})

function toggleCurso(codigo: string) {
  const idx = cursosSeleccionados.value.indexOf(codigo)
  if (idx === -1) {
    cursosSeleccionados.value.push(codigo)
  } else {
    cursosSeleccionados.value.splice(idx, 1)
  }
}

function seleccionarTodos() {
  cursosSeleccionados.value = props.cursosCatalogo.map((c) => c.codigo)
}

function deseleccionarTodos() {
  cursosSeleccionados.value = []
}

function handleArmar() {
  emit('armar', {
    cursos: [...cursosSeleccionados.value],
    jornada: jornada.value,
  })
}

type Jornada = 'manana' | 'tarde' | 'ambas'

const jornadaOptions: { value: Jornada; label: string }[] = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'ambas', label: 'Ambas' },
]
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Armar automáticamente" closeButton>
      <!-- Explanation -->
      <p class="text-sm text-muted-foreground -mt-2 mb-5 leading-relaxed">
        Selecciona los cursos que quieres incluir y la jornada preferida. El asistente elegirá las
        secciones sin choques de horario.
      </p>

      <!-- Jornada toggle -->
      <div class="mb-5">
        <p class="text-xs font-semibold mb-2">Jornada preferida</p>
        <div class="flex gap-2">
          <button
            v-for="opt in jornadaOptions"
            :key="opt.value"
            type="button"
            class="flex-1 rounded-[0.625rem] border-2 border-black py-1.5 text-sm font-semibold transition-all cursor-pointer"
            :class="
              jornada === opt.value
                ? 'bg-cics-primary text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] translate-x-0 translate-y-0'
                : 'bg-card text-foreground shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:bg-neutral-800'
            "
            @click="jornada = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold">Cursos a incluir</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="text-xs font-medium text-cics-primary underline-offset-2 hover:underline cursor-pointer"
            @click="seleccionarTodos"
          >
            Seleccionar todos
          </button>
          <span class="text-muted-foreground text-xs">/</span>
          <button
            type="button"
            class="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline cursor-pointer"
            @click="deseleccionarTodos"
          >
            Deseleccionar todos
          </button>
        </div>
      </div>

      <!-- Course list grouped by semestre -->
      <div class="max-h-64 overflow-y-auto space-y-4 pr-1 border-2 border-black rounded-[0.625rem] p-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-card dark:bg-neutral-800">
        <div
          v-for="[sem, cursos] in semestreGroups"
          :key="sem"
        >
          <p class="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Semestre {{ sem }}
          </p>
          <ul class="space-y-1">
            <li
              v-for="curso in cursos"
              :key="curso.codigo"
            >
              <label class="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  :value="curso.codigo"
                  :checked="cursosSeleccionados.includes(curso.codigo)"
                  class="size-4 rounded border-2 border-black accent-cics-primary cursor-pointer"
                  @change="toggleCurso(curso.codigo)"
                />
                <span class="text-sm font-medium leading-tight">
                  <span class="text-muted-foreground text-xs mr-1">{{ curso.codigo }}</span>
                  {{ curso.nombre }}
                </span>
              </label>
            </li>
          </ul>
        </div>

        <p
          v-if="cursosCatalogo.length === 0"
          class="text-sm text-muted-foreground text-center py-4"
        >
          No hay cursos disponibles.
        </p>
      </div>

      <!-- Selected count hint -->
      <p class="mt-2 text-xs text-muted-foreground">
        {{ cursosSeleccionados.length }} de {{ cursosCatalogo.length }} seleccionados
      </p>

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
          :disabled="cursosSeleccionados.length === 0"
          @click="handleArmar"
        >
          Armar horario
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
