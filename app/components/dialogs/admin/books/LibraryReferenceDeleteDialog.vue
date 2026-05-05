<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="lg:max-w-md">
      <DialogHeader>
        <DialogTitle>Eliminar referencia</DialogTitle>
      </DialogHeader>
      <div class="space-y-2">
        <p class="text-gray-700 dark:text-gray-300">
          ¿Estás seguro de que deseas eliminar la referencia
          <strong>{{ referenceItem.id }}</strong
          >?
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Esta acción no se puede deshacer.
        </p>
      </div>
      <DialogFooter class="mt-2 flex gap-4 sm:justify-start">
        <DialogClose as-child>
          <Button
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            severity="secondary"
            class="flex-1"
            type="button"
          />
        </DialogClose>
        <Button
          label="Eliminar"
          icon="icon-park-outline:delete"
          severity="danger"
          class="flex-1"
          :loading="deleting"
          @click="deleteReference"
        />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { deleteLibraryReference } from '~/lib/api/admin/books'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'

const props = defineProps<{
  bookId: number
  referenceItem: any
}>()

const emit = defineEmits(['confirm'])

const open = ref(false)
const deleting = ref(false)

const deleteReference = async () => {
  deleting.value = true
  await deleteLibraryReference(props.bookId, props.referenceItem.id)
  deleting.value = false
  open.value = false
  emit('confirm')
}
</script>
