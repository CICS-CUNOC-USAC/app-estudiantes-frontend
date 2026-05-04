<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>¿Eliminar este elemento?</DialogTitle>
      </DialogHeader>
      <p>Esta acción no es reversible</p>
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
          label="Eliminar"
          severity="danger"
          icon="icon-park-twotone:delete"
          class="w-full"
          @click="confirmAction"
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

const emit = defineEmits(['confirm'])
const dialog = ref(false)

const confirmAction = () => {
  dialog.value = false
  emit('confirm')
}
</script>
