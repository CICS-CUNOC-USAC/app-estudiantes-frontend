<script setup lang="ts">
defineProps<{
  stats: {
    cursosAprobados: number
    cursosTotales: number
    creditosGanados: number
    creditosCarrera: number
    creditosObligatoriosGanados: number
    creditosObligatoriosCarrera: number
    pctAvanceObligatorios: number
    pctAvance: number
    creditosDisponibles: number
  }
  conflictosCount: number
  resumenCursos: number
  resumenJornada: {
    horasLibres: number
    jornada: 'mañana' | 'tarde' | 'mixta' | null
  }
}>()

const emit = defineEmits<{
  'ver-conflictos': []
}>()
</script>

<template>
  <div class="border border-black rounded-xl  bg-card p-4 space-y-3 print:hidden">
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <h2 class="text-sm font-black flex items-center gap-1.5">
        <Icon name="lucide:graduation-cap" class="size-4 text-cics-primary" />
        Mi avance
      </h2>
      <Button variant="tonal" size="sm" icon="lucide:trending-up" to="/dashboard/pensum/progress">
        Ver mi progreso
      </Button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
      <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
        <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
          {{ stats.cursosAprobados }}<span class="text-sm text-muted-foreground">/{{ stats.cursosTotales }}</span>
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Cursos aprobados</div>
      </div>
      <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
        <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
          {{ stats.creditosGanados }}<span class="text-sm text-muted-foreground">/{{ stats.creditosCarrera }}</span>
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos ganados</div>
      </div>
      <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
        <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
          {{ stats.creditosObligatoriosGanados }}<span class="text-sm text-muted-foreground">/{{ stats.creditosObligatoriosCarrera }}</span>
        </div>
        <div class="relative h-1.5 mt-1.5 rounded-full border border-black overflow-hidden bg-card">
          <div
            class="absolute inset-y-0 left-0 bg-cics-blue transition-all"
            :style="{ width: stats.pctAvanceObligatorios + '%' }"
          />
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Avance obligatorios ({{ stats.pctAvanceObligatorios }}%)</div>
      </div>
      <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
        <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
          {{ stats.pctAvance }}%
        </div>
        <div class="relative h-1.5 mt-1.5 rounded-full border border-black overflow-hidden bg-card">
          <div
            class="absolute inset-y-0 left-0 bg-cics-primary transition-all"
            :style="{ width: stats.pctAvance + '%' }"
          />
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Avance de carrera</div>
      </div>
      <div class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
        <div class="text-xl font-extrabold tabular-nums leading-none text-foreground">
          {{ stats.creditosDisponibles }}
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Créditos disponibles</div>
      </div>
      <button
        type="button"
        class="bg-muted border border-black dark:border-surface-600 rounded-lg p-2.5 text-center cursor-pointer hover:brightness-95 active:translate-y-px transition"
        :disabled="conflictosCount === 0"
        :class="{ 'cursor-default hover:brightness-100 active:translate-y-0': conflictosCount === 0 }"
        @click="emit('ver-conflictos')"
      >
        <div
          class="text-xl font-extrabold tabular-nums leading-none"
          :class="conflictosCount > 0 ? 'text-red-500' : 'text-green-600 dark:text-green-400'"
        >
          {{ conflictosCount }}
        </div>
        <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflictos</div>
      </button>
    </div>

    <!-- Avisos de carga del ciclo y jornada -->
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      <span v-if="resumenCursos > 0">
        {{ resumenCursos }} curso{{ resumenCursos !== 1 ? 's' : '' }} este ciclo
      </span>
      <span v-if="resumenJornada.jornada === 'mañana' || resumenJornada.jornada === 'tarde'">
        Tu horario es mayormente de {{ resumenJornada.jornada }}
      </span>
      <span v-else-if="resumenJornada.jornada === 'mixta'">
        Tu horario combina mañana y tarde
      </span>
      <span v-if="resumenJornada.horasLibres > 0">
        Tienes {{ resumenJornada.horasLibres }} periodo{{ resumenJornada.horasLibres !== 1 ? 's' : '' }} libre{{ resumenJornada.horasLibres !== 1 ? 's' : '' }} entre clases
      </span>
    </div>
  </div>
</template>
