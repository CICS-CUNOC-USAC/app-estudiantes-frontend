<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { Chart as ChartType, ChartData, ChartOptions } from 'chart.js'

const props = defineProps<{
  points: { x: number; y: number }[]
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{ download: [] }>()

const colorMode = useColorMode()
const canvasEl = ref<HTMLCanvasElement | null>(null)
let chart: ChartType<'line'> | null = null

function gridColor() {
  return colorMode.value === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(107,114,128,0.12)'
}
function tickColor() {
  return colorMode.value === 'dark' ? '#9ca3af' : '#6b7280'
}

onMounted(async () => {
  if (!canvasEl.value) return
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)

  const gc = gridColor()
  const tc = tickColor()

  const data: ChartData<'line'> = {
    datasets: [{
      label: 'Mejor Aptitud',
      data: props.points.map(p => ({ x: p.x, y: p.y })),
      borderColor: '#ff6600',
      backgroundColor: 'rgba(255,102,0,0.07)',
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.35,
      fill: true,
    }],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    interaction: { mode: 'index', intersect: false },
    parsing: false,
    scales: {
      x: {
        type: 'linear',
        title: { display: true, text: 'Generación', color: tc, font: { size: 11 } },
        grid:  { color: gc },
        ticks: { color: tc, maxTicksLimit: 12, font: { size: 10 }, maxRotation: 0 },
      },
      y: {
        // Sin min/max fijo: la aptitud del scheduler NO es un porcentaje 0-100, es un
        // puntaje de penalización que puede ser negativo y de magnitud variable según
        // el tamaño del set de datos (con datos reales llega a los miles negativos).
        // Fijarlo a 0-100 recortaba la curva fuera de la vista — parecía "sin evolución".
        title: { display: true, text: 'Mejor Aptitud', color: tc, font: { size: 11 } },
        grid:  { color: gc },
        ticks: {
          color: tc,
          font: { size: 10 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#272933',
        titleColor: '#f5f5f3',
        bodyColor:  '#d4d4d8',
        borderColor: '#ff6600',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (ctx) => `Generación ${ctx[0]?.parsed?.x ?? ''}`,
          label: (ctx) => `  Aptitud: ${(ctx.parsed?.y ?? 0).toFixed(2)}`,
        },
      },
    },
  }

  chart = new Chart(canvasEl.value, { type: 'line', data, options })
})

let rafPending = false

// Re-siembra completa en cada sync (coalescida por rAF): con el append incremental
// anterior, cargar el historial de un horario ya graficado (misma cantidad de
// puntos) no cambiaba `length` y el botón "Historial" parecía no hacer nada.
// Con ≤2000 generaciones el resembrado es despreciable.
function syncChart() {
  if (!chart || !chart.data.datasets[0]) return
  const ds = chart.data.datasets[0].data as { x: number; y: number }[]
  ds.length = 0
  for (const p of props.points) ds.push({ x: p.x, y: p.y })
  chart.update('none')
}

watch(
  // La referencia cambia cuando el store reemplaza el historial (cargar historial /
  // limpiar) y también cuando el getter recalcula por push durante la ejecución.
  () => props.points,
  () => {
    if (rafPending) return
    rafPending = true
    requestAnimationFrame(() => { rafPending = false; syncChart() })
  },
)

watch(
  () => colorMode.value,
  () => {
    if (!chart) return
    const gc = gridColor()
    const tc = tickColor()
    const scales = chart.options.scales as any
    scales.x.grid.color  = gc
    scales.y.grid.color  = gc
    scales.x.ticks.color = tc
    scales.y.ticks.color = tc
    scales.x.title.color = tc
    scales.y.title.color = tc
    chart.update()
  },
)

onUnmounted(() => {
  chart?.destroy()
  chart = null
})

function downloadPNG() {
  if (!chart) return
  const a = document.createElement('a')
  a.download = 'aptitud-evolución.png'
  a.href = (chart as any).toBase64Image('image/png', 1)
  a.click()
  emit('download')
}

const genTotal = computed(() => props.points.length)
const maxApt   = computed(() => props.points.length ? Math.max(...props.points.map(p => p.y)) : null)
const initApt  = computed(() => props.points.length ? props.points[0].y : null)
const delta    = computed(() => {
  if (props.points.length < 2) return null
  return props.points[props.points.length - 1].y - props.points[0].y
})

defineExpose({ downloadPNG })
</script>

<template>
  <div :class="props.class">
    <!-- Canvas -->
    <div class="relative" style="height: 280px">
      <canvas ref="canvasEl" />
      <div
        v-if="!points.length"
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none text-muted-foreground"
      >
        <Icon name="lucide:bar-chart-2" class="size-12 opacity-25" />
        <p class="text-sm font-semibold">Sin datos</p>
        <p class="text-xs text-center max-w-xs">
          Ejecuta el algoritmo o carga el historial de un horario existente.
        </p>
      </div>
    </div>

    <!-- Stats row -->
    <div v-if="points.length" class="mt-4 pt-4 border-t-2 border-dashed border-border">
      <div class="grid grid-cols-4 gap-2 text-center">
        <div>
          <p class="text-sm font-bold text-foreground">{{ genTotal }}</p>
          <p class="text-xs text-muted-foreground">Generaciones</p>
        </div>
        <div>
          <p class="text-sm font-bold text-cics-primary">{{ maxApt?.toFixed(2) }}</p>
          <p class="text-xs text-muted-foreground">Máx. aptitud</p>
        </div>
        <div>
          <p class="text-sm font-bold text-foreground">{{ initApt?.toFixed(2) }}</p>
          <p class="text-xs text-muted-foreground">Aptitud inicial</p>
        </div>
        <div>
          <p
            class="text-sm font-bold"
            :class="delta !== null && delta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'"
          >
            {{ delta !== null ? (delta >= 0 ? '+' : '') + delta.toFixed(2) : '—' }}
          </p>
          <p class="text-xs text-muted-foreground">Mejora</p>
        </div>
      </div>
    </div>
  </div>
</template>
