<template>
  <div class="space-y-6">
    <header class="space-y-2">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-semibold">
          <Icon name="icon-park-twotone:alarm-clock" class="mr-1.5 mb-1 inline-block" />
          Períodos de Clase
        </h1>
        <Button
          @click="refresh()"
          :loading="status === 'pending'"
          label="Recargar"
          icon="lucide:refresh-cw"
          variant="text"
          class="text-muted-foreground"
        />
      </div>
      <p class="mt-2">
        Consulta los períodos configurados del sistema. Estos se generan automáticamente
        según la configuración del algoritmo.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="h-40 bg-muted rounded-2xl animate-pulse" />
    </div>

    <!-- Error -->
    <Alert v-else-if="status === 'error'" variant="destructive">
      <Icon name="lucide:alert-circle" />
      <AlertDescription>Error al cargar los períodos. Intenta recargar.</AlertDescription>
    </Alert>

    <!-- Períodos -->
    <div v-else-if="periods.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="period in periods"
        :key="period.id"
        class="relative overflow-hidden rounded-2xl transition-all duration-200"
      >


        <CardContent class=" space-y-4">
          <!-- Número -->
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
              <span class="text-2xl font-bold text-primary">{{ String(period.numero).padStart(2, '0') }}</span>
            </div>
            <div>
              <p class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Período</p>
              <p class="text-sm font-medium">N° {{ period.numero }}</p>
            </div>
          </div>

          <Separator />

          <!-- Horario -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Inicio</span>
              <span class="font-semibold">{{ period.hora_inicio }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground">Fin</span>
              <span class="font-semibold">{{ period.hora_fin }}</span>
            </div>
          </div>

          <Separator />

          <!-- Jornada -->
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

    <!-- Vacío -->
    <div v-else class="border border-dashed border-border rounded-2xl p-16 text-center bg-muted/20">
      <div class="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
        <Icon name="lucide:clock-off" size="32" class="text-muted-foreground opacity-50" />
      </div>
      <p class="font-semibold mb-1">No hay períodos disponibles</p>
      <p class="text-sm text-muted-foreground max-w-sm mx-auto">
        Los períodos se generan automáticamente según la configuración del algoritmo del sistema
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchPeriods, type Period } from '~/lib/api/schedules-generator/periods'
import { Card, CardContent } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Separator } from '~/components/ui/separator'
import Button from '~/components/ui/button/Button.vue'
import { Icon } from '#components'

const { data, status, refresh } = await useAsyncData(
  'schedules-periods',
  () => fetchPeriods()
)

const periods = computed<Period[]>(() => data.value ?? [])
</script>
