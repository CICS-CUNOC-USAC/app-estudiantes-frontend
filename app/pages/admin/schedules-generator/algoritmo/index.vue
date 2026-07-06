<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { AlgoritmoConfig, EjecutarBody } from '~/lib/api/schedules-generator/types'
import { ejecutar } from '~/lib/api/schedules-generator/algoritmo'
import { fetchHorarios } from '~/lib/api/schedules-generator/horarios'

definePageMeta({
  layout: 'admin',
  title: 'Algoritmo Genético',
  subject: ['all'],
  action: ['manage'],
})

const store = useAlgorithmRunnerStore()
const { connected, lastEvent, connect, disconnect } = useAlgoritmoWs()
const router = useRouter()

// ── Form ──
const form = reactive<Partial<AlgoritmoConfig>>({})
const nombreHorario = ref('')
const timeOpen = ref(false)
const chartRef = ref<{ downloadPNG: () => void } | null>(null)

watch(
  () => store.config,
  (c) => { if (c) Object.assign(form, c) },
  { immediate: true },
)

// ── WS events → store ──
watch(lastEvent, (ev) => { if (ev) store.applyWsEvent(ev) })

// ── Auto-disconnect when algorithm finishes / errors ──
watch(
  () => store.estado?.corriendo,
  (running) => {
    if (running === false && connected.value) disconnect()
  },
)

// ── Init ──
onMounted(async () => {
  await store.fetchConfig()
  await store.fetchEstado()
  if (store.isRunning) connect()
})

// ── Validation ──
const errors = computed(() => {
  const e: Record<string, string> = {}
  const tp = Number(form.tamano_poblacion)
  const mg = Number(form.max_generaciones)
  const tm = Number(form.tasa_mutacion)
  if (isNaN(tp) || tp < 10 || tp > 500)    e.tamano_poblacion  = '10 – 500'
  if (isNaN(mg) || mg < 10 || mg > 2000)   e.max_generaciones  = '10 – 2 000'
  if (isNaN(tm) || tm < 0 || tm > 1)       e.tasa_mutacion     = '0.00 – 1.00'
  const ao = form.aptitud_objetivo
  if (ao !== null && ao !== undefined && String(ao) !== '') {
    const n = Number(ao)
    if (isNaN(n) || n < 0 || n > 100) e.aptitud_objetivo = '0 – 100'
  }
  return e
})
const isValid = computed(() => Object.keys(errors.value).length === 0)

// ── Actions ──
async function onSave() {
  if (!isValid.value) return
  const ao = form.aptitud_objetivo
  await store.saveConfig({
    ...form,
    tamano_poblacion: Number(form.tamano_poblacion),
    max_generaciones: Number(form.max_generaciones),
    aptitud_objetivo: ao !== null && ao !== undefined && String(ao) !== '' ? Number(ao) : null,
    tasa_mutacion: Number(form.tasa_mutacion),
    duracion_periodo: Number(form.duracion_periodo),
  })
}

async function onEjecutar() {
  if (store.isRunning) return
  store.$patch({ historial: [], estado: null, saveSuccess: false })
  connect()
  const unwatch = watch(connected, async (c) => {
    if (!c) return
    unwatch()
    const body: EjecutarBody = {}
    if (nombreHorario.value)                        body.nombre          = nombreHorario.value
    if (form.tamano_poblacion)                      body.tamano_poblacion = Number(form.tamano_poblacion)
    if (form.max_generaciones)                      body.max_generaciones = Number(form.max_generaciones)
    if (form.tasa_mutacion !== undefined)           body.tasa_mutacion    = Number(form.tasa_mutacion)
    const ao = form.aptitud_objetivo
    if (ao !== null && ao !== undefined && String(ao) !== '') body.aptitud_objetivo = Number(ao)
    if (form.metodo_seleccion)                      body.metodo_seleccion = form.metodo_seleccion as AlgoritmoConfig['metodo_seleccion']
    if (form.metodo_cruce)                          body.metodo_cruce     = form.metodo_cruce as AlgoritmoConfig['metodo_cruce']
    if (form.metodo_mutacion)                       body.metodo_mutacion  = form.metodo_mutacion as AlgoritmoConfig['metodo_mutacion']
    try { await ejecutar(body) } catch { /* WS error event handles this */ }
  })
}

