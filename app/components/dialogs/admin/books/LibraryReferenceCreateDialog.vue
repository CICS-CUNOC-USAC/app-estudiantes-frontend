<template>
  <div
    class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-svw -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-md dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="mb-4 flex items-center justify-between">
      <span class="text-xl font-semibold"> Agregar existencia </span>
      <Button
        class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        @click="dialogRef.close()"
      >
        <Icon name="lucide:x" />
        <span class="sr-only">Close</span>
      </Button>
    </div>
    <PForm
      :initial-values="initialValues"
      :resolver="resolver"
      v-slot="$form"
      @submit="saveReference"
      class="space-y-4"
    >
      <CInputText
        label="ID de referencia"
        name="reference_id"
        id="reference_id"
        no-borders
        prepend-icon="icon-park-twotone:tag"
        :error="$form.reference_id?.error?.message"
      />
      <CInputText
        label="Edición"
        name="edition"
        id="edition"
        no-borders
        prepend-icon="icon-park-twotone:bookshelf"
        :error="$form.edition?.error?.message"
      />
      <CInputText
        label="Ubicación"
        name="location"
        id="location"
        no-borders
        prepend-icon="icon-park-twotone:local"
        :error="$form.location?.error?.message"
      />
      <div class="flex gap-4 pt-2">
        <CButton
          label="Cancelar"
          icon="icon-park-outline:arrow-left"
          severity="secondary"
          class="flex-1"
          @click="dialogRef.close()"
        />
        <CButton
          label="Guardar"
          icon="icon-park-outline:check"
          type="submit"
          class="flex-1"
          :loading="saving"
        />
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { createLibraryReference } from '~/lib/api/admin/books'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'

const dialogRef: any = inject('dialogRef')
const { bookId } = dialogRef.value.data

const saving = ref(false)

const initialValues = reactive({
  reference_id: '',
  edition: '',
  location: ''
})

const resolver = zodResolver(
  z.object({
    reference_id: z.string().nonempty('El ID de referencia es requerido'),
    edition: z.string().nonempty('La edición es requerida'),
    location: z.string().nonempty('La ubicación es requerida')
  })
)

const saveReference = async (e: any) => {
  if (e.valid) {
    saving.value = true
    const { reference_id, ...rest } = e.values
    await createLibraryReference(bookId, reference_id, rest)
    saving.value = false
    dialogRef.value.close({ success: true })
  }
}
</script>
