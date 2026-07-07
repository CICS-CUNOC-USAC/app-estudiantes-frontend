<script setup lang="ts">
import { Dialog } from '~/components/ui/dialog'

defineProps<{
  open: boolean
  cursosCount: number
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'confirm': []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="¿Reiniciar tu horario?" closeButton>
      <p class="text-sm text-muted-foreground">
        Se vaciará tu selección actual ({{ cursosCount }} curso{{ cursosCount !== 1 ? 's' : '' }}).
        Si ya lo habías guardado, sigue existiendo hasta que presiones "Guardar" de nuevo.
      </p>
      <div class="flex gap-2 justify-end mt-4">
        <Button variant="tonal" size="sm" @click="emit('update:open', false)">
          Cancelar
        </Button>
        <Button severity="danger" size="sm" icon="lucide:rotate-ccw" @click="emit('confirm')">
          Reiniciar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