function onDetener() {
  disconnect()
  if (store.estado) store.estado.corriendo = false
}

function onReloadConfig() {
  store.saveSuccess = false
  store.error = null
  store.fetchConfig()
}

const historialLoading = ref(false)

async function onLoadHistorial() {
  if (historialLoading.value) return
  historialLoading.value = true
  try {
    // Sin ejecución en esta sesión, se carga el historial del horario más reciente
    let id = store.currentHorarioId
    if (!id) {
      const lista = await fetchHorarios()   // la API los devuelve del más nuevo al más viejo
      id = lista[0]?.id ?? null
    }
    if (!id) {
      toast.warning('Aún no hay horarios generados; ejecuta el algoritmo primero.')
      return
    }
    await store.fetchHistorial(id)
    if (store.historial.length > 0) {
      toast.success(`Historial del horario #${id} cargado (${store.historial.length} generaciones).`)
    }
    else {
      toast.info(`El horario #${id} no tiene historial de generaciones guardado.`)
    }
  }
  finally {
    historialLoading.value = false
  }
}

function onClearChart() {
  store.$patch({ historial: [] })
}

// ── Derived UI ──
const badgeState = computed(() => {
  if (store.estado?.error)    return 'error'
  if (store.isRunning)        return 'running'
  if (store.currentHorarioId) return 'done'
  return 'idle'
})

const progressPct = computed(() => {
  if (!store.estado?.generacion || !form.max_generaciones) return 0
  return Math.min(100, (store.estado.generacion / Number(form.max_generaciones)) * 100)
})

const conflictoColor = computed(() => {
  const c = store.estado?.conflictos
  if (c === null || c === undefined) return ''
  return c === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'
})

// ── Select items ──
const seleccionItems = [
  { label: 'Torneo', value: 'torneo' },
  { label: 'Ruleta', value: 'ruleta' },
]
const cruceItems = [
  { label: 'Un Punto', value: 'un_punto' },
  { label: 'Multipunto', value: 'multipunto' },
]
const mutacionItems = [
  { label: 'Intercambio', value: 'intercambio' },
  { label: 'Reiserción', value: 'reisercion' },
]
</script>

