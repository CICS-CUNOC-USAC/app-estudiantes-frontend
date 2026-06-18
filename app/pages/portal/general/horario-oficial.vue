<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Horario Oficial',
  extendScreen: true,
})

const store = useOfficialScheduleStore()

const filtroCarrera = ref<string>('')
const filtroSemestre = ref<string>('')

onMounted(async () => {
  await store.fetchHorariosAction()
  await store.fetchCatalogos()
  if (store.horarioActivo) {
    await store.fetchHorarioAction(store.horarioActivo.id)
  }
})

async function onFiltroCarrera(val: string) {
  filtroCarrera.value = val
  store.setFiltros({ carrera_id: val ? +val : null })
  if (store.horarioActivo) await store.fetchHorarioAction(store.horarioActivo.id)
}

async function onFiltroSemestre(val: string) {
  filtroSemestre.value = val
  store.setFiltros({ semestre: val ? +val : null })
  if (store.horarioActivo) await store.fetchHorarioAction(store.horarioActivo.id)
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-10 pt-6 space-y-6">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 flex-wrap">
        <h1 class="text-xl font-black tracking-tight">Horario Oficial</h1>
        <template v-if="store.horarioActivo">
          <span
            class="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.04em] py-[0.2rem] px-[0.55rem] border-2 border-black rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)] bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            Activo
          </span>
          <span class="text-sm text-muted-foreground font-medium">
            {{ store.horarioActivo.nombre }}
          </span>
        </template>
      </div>
    </div>

    <!-- ── Loading skeleton ───────────────────────────────────────────────── -->
    <template v-if="store.loading">
      <div class="space-y-3 animate-pulse">
        <div class="h-10 rounded-xl bg-muted border-2 border-black" />
        <div class="h-64 rounded-xl bg-muted border-2 border-black" />
      </div>
    </template>

    <template v-else-if="!store.horarioActivo">
      <!-- ── No active schedule ──────────────────────────────────────────── -->
      <div class="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p class="text-base font-semibold text-muted-foreground">
          No hay un horario activo en este momento.
        </p>
      </div>
    </template>

    <template v-else>
      <!-- ── Filters ──────────────────────────────────────────────────────── -->
      <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4">
        <div class="flex flex-wrap items-center gap-3">
          <select
            :value="filtroCarrera"
            class="appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
            @change="onFiltroCarrera(($event.target as HTMLSelectElement).value)"
          >
            <option value="">Todas las carreras</option>
            <option v-for="c in store.carreras" :key="c.id" :value="String(c.id)">
              {{ c.nombre }}
            </option>
          </select>

          <select
            :value="filtroSemestre"
            class="appearance-none bg-card border-2 border-black rounded-[0.625rem] px-2.5 py-1.5 text-sm font-medium shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-cics-primary dark:bg-neutral-800"
            @change="onFiltroSemestre(($event.target as HTMLSelectElement).value)"
          >
            <option value="">Todos los semestres</option>
            <option v-for="n in 10" :key="n" :value="String(n)">Semestre {{ n }}</option>
          </select>
        </div>
      </div>

      <!-- ── Grid ─────────────────────────────────────────────────────────── -->
      <div class="border-2 border-black rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] bg-card p-4 overflow-x-auto">
        <ScheduleGrid
          :detalles="store.detallesFiltrados"
          :periodos="store.periodos"
          :editable="false"
          :readonly="true"
        />
      </div>
    </template>

  </div>
</template>
