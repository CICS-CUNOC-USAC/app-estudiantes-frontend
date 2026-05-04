<template>
  <main class="pb-8">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:book" class="mr-1.5 mb-1 inline-block" />
        Crear item de biblioteca
      </h1>
    </header>
    <h2 class="my-2 font-medium">Tipo de libro</h2>
    <ToggleGroup
      class="dark:border-surface-700 border-black"
      variant="outline"
      type="single"
      :default-value="bookType"
      @update:model-value="
        (value) => {
          if (!value) return
          bookType = value
        }
      "
    >
      <ToggleGroupItem value="digital" aria-label="Toggle bold">
        Digital
      </ToggleGroupItem>
      <ToggleGroupItem value="physical" aria-label="Toggle italic">
        Físico
      </ToggleGroupItem>
    </ToggleGroup>
    <!-- <div class="my-4 grid grid-cols-2 gap-2 lg:flex">
      <button
        type="button"
        :class="[
          'rounded-md px-4 py-2 text-sm font-medium transition-colors',
          bookType === 'digital'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        ]"
        @click="bookType = 'digital'"
      >
        Digital
      </button>
      <button
        type="button"
        :class="[
          'rounded-md px-4 py-2 text-sm font-medium transition-colors',
          bookType === 'physical'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        ]"
        @click="bookType = 'physical'"
      >
        Físico
      </button>
    </div> -->
    <section class="mt-4">
      <h2 class="mb-2 font-medium">Información del libro</h2>
      <form id="form-book-create" @submit="onSubmit">
        <FieldGroup class="gap-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

            <VeeField
              v-if="bookType === 'physical'"
              v-slot="{ componentField, errors }"
              name="reference_id"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Identificador de referencia"
                  id="reference_id"
                  no-borders
                  prepend-icon="icon-park-twotone:bank-card-two"
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

            <VeeField
              v-if="bookType === 'digital'"
              v-slot="{ componentField, errors }"
              name="source_url"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="URL de fuente"
                  id="source_url"
                  no-borders
                  prepend-icon="icon-park-outline:link-one"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField
              v-if="bookType === 'physical'"
              v-slot="{ componentField, errors }"
              name="edition"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Edición"
                  id="edition"
                  no-borders
                  prepend-icon="icon-park-twotone:bookshelf"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField
              v-if="bookType === 'physical'"
              v-slot="{ componentField, errors }"
              name="location"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Ubicación"
                  placeholder="Ejemplo: Estante 2, Repisa 5"
                  id="location"
                  no-borders
                  prepend-icon="icon-park-twotone:local"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ field, errors }" name="category_id">
              <Field :data-invalid="!!errors.length">
                <CSelect
                  :model-value="
                    field.value !== null && field.value !== undefined
                      ? String(field.value)
                      : undefined
                  "
                  @update:model-value="
                    (value) => field.onChange(value ? Number(value) : null)
                  "
                  @blur="field.onBlur"
                  label="Categoría"
                  name="category_id"
                  id="category_id"
                  :items="categories?.results || []"
                  option-label="name"
                  option-value="id"
                  no-borders
                  prepend-icon="icon-park-twotone:tree-list"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <div v-if="bookType === 'physical'" class="mb-4">
            <h5 class="my-3 font-medium">Disponibilidad</h5>
            <VeeField v-slot="{ field, errors }" name="is_available">
              <Field orientation="horizontal" :data-invalid="!!errors.length">
                <Checkbox
                  id="is_available"
                  :model-value="field.value"
                  :aria-invalid="!!errors.length"
                  @update:model-value="field.onChange"
                />
                <FieldLabel for="is_available"> Esta Disponible </FieldLabel>
              </Field>
            </VeeField>
          </div>

          <div v-if="bookType === 'digital'" class="mb-4">
            <h5 class="my-2 font-medium">Archivo del libro</h5>
            <!-- NOTE: PFileUpload - mantener PrimeVue por ahora, es muy complejo migrar -->
            <PFileUpload
              mode="advanced"
              accept="application/pdf"
              :multiple="false"
              pt:root:class="border-none!"
              @select="(e) => (file = e.files[0])"
            >
              <template #header="{ chooseCallback }">
                <Button
                  label="Seleccionar archivo"
                  @click="chooseCallback"
                  variant="tonal"
                />
              </template>
              <template #empty>
                <p class="py-2 text-sm">
                  O arrastra el archivo <span class="font-medium">aquí</span>
                </p>
              </template>
              <template #content="{ files, removeFileCallback }">
                <div v-if="files.length > 0" class="py-2 text-sm">
                  <div class="flex items-center gap-2">
                    <Icon name="lucide:file" />
                    <span>{{ files[0].name }}</span>
                  </div>
                </div>
              </template>
            </PFileUpload>
          </div>
          <div class="flex gap-4">
            <Button
              label="Cancelar"
              icon="icon-park-outline:arrow-left"
              :to="
                bookType === 'digital'
                  ? '/admin/books/digital'
                  : '/admin/books/physical'
              "
              severity="secondary"
            />
            <Button
              label="Guardar"
              icon="icon-park-outline:check"
              type="submit"
              :disabled="!file && bookType === 'digital'"
              :loading
            />
          </div>
        </FieldGroup>
      </form>
    </section>
  </main>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
import { Checkbox } from '~/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '~/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
  createBookItem,
  createWithoutMedia,
  getAllCategories
} from '~/lib/api/admin/books'

definePageMeta({
  layout: 'admin',
  subject: ['Book', 'all'],
  action: ['manage']
})

const loading = ref(false)

const { data: categories } = useAsyncData('categories', () =>
  getAllCategories()
)

const file = ref()
const isAvailable = ref(true)

const route = useRoute()
const bookType = ref<'physical' | 'digital'>(
  (route.query.type as 'physical' | 'digital') ?? 'physical'
)

const getSchema = (type: 'physical' | 'digital') => {
  if (type === 'digital') {
    return z.object({
      name: z.string().nonempty('El nombre del libro es requerido'),
      description: z.string().nonempty('La descripción del libro es requerida'),
      isbn: z.string(),
      author: z.string().nonempty('El autor del libro es requerido'),
      source_url: z.string().url('La URL de la fuente no es válida'),
      category_id: z
        .number({ message: 'La categoría es requerida' })
        .int('La categoría es requerida')
    })
  }
  return z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    isbn: z.string(),
    reference_id: z
      .string()
      .nonempty('El identificador de referencia es requerido'),
    edition: z.string().nonempty('La edición del libro es requerida'),
    location: z.string().nonempty('La ubicación del libro es requerida'),
    author: z.string().nonempty('El autor del libro es requerido'),
    category_id: z
      .number({ message: 'La categoría es requerida' })
      .int('La categoría es requerida')
  })
}

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(getSchema(bookType.value)),
  initialValues: {
    name: '',
    description: '',
    isbn: '',
    reference_id: '',
    edition: '',
    location: '',
    author: '',
    source_url: '',
    category_id: undefined
  }
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  const response =
    bookType.value === 'digital'
      ? await createBookItem(
          {
            ...(values as Omit<BookPayload, 'file'>),
            file: file.value
          },
          bookType.value
        )
      : await createWithoutMedia(
          {
            ...values,
            is_available: isAvailable.value
          } as Omit<BookPayload, 'file'>,
          bookType.value
        )

  if (!response.error) {
    navigateTo(`/admin/books/${bookType.value}`)
  }
  loading.value = false
})
</script>
