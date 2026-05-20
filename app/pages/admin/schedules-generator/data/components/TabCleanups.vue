<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="space-y-2 pb-4 border-b border-border">
      <div class="flex items-center gap-2">
        <Icon name="lucide:broom" size="24" class="text-primary" />
        <h2 class="text-2xl font-bold">Operaciones de Limpieza</h2>
      </div>
      <p class="text-muted-foreground">
        Gestiona y limpia los datos del sistema. Estas operaciones pueden ser destructivas,
        así que cada acción pide confirmación y luego muestra un resumen en modal.
      </p>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

      <!-- Estado de la Base de Datos -->
      <Card class="overflow-hidden py-0">
        <CardHeader class="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border-b border-border py-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-500/20 rounded-lg shrink-0">
              <Icon name="lucide:database" size="20" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>Estado de la BD</CardTitle>
              <CardDescription>Consulta el estado actual del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="flex-1 py-6">
          <div class="cleanup-card__note cleanup-card__note--blue cleanup-card__note--compact min-h-23">
            <Icon name="lucide:info" size="18" class="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p>
              Útil para verificar qué tablas tienen datos antes de ejecutar una limpieza.
            </p>
          </div>
        </CardContent>
        <CardFooter class="border-t border-border py-4">
          <Button
            @click="loadState"
            :disabled="loading.state"
            :loading="loading.state"
            label="Consultar Estado"
            icon="lucide:refresh-cw"
            class="w-full"
          />
        </CardFooter>
      </Card>

      <!-- Limpieza Completa -->
      <Card class="overflow-hidden py-0">
        <CardHeader class="bg-linear-to-r from-amber-500/10 to-orange-500/10 border-b border-border py-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-500/20 rounded-lg shrink-0">
              <Icon name="lucide:trash-2" size="20" class="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <CardTitle>Limpieza Completa</CardTitle>
              <CardDescription>Elimina datos operativos (destructivo)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="flex-1 py-6">
          <div class="cleanup-card__note cleanup-card__note--amber cleanup-card__note--compact min-h-23">
            <Icon name="lucide:alert-triangle" size="18" class="mt-0.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <p>
              Esta operación eliminará todos los datos operativos y no se puede deshacer.
            </p>
          </div>
        </CardContent>
        <CardFooter class="border-t border-border py-4">
          <Button
            @click="showCompleteConfirm = true"
            :disabled="loading.complete"
            severity="warn"
            label="Ejecutar Limpieza Completa"
            icon="lucide:zap"
            class="w-full"
          />
        </CardFooter>
      </Card>

      <!-- Eliminar Horarios -->
      <Card class="overflow-hidden py-0">
        <CardHeader class="bg-linear-to-r from-red-500/10 to-rose-500/10 border-b border-border py-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-500/20 rounded-lg shrink-0">
              <Icon name="lucide:calendar-x" size="20" class="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle>Eliminar Horarios</CardTitle>
              <CardDescription>Elimina horarios, detalles e historial (destructivo)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="flex-1 py-6">
          <div class="cleanup-card__note cleanup-card__note--red cleanup-card__note--compact min-h-23">
            <Icon name="lucide:alert-circle" size="18" class="mt-0.5 text-red-600 dark:text-red-400 shrink-0" />
            <p>
              Solo se eliminarán los horarios generados. Esta acción no se puede deshacer.
            </p>
          </div>
        </CardContent>
        <CardFooter class="border-t border-border py-4">
          <Button
            @click="showSchedulesConfirm = true"
            :disabled="loading.schedules"
            severity="danger"
            label="Eliminar Todos los Horarios"
            icon="lucide:trash"
            class="w-full"
          />
        </CardFooter>
      </Card>

    </div>

    <!-- Confirmation Dialogs -->
    <Dialog v-model:open="showCompleteConfirm">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon name="lucide:alert-triangle" class="text-amber-600" />
            Confirmar Limpieza Completa
          </DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar todos los datos operativos. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          ¿Realmente deseas continuar?
        </p>
        <DialogFooter class="flex gap-2">
          <Button
            @click="showCompleteConfirm = false"
            label="Cancelar"
            severity="secondary"
            class="flex-1"
          />
          <Button
            @click="confirmCompleteReset"
            :loading="loading.complete"
            label="Sí, eliminar"
            severity="danger"
            class="flex-1"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showSchedulesConfirm">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon name="lucide:alert-circle" class="text-red-600" />
            Confirmar Eliminación de Horarios
          </DialogTitle>
          <DialogDescription>
            Se eliminarán todos los horarios, detalles e historial generados.
          </DialogDescription>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">
          ¿Realmente deseas continuar?
        </p>
        <DialogFooter class="flex gap-2">
          <Button
            @click="showSchedulesConfirm = false"
            label="Cancelar"
            severity="secondary"
            class="flex-1"
          />
          <Button
            @click="confirmSchedulesReset"
            :loading="loading.schedules"
            label="Sí, eliminar"
            severity="danger"
            class="flex-1"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="resultDialogOpen">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon :name="resultDialog.icon" :class="resultDialog.iconClass" />
            {{ resultDialog.title }}
          </DialogTitle>
          <DialogDescription>
            {{ resultDialog.description }}
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <div class="rounded-lg border p-4" :class="resultDialog.panelClass">
            <p class="text-sm font-medium mb-2">{{ resultDialog.summary }}</p>
            <p class="text-sm text-muted-foreground">{{ resultDialog.message }}</p>
          </div>

          <div v-if="resultDialog.kind === 'state'" class="grid grid-cols-2 gap-3">
            <div
              v-for="item in resultDialog.stateItems"
              :key="item.label"
              class="rounded-lg border border-border bg-background p-3"
            >
              <p class="text-xs text-muted-foreground">{{ item.label }}</p>
              <p class="text-2xl font-bold text-primary">{{ item.value }}</p>
            </div>
          </div>

          <div v-else class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="item in resultDialog.metrics"
              :key="item.label"
              class="rounded-lg border border-border bg-background p-3"
            >
              <p class="text-xs text-muted-foreground">{{ item.label }}</p>
              <p class="text-xl font-bold" :class="resultDialog.metricClass">{{ item.value }}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            label="Cerrar"
            severity="secondary"
            class="w-full sm:w-auto"
            @click="resultDialogOpen = false"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { fetchResetState, resetComplete, resetSchedules } from '~/lib/api/schedules-generator/reset'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import Button from '~/components/ui/button/Button.vue'
