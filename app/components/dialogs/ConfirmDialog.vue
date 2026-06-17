<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <p class="text-muted-foreground text-sm">{{ description }}</p>
      <DialogFooter class="mt-4 flex gap-x-4 sm:justify-start">
        <DialogClose as-child>
          <Button
            label="Cancelar"
            severity="secondary"
            icon="icon-park-outline:close"
            class="w-full"
          />
        </DialogClose>
        <Button
          :label="confirmLabel"
          :severity="confirmSeverity"
          :icon="confirmIcon"
          class="w-full"
          @click="onConfirm"
        />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import type { ButtonVariants } from '../ui/button';

withDefaults(defineProps<{
  title?: string
  description?: string
  confirmLabel?: string
  confirmSeverity?: ButtonVariants['severity']
  confirmIcon?: string
}>(), {
  title: '¿Estas seguro?',
  description: 'Esta accion no es reversible.',
  confirmLabel: 'Eliminar',
  confirmSeverity: 'danger',
  confirmIcon: 'icon-park-twotone:delete'
})

const emit = defineEmits<{
  confirm: []
}>()

const dialogOpen = ref(false)

function onConfirm() {
  dialogOpen.value = false
  emit('confirm')
}

function show() {
  dialogOpen.value = true
}

defineExpose({ show })
</script>
