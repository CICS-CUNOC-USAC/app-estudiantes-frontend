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
    <form class="space-y-4" @submit="onSubmit">
      <FieldGroup class="gap-4">
        <VeeField v-slot="{ field, errors }" name="reference_id">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="ID de referencia"
              id="reference_id"
              no-borders
              prepend-icon="icon-park-twotone:tag"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="edition">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="Edición"
              id="edition"
              no-borders
              prepend-icon="icon-park-twotone:bookshelf"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="location">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="Ubicación"
              id="location"
              no-borders
              prepend-icon="icon-park-twotone:local"
              :error="errors[0]"
            />
          </Field>
        </VeeField>
      </FieldGroup>

      <div class="flex gap-4 pt-2">
        <Button
          label="Cancelar"
          icon="icon-park-outline:arrow-left"
          type="button"
          variant="tonal"
          class="flex-1"
          @click="dialogRef.close()"
        />
        <Button
          label="Guardar"
          icon="icon-park-outline:check"
          type="submit"
          class="flex-1"
          :loading="saving"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { createLibraryReference } from '~/lib/api/admin/books'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Field, FieldGroup } from '~/components/ui/field'

const dialogRef: any = inject('dialogRef')
const { bookId } = dialogRef.value.data

const saving = ref(false)

const formSchema = z.object({
  reference_id: z.string().nonempty('El ID de referencia es requerido'),
  edition: z.string().nonempty('La edición es requerida'),
  location: z.string().nonempty('La ubicación es requerida')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    reference_id: '',
    edition: '',
    location: ''
  }
})

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  try {
    const { reference_id, ...rest } = values
    const result = await createLibraryReference(bookId, reference_id, rest)
    if (!(result as any)?.error) {
    dialogRef.value.close({ success: true })
    }
  } finally {
    saving.value = false
  }
})
</script>