<template>
  <div class="flex flex-col gap-6">

    <!-- ── Page title ── -->
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-bold font-heading text-foreground">Algoritmo Genético</h1>
        <p class="text-sm mt-1 text-muted-foreground">
          Configura parámetros, ejecuta el scheduler y monitorea la evolución en tiempo real.
        </p>
      </div>

      <!-- Global status badge -->
      <div class="pt-1">
        <span
          :class="[
            'inline-flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-widest py-1 px-3 border-2 rounded-full',
            'shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]',
            badgeState === 'idle'    && 'bg-surface-100 dark:bg-surface-800 text-muted-foreground border-black dark:border-surface-600',
            badgeState === 'running' && 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-black dark:border-surface-600',
            badgeState === 'done'    && 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-black dark:border-surface-600',
            badgeState === 'error'   && 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-black dark:border-surface-600',
          ]"
        >
          <span
            :class="[
              'size-1.5 rounded-full shrink-0',
              badgeState === 'idle'    && 'bg-muted-foreground',
              badgeState === 'running' && 'bg-amber-500 animate-pulse',
              badgeState === 'done'    && 'bg-green-500',
              badgeState === 'error'   && 'bg-red-500',
            ]"
          />
          <span>{{ { idle: 'Inactivo', running: 'Corriendo', done: 'Finalizado', error: 'Error' }[badgeState] }}</span>
        </span>
      </div>
    </div>

    <!-- ── Main grid ── -->
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

      <!-- ── LEFT COL (2/5) ── -->
      <div class="xl:col-span-2 flex flex-col gap-4">

        <!-- Config card -->
        <div class="bg-card border-2 border-black dark:border-surface-600 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] p-6 flex flex-col gap-5">

          <!-- Card header -->
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-foreground">Configuración</h2>
              <p class="text-xs mt-0.5 text-muted-foreground">Parámetros del algoritmo genético</p>
            </div>
            <Button
              variant="tonal"
              size="sm"
              :loading="store.loading"
              icon="lucide:refresh-cw"
              @click="onReloadConfig"
            >
              Recargar
            </Button>
          </div>

          <div class="border-t-2 border-dashed border-border" />

          <!-- Parámetros numéricos -->
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Parámetros Numéricos</p>
            <div class="grid grid-cols-2 gap-3">
              <CInputText
                v-model="form.tamano_poblacion"
                type="number"
                label="Tamaño Población"
                :error="errors.tamano_poblacion"
                message="10 – 500"
              />
              <CInputText
                v-model="form.max_generaciones"
                type="number"
                label="Máx. Generaciones"
                :error="errors.max_generaciones"
                message="10 – 2 000"
              />
              <CInputText
                v-model="form.aptitud_objetivo"
                type="number"
                label="Aptitud Objetivo"
                :error="errors.aptitud_objetivo"
                message="0 – 100 (opcional)"
              />
              <CInputText
                v-model="form.tasa_mutacion"
                type="number"
                label="Tasa de Mutación"
                :error="errors.tasa_mutacion"
                message="0.00 – 1.00"
              />
            </div>
          </div>

          <div class="border-t-2 border-dashed border-border" />

          <!-- Métodos -->
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Métodos del Algoritmo</p>
            <div class="flex flex-col gap-3">
              <CSelect
                v-model="form.metodo_seleccion"
                :items="seleccionItems"
                label="Método de Selección"
                option-label="label"
                option-value="value"
              />
              <CSelect
                v-model="form.metodo_cruce"
                :items="cruceItems"
                label="Método de Cruce"
                option-label="label"
                option-value="value"
              />
              <CSelect
                v-model="form.metodo_mutacion"
                :items="mutacionItems"
                label="Método de Mutación"
                option-label="label"
                option-value="value"
              />
            </div>
          </div>

          <div class="border-t-2 border-dashed border-border" />

          <!-- Configuración Horaria (collapsible) -->
          <div>
            <button
              type="button"
              class="w-full flex items-center justify-between"
              @click="timeOpen = !timeOpen"
            >
              <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Configuración Horaria</p>
              <Icon
                name="lucide:chevron-down"
                class="size-4 text-muted-foreground transition-transform duration-200"
                :class="{ 'rotate-180': timeOpen }"
              />
            </button>

            <div v-show="timeOpen" class="mt-3 flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3">
                <CInputText
                  v-model="form.duracion_periodo"
                  type="number"
                  label="Duración Período (min)"
                  message="30 – 120 min"
                  class="col-span-1"
                />
                <div />
                <CInputText
                  v-model="form.hora_inicio_manana"
                  type="time"
                  label="Inicio Mañana"
                />
                <CInputText
                  v-model="form.hora_fin_manana"
                  type="time"
                  label="Fin Mañana"
                />
                <CInputText
                  v-model="form.hora_inicio_tarde"
                  type="time"
                  label="Inicio Tarde"
                />
                <CInputText
                  v-model="form.hora_fin_tarde"
                  type="time"
                  label="Fin Tarde"
                />
              </div>
              <div class="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-500/60 rounded-lg p-2.5 text-xs text-amber-700 dark:text-amber-300">
                <Icon name="lucide:triangle-alert" class="size-4 shrink-0 mt-0.5" />
                <span>Cambiar rangos horarios regenera los períodos automáticamente.</span>
              </div>
            </div>
          </div>

          <!-- Save alert -->
          <div
            v-if="store.saveSuccess"
            class="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border-2 border-green-500/60 rounded-lg p-2.5 text-xs text-green-700 dark:text-green-300"
          >
            <Icon name="lucide:check-circle" class="size-4 shrink-0" />
            <span>Configuración guardada correctamente.</span>
          </div>
          <div
            v-if="store.error && !store.isRunning"
            class="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border-2 border-red-500/60 rounded-lg p-2.5 text-xs text-red-700 dark:text-red-300"
          >
            <Icon name="lucide:circle-x" class="size-4 shrink-0 mt-0.5" />
            <span>{{ store.error }}</span>
          </div>

          <!-- Save button -->
          <Button
            fluid
            :loading="store.saving"
            :disabled="!isValid"
            icon="lucide:check"
            @click="onSave"
          >
            Guardar Configuración
          </Button>
        </div>

        <!-- Result card (visible when horarioId is set) -->
        <div
          v-if="store.currentHorarioId"
          class="bg-card border-2 border-black dark:border-surface-600 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] p-4"
        >
          <div class="flex items-center gap-2 mb-3">
            <div class="size-6 rounded-full border-2 border-green-600 bg-green-50 dark:bg-green-950/50 flex items-center justify-center shrink-0">
              <Icon name="lucide:check" class="size-3.5 text-green-600" />
            </div>
            <span class="text-sm font-bold text-foreground">Horario Generado</span>
          </div>

          <div class="flex flex-col gap-2 text-sm text-muted-foreground">
            <div class="flex justify-between items-center">
              <span>ID del horario</span>
              <span class="font-mono font-bold text-base text-cics-primary">#{{ store.currentHorarioId }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Generaciones</span>
              <span class="font-bold text-foreground">{{ store.estado?.generacion ?? '—' }} gen.</span>
            </div>
            <div class="flex justify-between items-center">
              <span>Aptitud final</span>
              <span class="font-bold text-foreground">
                {{ store.estado?.mejorAptitud !== null && store.estado?.mejorAptitud !== undefined
                    ? store.estado.mejorAptitud.toFixed(2)
                    : '—' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span>Conflictos</span>
              <span class="font-bold text-foreground">{{ store.estado?.conflictos ?? '—' }}</span>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t-2 border-dashed border-border">
            <Button
              fluid
              variant="tonal"
              icon="lucide:eye"
              @click="router.push(store.currentHorarioId
                ? `/admin/schedules-generator/schedules?id=${store.currentHorarioId}`
                : '/admin/schedules-generator/schedules')"
            >
              Ver en Gestión de Horarios
            </Button>
          </div>
        </div>

      </div><!-- /left col -->

      <!-- ── RIGHT COL (3/5) ── -->
      <div class="xl:col-span-3 flex flex-col gap-4">

        <!-- Execution card -->
        <div
          :class="[
            'bg-card border-2 border-black dark:border-surface-600 rounded-xl p-6',
            store.isRunning
              ? 'shadow-[4px_4px_0_0_rgba(255,102,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,102,0,0.5)] animate-[pulse-ring_1.6s_ease-in-out_infinite]'
              : 'shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)]',
          ]"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-foreground">Ejecución</h2>
              <p class="text-xs mt-0.5 text-muted-foreground">Monitoreo en tiempo real vía WebSocket</p>
            </div>
            <div class="flex items-center gap-1.5">
              <span
                class="size-2 rounded-full transition-colors duration-300"
                :class="connected ? 'bg-green-500' : 'bg-muted-foreground'"
              />
              <span class="text-xs font-semibold text-muted-foreground">
                {{ connected ? 'ws conectado' : 'ws desconectado' }}
              </span>
            </div>
          </div>

          <!-- Nombre del horario -->
          <div class="mb-4">
            <CInputText
              v-model="nombreHorario"
              label="Nombre del horario (opcional)"
              placeholder="Ej: Horario Semestre I-2025 v2"
            />
          </div>

          <!-- Execute + Stop -->
          <div class="flex gap-3 mb-5">
            <Button
              fluid
              :disabled="store.isRunning"
              icon="lucide:play"
              @click="onEjecutar"
            >
              Ejecutar Algoritmo
            </Button>
            <Button
              variant="tonal"
              severity="danger"
              size="icon"
              :disabled="!store.isRunning"
              title="Interrumpir ejecución"
              @click="onDetener"
            >
              <Icon name="lucide:square" class="size-4" />
            </Button>
          </div>

          <!-- Progress -->
          <div class="mb-4">
            <div class="flex justify-between text-xs mb-1.5 text-muted-foreground">
              <span>Progreso de ejecución</span>
              <span class="font-mono font-bold">{{ progressPct.toFixed(1) }} %</span>
            </div>
            <div class="h-2 bg-muted border-2 border-black dark:border-surface-600 rounded-full overflow-hidden">
              <div
                class="h-full bg-cics-primary rounded-full transition-all duration-300 ease-out"
                :style="`width: ${progressPct}%`"
              />
            </div>
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
              <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
                {{ store.estado?.generacion ?? '—' }}
              </div>
              <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Generación</div>
            </div>
            <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
              <div class="text-xl font-extrabold text-cics-primary tabular-nums leading-none">
                {{ store.estado?.mejorAptitud !== null && store.estado?.mejorAptitud !== undefined
                    ? store.estado.mejorAptitud.toFixed(2)
                    : '—' }}
              </div>
              <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Mejor Aptitud</div>
            </div>
            <div class="bg-muted border-2 border-black dark:border-surface-600 rounded-lg p-2.5 text-center">
              <div
                class="text-xl font-extrabold tabular-nums leading-none"
                :class="conflictoColor || 'text-foreground'"
              >
                {{ store.estado?.conflictos ?? '—' }}
              </div>
              <div class="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">Conflictos</div>
            </div>
          </div>

          <!-- Exec error alert -->
          <div
            v-if="store.estado?.error"
            class="flex items-start gap-2 bg-red-50 dark:bg-red-950/30 border-2 border-red-500/60 rounded-lg p-2.5 text-xs text-red-700 dark:text-red-300 mb-3"
          >
            <Icon name="lucide:circle-x" class="size-4 shrink-0 mt-0.5" />
            <span>{{ store.estado.error }}</span>
          </div>

          <!-- WS Log -->
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Log WebSocket</p>
            <div
              class="text-xs font-mono rounded-lg p-2.5 overflow-y-auto bg-muted text-muted-foreground"
              style="max-height: 6.5rem; min-height: 4rem;"
            >
              <div v-if="!store.wsLog.length" class="opacity-60">→ Esperando conexión…</div>
              <div v-for="(line, i) in store.wsLog" :key="i">{{ line }}</div>
            </div>
          </div>
        </div>

        <!-- Chart card -->
        <div class="bg-card border-2 border-black dark:border-surface-600 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.08)] p-6">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 class="text-base font-bold text-foreground">Evolución de Aptitud</h2>
              <p class="text-xs mt-0.5 text-muted-foreground">Mejor aptitud por generación — actualización en tiempo real</p>
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant="tonal"
                size="sm"
                icon="lucide:history"
                title="Cargar la evolución de aptitud del último horario generado"
                :loading="historialLoading"
                @click="onLoadHistorial"
              >
                Historial
              </Button>
              <Button
                variant="tonal"
                size="sm"
                icon="lucide:trash-2"
                @click="onClearChart"
              >
                Limpiar
              </Button>
              <Button
                variant="tonal"
                size="sm"
                icon="lucide:image-down"
                @click="chartRef?.downloadPNG()"
              >
                PNG
              </Button>
            </div>
          </div>

          <AptitudChart ref="chartRef" :points="store.chartPoints" />
        </div>

      </div><!-- /right col -->

    </div><!-- /main grid -->
  </div>
</template>

<style scoped>
@keyframes pulse-ring {
  0%, 100% { box-shadow: 4px 4px 0 0 rgba(255, 102, 0, 1); }
  50%       { box-shadow: 4px 4px 0 0 rgba(251, 191, 36, 1); }
}
</style>