import { Icon } from '#components'

const loading = reactive({
  state: false,
  complete: false,
  schedules: false,
})

const stateData = ref<any>(null)
const completeData = ref<any>(null)
const schedulesData = ref<any>(null)

const resultDialogOpen = ref(false)
const resultDialog = reactive({
  kind: 'state' as 'state' | 'complete' | 'schedules',
  title: '',
  description: '',
  summary: '',
  message: '',
  icon: 'lucide:info',
  iconClass: 'text-primary',
  panelClass: 'border-primary/20 bg-primary/5',
  metricClass: 'text-primary',
  stateItems: [] as Array<{ label: string, value: number }>,
  metrics: [] as Array<{ label: string, value: number }>,
})
const showCompleteConfirm = ref(false)
const showSchedulesConfirm = ref(false)

const openResultDialog = (payload: {
  kind: 'state' | 'complete' | 'schedules'
  title: string
  description: string
  summary: string
  message: string
  icon: string
  iconClass: string
  panelClass: string
  metricClass: string
  stateItems?: Array<{ label: string, value: number }>
  metrics?: Array<{ label: string, value: number }>
}) => {
  resultDialog.kind = payload.kind
  resultDialog.title = payload.title
  resultDialog.description = payload.description
  resultDialog.summary = payload.summary
  resultDialog.message = payload.message
  resultDialog.icon = payload.icon
  resultDialog.iconClass = payload.iconClass
  resultDialog.panelClass = payload.panelClass
  resultDialog.metricClass = payload.metricClass
  resultDialog.stateItems = payload.stateItems ?? []
  resultDialog.metrics = payload.metrics ?? []
  resultDialogOpen.value = true
}

