<script setup lang="ts">
import { Dialog } from '~/components/ui/dialog'
import type { HorarioDetalle } from '~/lib/api/schedules-generator/types'

defineProps<{
  open: boolean
  detalle: HorarioDetalle | null
  destinoLabel: string
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'confirm': []
  'cancel': []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Confirmar movimiento" closeButton>
      <template v-if="detalle">
        <p class="text-sm">
          ¿Colocar <strong>{{ detalle.curso_nombre }}</strong> en
          <strong>{{ destinoLabel }}</strong>?
        </p>
        <p class="text-xs text-muted-foreground mt-2">
          Este es tu horario personal de referencia, no el oficial de la sección: puedes ponerlo
          donde te convenga. Si choca con otro curso, se marcará en rojo en la grilla, pero el
          cambio se aplica igual.
        </p>
        <div class="flex gap-2 justify-end mt-4">
          <Button variant="tonal" size="sm" @click="emit('cancel')">
            Cancelar
          </Button>
          <Button size="sm" icon="lucide:check" @click="emit('confirm')">
            Colocar aquí
          </Button>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>
