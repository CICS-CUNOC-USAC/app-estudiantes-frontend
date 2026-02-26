<template>
  <div
    class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-svw -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-md dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="mb-4 flex items-center justify-between">
      <span class="text-xl font-semibold"> Eliminar referencia </span>
      <Button
        class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        @click="dialogRef.close()"
      >
        <Icon name="lucide:x" />
        <span class="sr-only">Close</span>
      </Button>
    </div>
    <div class="space-y-4">
      <p class="text-gray-700 dark:text-gray-300">
        ¿Estás seguro de que deseas eliminar la referencia
        <strong>{{ referenceItem.id }}</strong
        >?
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Esta acción no se puede deshacer.
      </p>
      <div class="flex gap-4 pt-2">
        <CButton
          label="Cancelar"
          icon="icon-park-outline:arrow-left"
          severity="secondary"
          class="flex-1"
          @click="dialogRef.close()"
        />
        <CButton
          label="Eliminar"
          icon="icon-park-outline:delete"
          severity="danger"
          class="flex-1"
          :loading="deleting"
          @click="deleteReference"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { deleteLibraryReference } from '~/lib/api/admin/books'
import CButton from '~/components/primitives/button/CButton.vue'

const dialogRef: any = inject('dialogRef')
const { bookId, referenceItem } = dialogRef.value.data

const deleting = ref(false)

const deleteReference = async () => {
  deleting.value = true
  await deleteLibraryReference(bookId, referenceItem.id)
  deleting.value = false
  dialogRef.value.close({ success: true })
}
</script>
