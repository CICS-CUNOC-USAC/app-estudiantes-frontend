<script setup lang="ts">
import { Dialog } from '~/components/ui/dialog'

interface ConflictoHorario {
  tipo: string
  descripcion: string
}

defineProps<{
  open: boolean
  conflictos: ConflictoHorario[]
  totalConflictos: number
  aptitud: number | null
  loading: boolean
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Conflictos detectados" closeButton>
      <!-- Summary badge -->
      <div class="mb-4 flex items-center gap-3">
        <span
          v-if="totalConflictos === 0"
          class="inline-flex items-center gap-1.5 rounded-[0.625rem] border-2 border-green-600 bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] dark:bg-green-950/40 dark:text-green-300 dark:border-green-500"
        >
          Sin conflictos ✓
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1.5 rounded-[0.625rem] border-2 border-red-600 bg-red-100 px-3 py-1 text-sm font-semibold text-red-800 shadow-[2px_2px_0_0_rgba(0,0,0,0.8)] dark:bg-red-950/40 dark:text-red-300 dark:border-red-500"
        >
          {{ totalConflictos }} conflicto{{ totalConflictos !== 1 ? 's' : '' }}
        </span>

        <span
          v-if="aptitud !== null"
          class="inline-flex items-center gap-1 text-xs text-muted-foreground"
        >
          Aptitud: <strong class="text-foreground">{{ aptitud.toFixed(2) }}</strong>
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="space-y-2">
        <div
          v-for="i in 3"
          :key="i"
          class="h-12 animate-pulse rounded-lg border-2 border-black/10 bg-muted"
        />
      </div>

      <!-- No conflicts -->
      <p
        v-else-if="conflictos.length === 0"
        class="text-muted-foreground text-sm"
      >
        No se detectaron conflictos en este horario.
      </p>

      <!-- Conflict list -->
      <ul v-else class="space-y-2 max-h-72 overflow-y-auto pr-1">
        <li
          v-for="(c, idx) in conflictos"
          :key="idx"
          class="border-2 border-red-400 rounded-lg p-3 text-sm bg-red-50 dark:bg-red-950/20"
        >
          <div class="flex items-start gap-2">
            <span class="text-base leading-none mt-0.5">⚠</span>
            <div>
              <p class="font-semibold text-red-800 dark:text-red-300">{{ c.tipo }}</p>
              <p class="text-red-700 dark:text-red-400 mt-0.5">{{ c.descripcion }}</p>
            </div>
          </div>
        </li>
      </ul>

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
    </DialogContent>
  </Dialog>
</template>
