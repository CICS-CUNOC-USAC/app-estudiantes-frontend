<template>
  <div
    class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-auto max-h-[80vh] w-svw -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900"
  >
    <div class="mb-4 flex items-center justify-between">
      <span class="text-xl font-semibold"> Editar libro físico </span>
      <Button
        class="cursor-pointer rounded p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        @click="dialogRef.close()"
      >
        <Icon name="lucide:x" />
        <span class="sr-only">Close</span>
      </Button>
    </div>
    <form @submit="onSubmit" class="space-y-4">
      <VeeField v-slot="{ componentField, errors }" name="name">
        <Field :data-invalid="!!errors.length">
          <CInputText
            v-bind="componentField"
            label="Nombre"
            id="name"
            no-borders
            prepend-icon="icon-park-twotone:book"
            :error="errors[0]"
          />
        </Field>
      </VeeField>

      <VeeField v-slot="{ componentField, errors }" name="description">
        <Field :data-invalid="!!errors.length">
          <CTextarea
            v-bind="componentField"
            label="Descripción"
            id="description"
            no-borders
            :rows="3"
            prepend-icon="icon-park-twotone:text"
            :error="errors[0]"
          />
        </Field>
      </VeeField>

      <VeeField v-slot="{ componentField, errors }" name="isbn">
        <Field :data-invalid="!!errors.length">
          <CInputText
            v-bind="componentField"
            label="ISBN"
            id="isbn"
            no-borders
            prepend-icon="icon-park-twotone:hashtag-key"
            :error="errors[0]"
          />
        </Field>
      </VeeField>

      <VeeField v-slot="{ componentField, errors }" name="author">
        <Field :data-invalid="!!errors.length">
          <CInputText
            v-bind="componentField"
            label="Autor"
            id="author"
            no-borders
            prepend-icon="icon-park-twotone:people"
            :error="errors[0]"
          />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="category_id">
        <Field :data-invalid="!!errors.length">
          <CSelect
            label="Categoría"
            id="category_id"
            :items="categories?.results || []"
            option-label="name"
            option-value="id"
            no-borders
            prepend-icon="icon-park-twotone:tree-list"
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
            :error="errors[0]"
          />
        </Field>
      </VeeField>

      <div class="flex gap-4 pt-2">
        <Button
          label="Cancelar"
          icon="icon-park-outline:arrow-left"
          severity="secondary"
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
import { updateBook, getAllCategories } from '~/lib/api/admin/books'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
import { Field } from '~/components/ui/field'

const dialogRef: any = inject('dialogRef')
const { bookItem } = dialogRef.value.data

const saving = ref(false)

const { data: categories } = await useAsyncData('categories', () =>
  getAllCategories()
)

const formSchema = z.object({
  name: z.string().nonempty('El nombre del libro es requerido'),
  description: z.string().nonempty('La descripción del libro es requerida'),
  isbn: z.string(),
  author: z.string().nonempty('El autor del libro es requerido'),
  category_id: z
    .number({ message: 'La categoría es requerida' })
    .int('La categoría es requerida')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: bookItem.name || '',
    description: bookItem.description || '',
    isbn: bookItem.isbn || '',
    author: bookItem.author || '',
    category_id: bookItem.category_id || undefined
  }
})

const onSubmit = handleSubmit(async (values) => {
  saving.value = true
  await updateBook(bookItem.id, values)
  saving.value = false
  dialogRef.value.close({ success: true })
})
</script>
