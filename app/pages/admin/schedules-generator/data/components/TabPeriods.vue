<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="space-y-2 pb-4 border-b border-border">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="lucide:clock" size="24" class="text-primary" />
          <h2 class="text-2xl font-bold">Períodos de Clase</h2>
        </div>
        <Button
          @click="loadPeriods"
          :loading="loading"
          label="Recargar"
          icon="lucide:refresh-cw"
          variant="text"
          class="text-muted-foreground"
        />
      </div>
      <p class="text-muted-foreground">
        Consulta los períodos configurados del sistema. Estos se generan automáticamente según la configuración del algoritmo.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-40 bg-muted rounded-2xl animate-pulse" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 bg-red-50/50 dark:bg-red-950/30 rounded-2xl border border-red-200/50 dark:border-red-800/50">
      <div class="flex gap-4">
        <Icon name="lucide:alert-circle" size="20" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div>
          <p class="text-red-900 dark:text-red-100 font-semibold">Error al cargar períodos</p>
          <p class="text-sm text-red-800 dark:text-red-200 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Periods Grid -->
    <div v-else>
      <div v-if="periods.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="period in periods"
          :key="period.id"
          class="relative overflow-hidden rounded-2xl py-0 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <!-- Gradient top bar -->
          <div class="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500/50 to-cyan-500/50" />

          <CardContent class="py-6 space-y-5">
            <!-- Number Badge -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <span class="text-2xl font-bold text-primary">{{ String(period.numero).padStart(2, '0') }}</span>
                </div>
                <div>
                  <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Período</p>
                  <p class="text-sm text-foreground font-medium">N° {{ period.numero }}</p>
                </div>
              </div>
            </div>

            <div class="h-px bg-border" />

            <!-- Time Information -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Inicio</span>
                <span class="text-sm font-semibold text-foreground">{{ period.hora_inicio }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Fin</span>
                <span class="text-sm font-semibold text-foreground">{{ period.hora_fin }}</span>
              </div>
            </div>

            <div class="h-px bg-border" />

            <!-- Session Tags -->
            <div class="flex gap-2">
              <div
                v-if="period.es_manana"
                class="flex-1 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2"
              >
                <Icon name="lucide:sun" size="16" class="text-green-600 dark:text-green-400" />
                <span class="text-xs font-medium text-green-700 dark:text-green-300">Mañana</span>
              </div>
              <div
                v-if="period.es_tarde"
                class="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-2"
              >
                <Icon name="lucide:moon" size="16" class="text-blue-600 dark:text-blue-400" />
                <span class="text-xs font-medium text-blue-700 dark:text-blue-300">Tarde</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-else class="border border-dashed border-border rounded-2xl p-16 text-center bg-muted/20">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
            <Icon name="lucide:clock-off" size="32" class="text-muted-foreground opacity-50" />
          </div>
        </div>
        <p class="text-foreground font-semibold mb-2">No hay períodos disponibles</p>
        <p class="text-sm text-muted-foreground max-w-sm mx-auto">
          Los períodos se generan automáticamente según la configuración del algoritmo del sistema
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'
import { Card, CardContent } from '~/components/ui/card'
import Button from '~/components/ui/button/Button.vue'
import { Icon } from '#components'

const periods = ref<Period[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadPeriods = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await fetchPeriods()
    if (data) {
      periods.value = data
    }
  }
  catch (err: any) {
    error.value = err.message || 'Error al cargar los períodos'
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPeriods()
})
</script>
