<script setup lang="ts">
import { Dialog } from '~/components/ui/dialog'

defineProps<{
  open: boolean
  semestre: number | null
  alcance: 'carrera' | 'todo'
  alcanceCount: number
}>()

const emit = defineEmits<{
  'update:open': [val: boolean]
  'confirm': []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent title="Tu semestre no tiene oferta este ciclo" closeButton>
      <p class="text-sm text-muted-foreground">
        El horario propuesto no tiene secciones para tu carrera y semestre
        (Sem. {{ semestre ?? '?' }}) este ciclo. Puedes duplicarlo de
        todos modos: se copiará el propuesto
        <strong>{{ alcance === 'carrera' ? 'de tu carrera (todos los semestres)' : 'completo (todas las carreras)' }}</strong>
        — {{ alcanceCount }} sección{{ alcanceCount !== 1 ? 'es' : '' }} — y
        luego quitas los cursos que no te correspondan.
      </p>
      <p class="text-xs text-muted-foreground mt-2">
        También puedes cancelar y usar el catálogo de la izquierda con el filtro
        "Todos los semestres" para agregar solo los cursos que quieras.
      </p>
      <div class="flex gap-2 justify-end mt-4">
        <Button variant="tonal" size="sm" @click="emit('update:open', false)">
          Cancelar
        </Button>
        <Button size="sm" icon="lucide:copy" @click="emit('confirm')">
          Duplicar de todos modos
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
