<template>
  <main class="pb-8">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:book" class="mr-1.5 mb-1 inline-block" />
        Crear item de biblioteca
      </h1>
    </header>
    <PSelectButton
      v-model="bookType"
      :options="[
        { label: 'Digital', value: 'digital' },
        { label: 'Físico', value: 'physical' }
      ]"
      size="small"
      :allow-empty="false"
      option-label="label"
      option-value="value"
      pt:root:class="grid! grid-cols-2 lg:flex! my-4"
    >
      <template #option="{ option }">
        {{ option.label }}
      </template>
    </PSelectButton>
    <section class="mt-4">
      <h2 class="mb-2 font-medium">Información del libro</h2>
      <PForm
        :initial-values
        :resolver="resolverToUse"
        v-slot="$form"
        @submit="saveBook"
        class=""
      >
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CInputText
            label="Nombre"
            name="name"
            id="name"
            no-borders
            prepend-icon="icon-park-twotone:book"
            :error="$form.name?.error?.message"
          />
          <CInputText
            label="ISBN"
            name="isbn"
            id="isbn"
            no-borders
            prepend-icon="icon-park-twotone:hashtag-key"
            :error="$form.isbn?.error?.message"
          />
          <CTextarea
            label="Descripción"
            name="description"
            id="description"
            no-borders
            :rows="3"
            prepend-icon="icon-park-twotone:text"
            :error="$form.description?.error?.message"
          />
          <CInputText
            v-if="bookType === 'physical'"
            label="Identificador de referencia"
            name="reference_id"
            id="reference_id"
            no-borders
            prepend-icon="icon-park-twotone:bank-card-two"
            :error="$form.reference_id?.error?.message"
          />
          <CInputText
            label="Autor"
            name="author"
            id="author"
            no-borders
            prepend-icon="icon-park-twotone:people"
            :error="$form.author?.error?.message"
          />
          <CInputText
            v-if="bookType === 'digital'"
            label="URL de fuente"
            name="source_url"
            id="source_url"
            no-borders
            prepend-icon="icon-park-outline:link-one"
            :error="$form.source_url?.error?.message"
          />
          <CInputText
            v-if="bookType === 'physical'"
            label="Edición"
            name="edition"
            id="edition"
            no-borders
            prepend-icon="icon-park-twotone:bookshelf"
            :error="$form.total_availability?.error?.message"
          />

          <CInputText
            v-if="bookType === 'physical'"
            label="Ubicación"
            name="location"
            placeholder="Ejemplo: Estante 2, Repisa 5"
            id="location"
            no-borders
            prepend-icon="icon-park-twotone:local"
            :error="$form.location?.error?.message"
          />

          <CSelect
            label="Categoría"
            name="category_id"
            id="category_id"
            :items="[
              {
                label: 'Categoria de ejemplo',
                value: 1
              },
              {
                label: 'Categoria de ejemplo 2',
                value: 2
              }
            ]"
            option-label="label"
            option-value="value"
            no-borders
            prepend-icon="icon-park-twotone:tree-list"
          />
        </div>

        <div v-if="bookType === 'physical'" class="mb-4">
          <h5 class="my-3 font-medium">Dispobibilidad</h5>
          <section class="grid grid-cols-2 gap-4">
            <div>
              <PFloatLabel variant="in" class="mb-2">
                <PInputNumber
                  inputId="total_availability"
                  name="total_availability"
                  variant="filled"
                  fluid
                  size="small"
                  input-class="rounded-lg! focus:ring-2! focus:ring-primary-400/50 border-black!"
                />
                <label for="total_availability">Dispobibilidad total</label>
              </PFloatLabel>
              <div
                v-if="$form.total_availability?.invalid"
                class="mt-1.5 text-xs font-medium text-red-500"
              >
                {{ $form.total_availability?.error?.message }}
              </div>
            </div>
            <div>
              <PFloatLabel variant="in">
                <PInputNumber
                  inputId="current_availability"
                  name="current_availability"
                  variant="filled"
                  fluid
                  size="small"
                  input-class="rounded-lg! focus:ring-2! focus:ring-primary-400/50 border-black!"
                />
                <label for="current_availability">Dispobibilidad actual</label>
              </PFloatLabel>
              <div
                v-if="$form.current_availability?.invalid"
                class="mt-1.5 text-xs font-medium text-red-500"
              >
                {{ $form.current_availability?.error?.message }}
              </div>
            </div>
          </section>
        </div>

        <div v-if="bookType === 'digital'" class="mb-4">
          <h5 class="my-2 font-medium">Archivo del libro</h5>
          <PFileUpload
            mode="advanced"
            accept="application/pdf"
            :multiple="false"
            pt:root:class="border-none!"
            @select="(e) => (file = e.files[0])"
          >
            <template #header="{ chooseCallback }">
              <CButton
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
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/books"
            severity="secondary"
            class=""
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            class=""
            :disabled="!file && bookType === 'digital'"
            :loading
          />
        </div>
      </PForm>
    </section>
  </main>
</template>
<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
import { createBookItem, createWithoutMedia } from '~/lib/api/admin/books'
definePageMeta({
  layout: 'admin'
})

const loading = ref(false)

const file = ref()

const bookType = ref<'physical' | 'digital'>('digital')

const initialValues = reactive({
  name: '',
  description: '',
  isbn: '',
  reference_id: '',
  total_availability: 0,
  current_availability: 0,
  edition: '',
  location: '',
  author: '',
  source_url: ''
})

const resolverToUse = computed(() =>
  bookType.value === 'digital' ? digtialResolver : physicalResolver
)

const digtialResolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    isbn: z.string(),
    author: z.string().nonempty('El autor del libro es requerido'),
    source_url: z.string().url('La URL de la fuente no es válida')
  })
)

const physicalResolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    isbn: z.string(),
    reference_id: z
      .string()
      .nonempty('El identificador de referencia es requerido'),
    total_availability: z
      .number({ message: 'El valor debe ser un número' })
      .int('El valor debe ser un número')
      .positive('La disponibilidad total debe ser un número positivo'),
    current_availability: z
    .number({ message: 'El valor debe ser un número' })
      .int('El valor debe ser un número')
      .positive('La disponibilidad actual debe ser un número positivo'),
    edition: z.string().nonempty('La edición del libro es requerida'),
    location: z.string().nonempty('La ubicación del libro es requerida'),
    author: z.string().nonempty('El autor del libro es requerido'),
  })
)

const saveBook = async (e: FormSubmitEvent) => {
  console.log(e)
  if (e.valid) {
    loading.value = true
    const response =
      bookType.value === 'digital'
        ? await createBookItem(
            {
              ...(e.values as Omit<BookPayload, 'file'>),
              file: file.value
            },
            bookType.value
          )
        : await createWithoutMedia(
            e.values as Omit<BookPayload, 'file'>,
            bookType.value
          )
    
    if (!response.error) {
      navigateTo('/admin/books')
    }
    loading.value = false
    // navigateTo('/admin/books')
  }
}
</script>
