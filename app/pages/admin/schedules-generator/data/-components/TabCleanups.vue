<template>
  <div class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:clear" class="mr-1.5 mb-1 inline-block" />
        Operaciones de Limpieza
      </h1>
      <p class="mt-2">
        Gestiona y limpia los datos del sistema. Estas operaciones pueden ser
        destructivas, así que cada acción pide confirmación y luego muestra un
        resumen en modal.
      </p>
    </header>

    <div class="flex gap-6">
      <!-- Estado de la Base de Datos -->
      <Card class="h-min overflow-hidden py-0">
        <CardHeader
          class="border-border border-b bg-indigo-500/10 py-6"
        >
          <CardTitle>Estado de la BD</CardTitle>
          <CardDescription
            >Consulta el estado actual del sistema</CardDescription
          >
          <CardAction>
            <div class="rounded-lg bg-blue-500/20 p-2">
              <Icon
                name="lucide:database"
                size="20"
                class="text-blue-600 dark:text-blue-400"
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent class="">
          <p>
            Útil para verificar qué tablas tienen datos antes de ejecutar una
            limpieza.
          </p>
        </CardContent>
        <CardFooter class="border-border border-t py-4">
          <Button
            @click="loadState"
            :disabled="loading.state"
            :loading="loading.state"
            variant="text"
            severity="info"
            label="Consultar Estado"
            icon="lucide:refresh-cw"
            class="w-full"
          />
        </CardFooter>
      </Card>

      <!-- Limpieza Completa -->
      <Card class="h-min overflow-hidden py-0">
        <CardHeader
          class="border-border border-b bg-amber-500/10 py-6"
        >
          <CardTitle>Limpieza Completa</CardTitle>
          <CardDescription
            >Elimina datos operativos (destructivo)</CardDescription
          >
          <CardAction>
            <div class="rounded-lg bg-amber-500/20 p-2">
              <Icon
                name="lucide:trash-2"
                size="20"
                class="text-amber-600 dark:text-amber-400"
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent class="">
          Esta operación eliminará todos los datos operativos y no se puede
          deshacer.
        </CardContent>
        <CardFooter class="border-border border-t py-4">
          <Button
            @click="showCompleteConfirm = true"
            :disabled="loading.complete"
            severity="warn"
            label="Ejecutar Limpieza Completa"
            icon="lucide:zap"
            variant="text"
            class="w-full"
          />
        </CardFooter>
      </Card>

      <!-- Eliminar Horarios -->
      <Card class="h-min overflow-hidden py-0">
        <CardHeader
          class="border-border border-b bg-red-500/10 py-6"
        >
          <CardTitle>Eliminar Horarios</CardTitle>
          <CardDescription
            >Elimina horarios, detalles e historial
            (destructivo)</CardDescription
          >
          <CardAction>
            <div class="rounded-lg bg-red-500/20 p-2">
              <Icon
                name="lucide:calendar-x"
                size="20"
                class="text-red-600 dark:text-red-400"
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent class="">
          Solo se eliminarán los horarios generados. Esta acción no se puede
          deshacer.
        </CardContent>
        <CardFooter class="border-border border-t py-4">
          <Button
            @click="showSchedulesConfirm = true"
            :disabled="loading.schedules"
            severity="danger"
            variant="text"
            label="Eliminar Todos los Horarios"
            icon="lucide:trash"
            class="w-full"
          />
        </CardFooter>
      </Card>
    </div>

    <!-- Confirmación: Limpieza Completa -->
    <Dialog v-model:open="showCompleteConfirm">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon name="lucide:alert-triangle" class="text-amber-600" />
            Confirmar Limpieza Completa
          </DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar todos los datos operativos. Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>
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

    <!-- Confirmación: Eliminar Horarios -->
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

    <!-- Diálogo de resultado -->
    <Dialog v-model:open="resultDialogOpen">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon :name="resultDialog.icon" :class="resultDialog.iconClass" />
            {{ resultDialog.title }}
          </DialogTitle>
          <DialogDescription>{{ resultDialog.description }}</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
          <Alert :class="resultDialog.panelClass">
            <AlertDescription>
              <p class="mb-1 font-medium">{{ resultDialog.summary }}</p>
              <p class="text-muted-foreground">{{ resultDialog.message }}</p>
            </AlertDescription>
          </Alert>

          <div
            v-if="resultDialog.kind === 'state'"
            class="grid grid-cols-2 gap-3"
          >
            <Card
              v-for="item in resultDialog.stateItems"
              :key="item.label"
              class="py-0"
            >
              <CardContent class="py-3">
                <p class="text-muted-foreground text-xs">{{ item.label }}</p>
                <p class="text-primary text-2xl font-bold">{{ item.value }}</p>
              </CardContent>
            </Card>
          </div>

          <div v-else class="grid gap-3 sm:grid-cols-2">
            <Card
              v-for="item in resultDialog.metrics"
              :key="item.label"
              class="py-0"
            >
              <CardContent class="py-3">
                <p class="text-muted-foreground text-xs">{{ item.label }}</p>
                <p class="text-xl font-bold" :class="resultDialog.metricClass">
                  {{ item.value }}
                </p>
              </CardContent>
            </Card>
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
import {
  fetchResetState,
  resetComplete,
  resetSchedules
} from '~/lib/api/schedules-generator/reset'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import Button from '~/components/ui/button/Button.vue'
import { Icon } from '#components'

