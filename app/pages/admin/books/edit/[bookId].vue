<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:book" class="mr-1.5 mb-1 inline-block" />
        Editar item de biblioteca
      </h1>
    </header>
    <section
      class="mt-4 grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr]"
      v-if="book"
      :class="{
        'opacity-60': book && status === 'pending'
      }"
    >
      <form id="form-book-edit" @submit="onSubmit" class="flex flex-col gap-4">
        <h2 class="font-medium">Información del libro</h2>
        <VeeField v-slot="{ field, errors }" name="name">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="Nombre"
              name="name"
              id="name"
              no-borders
              prepend-icon="icon-park-twotone:book"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="description">
          <Field :data-invalid="!!errors.length">
            <CTextarea
              v-bind="field"
              label="Descripción"
              name="description"
              id="description"
              no-borders
              :rows="3"
              prepend-icon="icon-park-twotone:text"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="author">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="Autor"
              name="author"
              id="author"
              no-borders
              prepend-icon="icon-park-twotone:people"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="source_url">
          <Field :data-invalid="!!errors.length">
            <CInputText
              v-bind="field"
              label="URL de fuente"
              name="source_url"
              id="source_url"
              no-borders
              prepend-icon="icon-park-outline:link-one"
              :error="errors[0]"
            />
          </Field>
        </VeeField>

        <div class="flex items-center gap-2">
          <Switch id="enableBookEdit" v-model="enableBookEdit" />
          <label for="enableBookEdit" class="text-sm select-none cursor-pointer">
            Actualizar archivo
          </label>
        </div>
        <div v-if="enableBookEdit">
          <Input
            type="file"
            accept="application/pdf"
            class="cursor-pointer"
            @change="(e: Event) => (file = (e.target as HTMLInputElement).files?.[0])"
          />
        </div>

        <div class="flex gap-4">
          <Button
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/books"
            class="flex-1"
          />
          <Button
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            :loading="status === 'pending'"
            class="flex-1"
          />
        </div>
      </form>
      <div>
        <h2 class="mb-4 font-medium">Previsualización del libro</h2>
        <PdfPreview :pdf-url="book.media.url" :key="book.media.url" />
      </div>
    </section>
    <ElementNotFound
      v-if="!book && !loading"
      class="mt-4"
      element-type="libro"
      back-to-route="/admin/books"
      back-to-label="Volver a la lista de biblioteca"
    />
  </main>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import PdfPreview from '~/components/content/PdfPreview.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
import { Field, FieldGroup } from '~/components/ui/field'
import { Switch } from '~/components/ui/switch'
import { Input } from '~/components/ui/input'

definePageMeta({
  layout: 'admin',
  subject: ['Book', 'all'],
  action: ['manage'],
})

const route = useRoute()
const enableBookEdit = ref(true)
const { fetchBookById, updateBookItem } = useAdminLibraryStore()
const { updateMedia } = useMediaStore()

const {
  data: book,
  pending: loading,
  status,
  refresh
} = await useAsyncData('edit-book', () => fetchBookById(+route.params.bookId))

const file = ref<File | undefined>(undefined)

const formSchema = z.object({
  name: z.string().nonempty('El nombre del libro es requerido'),
  description: z.string().nonempty('La descripción del libro es requerida'),
  author: z.string().nonempty('El autor del libro es requerido'),
  source_url: z.string().url('La URL de la fuente no es válida')
})

const initialValues = computed(() => {
  if (!book.value) return {}
  return {
    name: book.value.name,
    description: book.value.description,
    author: book.value.author,
    source_url: book.value.source_url ?? ''
  }
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: initialValues.value
})

const onSubmit = handleSubmit(async (values) => {
  status.value = 'pending'
  await updateBookItem(+route.params.bookId, values)
  if (enableBookEdit.value && file.value) {
    await updateBookFile()
  }
  status.value = 'success'
  await refresh()
})

const updateBookFile = async () => {
  if (file.value && book.value?.media?.id) {
    await updateMedia(file.value, book.value.media.id)
    enableBookEdit.value = false
  }
}
</script>