const toLabel = (key: string) => {
  const labels: Record<string, string> = {
    carreras: 'Carreras',
    salones: 'Salones',
    docentes: 'Docentes',
    cursos: 'Cursos',
    laboratorios: 'Laboratorios',
    secciones: 'Secciones',
    seccion_laboratorio: 'Sección laboratorio',
    docente_curso: 'Docente curso',
    periodos: 'Períodos',
    horarios: 'Horarios',
    horario_detalle: 'Detalle de horario',
    horario_historial: 'Historial de horario',
  }

  return labels[key] ?? key
}

const loadState = async (showModal = true) => {
  loading.state = true
  try {
    stateData.value = await fetchResetState()
    if (showModal) {
      openResultDialog({
        kind: 'state',
        title: 'Estado de la base de datos',
        description: 'Resumen de los conteos actuales del sistema.',
        summary: 'Consulta completada',
        message: 'Estos son los datos disponibles antes de ejecutar limpiezas.',
        icon: 'lucide:database',
        iconClass: 'text-primary',
        panelClass: 'border-primary/20 bg-primary/5',
        metricClass: 'text-primary',
        stateItems: Object.entries(stateData.value ?? {}).map(([key, value]) => ({
          label: toLabel(key),
          value: Number(value) || 0,
        })),
      })
    }
  }
  finally {
    loading.state = false
  }
}

const confirmCompleteReset = async () => {
  await runCompleteReset()
  showCompleteConfirm.value = false
}

const runCompleteReset = async () => {
  loading.complete = true
  try {
    completeData.value = await resetComplete()
    await loadState(false)
    openResultDialog({
      kind: 'complete',
      title: 'Limpieza completa ejecutada',
      description: 'Se eliminó la información operativa configurada por el backend.',
      summary: completeData.value?.mensaje ?? 'Operación completada',
      message: 'El sistema devolvió el siguiente detalle de tablas limpiadas.',
      icon: 'lucide:check-circle-2',
      iconClass: 'text-green-600 dark:text-green-400',
      panelClass: 'border-green-500/20 bg-green-500/5',
      metricClass: 'text-green-600',
      metrics: Object.entries(completeData.value?.tablas_limpiadas ?? {}).map(([table, info]) => ({
        label: toLabel(table),
        value: Number((info as { eliminados?: number }).eliminados) || 0,
      })),
    })
  }
  finally {
    loading.complete = false
  }
}

const confirmSchedulesReset = async () => {
  await runSchedulesReset()
  showSchedulesConfirm.value = false
}

const runSchedulesReset = async () => {
  loading.schedules = true
  try {
    schedulesData.value = await resetSchedules()
    await loadState(false)
    openResultDialog({
      kind: 'schedules',
      title: 'Horarios eliminados',
      description: 'Se removieron los horarios generados y sus registros asociados.',
      summary: schedulesData.value?.mensaje ?? 'Operación completada',
      message: 'El resumen de eliminación muestra cuántos registros fueron afectados.',
      icon: 'lucide:calendar-x',
      iconClass: 'text-red-600 dark:text-red-400',
      panelClass: 'border-red-500/20 bg-red-500/5',
      metricClass: 'text-red-600',
      metrics: [
        { label: 'Horarios', value: Number(schedulesData.value?.eliminados?.horarios) || 0 },
        { label: 'Detalle', value: Number(schedulesData.value?.eliminados?.horario_detalle) || 0 },
        { label: 'Historial', value: Number(schedulesData.value?.eliminados?.horario_historial) || 0 },
      ],
    })
  }
  finally {
    loading.schedules = false
  }
}
</script>