const loading = reactive({ state: false, complete: false, schedules: false })

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
  panelClass: '',
  metricClass: 'text-primary',
  stateItems: [] as Array<{ label: string; value: number }>,
  metrics: [] as Array<{ label: string; value: number }>
})
const showCompleteConfirm = ref(false)
const showSchedulesConfirm = ref(false)

const openResultDialog = (
  payload: typeof resultDialog & {
    stateItems?: Array<{ label: string; value: number }>
    metrics?: Array<{ label: string; value: number }>
  }
) => {
  Object.assign(resultDialog, payload)
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
    horario_historial: 'Historial de horario'
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
        panelClass: '',
        metricClass: 'text-primary',
        stateItems: Object.entries(stateData.value ?? {}).map(
          ([key, value]) => ({
            label: toLabel(key),
            value: Number(value) || 0
          })
        )
      })
    }
  } finally {
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
      description:
        'Se eliminó la información operativa configurada por el backend.',
      summary: completeData.value?.mensaje ?? 'Operación completada',
      message: 'El sistema devolvió el siguiente detalle de tablas limpiadas.',
      icon: 'lucide:check-circle-2',
      iconClass: 'text-green-600 dark:text-green-400',
      panelClass: '',
      metricClass: 'text-green-600',
      metrics: Object.entries(completeData.value?.tablas_limpiadas ?? {}).map(
        ([table, info]) => ({
          label: toLabel(table),
          value: Number((info as { eliminados?: number }).eliminados) || 0
        })
      )
    })
  } finally {
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
      description:
        'Se removieron los horarios generados y sus registros asociados.',
      summary: schedulesData.value?.mensaje ?? 'Operación completada',
      message:
        'El resumen de eliminación muestra cuántos registros fueron afectados.',
      icon: 'lucide:calendar-x',
      iconClass: 'text-red-600 dark:text-red-400',
      panelClass: '',
      metricClass: 'text-red-600',
      metrics: [
        {
          label: 'Horarios',
          value: Number(schedulesData.value?.eliminados?.horarios) || 0
        },
        {
          label: 'Detalle',
          value: Number(schedulesData.value?.eliminados?.horario_detalle) || 0
        },
        {
          label: 'Historial',
          value: Number(schedulesData.value?.eliminados?.horario_historial) || 0
        }
      ]
    })
  } finally {
    loading.schedules = false
  }
}
</script>
