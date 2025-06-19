<template>
  <main class="pb-8">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:book" class="mr-1.5 mb-1 inline-block" />
        Crear item de biblioteca
      </h1>
    </header>
    <h2 class="my-2 font-medium">Tipo de libro</h2>
    <PSelectButton v-model="bookType" :options="[
      { label: 'Digital', value: 'digital' },
      { label: 'Físico', value: 'physical' }
    ]" size="small" :allow-empty="false" option-label="label" option-value="value"
      pt:root:class="grid! grid-cols-2 lg:flex! my-4">
      <template #option="{ option }">
        {{ option.label }}
      </template>
    </PSelectButton>
    <section class="mt-4">
      <h2 class="mb-2 font-medium">Información del libro</h2>
      <PForm :initial-values :resolver="resolverToUse" v-slot="$form" @submit="saveBook" class="">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CInputText label="Nombre" name="name" id="name" no-borders prepend-icon="icon-park-twotone:book"
            :error="$form.name?.error?.message" />
          <CInputText label="ISBN" name="isbn" id="isbn" no-borders prepend-icon="icon-park-twotone:hashtag-key"
            :error="$form.isbn?.error?.message" />
          <CTextarea label="Descripción" name="description" id="description" no-borders :rows="3"
            prepend-icon="icon-park-twotone:text" :error="$form.description?.error?.message" />
          <CInputText v-if="bookType === 'physical'" label="Identificador de referencia" name="reference_id"
            id="reference_id" no-borders prepend-icon="icon-park-twotone:bank-card-two"
            :error="$form.reference_id?.error?.message" />
          <CInputText label="Autor" name="author" id="author" no-borders prepend-icon="icon-park-twotone:people"
            :error="$form.author?.error?.message" />
          <CInputText v-if="bookType === 'digital'" label="URL de fuente" name="source_url" id="source_url" no-borders
            prepend-icon="icon-park-outline:link-one" :error="$form.source_url?.error?.message" />
          <CInputText v-if="bookType === 'physical'" label="Edición" name="edition" id="edition" no-borders
            prepend-icon="icon-park-twotone:bookshelf" :error="$form.edition?.error?.message" />

          <CInputText v-if="bookType === 'physical'" label="Ubicación" name="location"
            placeholder="Ejemplo: Estante 2, Repisa 5" id="location" no-borders prepend-icon="icon-park-twotone:local"
            :error="$form.location?.error?.message" />

          <CSelect label="Categoría" name="category_id" id="category_id" :items="categories?.results || []"
            option-label="name" option-value="id" no-borders prepend-icon="icon-park-twotone:tree-list"
            :error="$form.category_id?.error?.message" />
        </div>

        <div v-if="bookType === 'physical'" class="mb-4">
          <h5 class="my-3 font-medium">Disponibilidad</h5>
          <section class="grid grid-cols-2 gap-4">
            <div>
              <PCheckbox inputId="is_available" name="is_available" binary />
              <span class="ml-2 font-medium">Esta Disponible</span>
            </div>
          </section>
        </div>

        <div v-if="bookType === 'digital'" class="mb-4">
          <h5 class="my-2 font-medium">Archivo del libro</h5>
          <PFileUpload mode="advanced" accept="application/pdf" :multiple="false" pt:root:class="border-none!"
            @select="(e) => (file = e.files[0])">
            <template #header="{ chooseCallback }">
              <CButton label="Seleccionar archivo" @click="chooseCallback" variant="tonal" />
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
          <CButton label="Cancelar" icon="icon-park-outline:arrow-left"
            :to="bookType === 'digital' ? '/admin/books/digital' : '/admin/books/physical'" severity="secondary"
            class="" />
          <CButton label="Guardar" icon="icon-park-outline:check" type="submit" class=""
            :disabled="!file && bookType === 'digital'" :loading />
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
import { createBookItem, createWithoutMedia, getAllCategories } from '~/lib/api/admin/books'
definePageMeta({
  layout: 'admin'
})

const loading = ref(false)

const { data: categories } = useAsyncData('categories', () =>
  getAllCategories()
)

const file = ref()

const route = useRoute()
const bookType = ref<'physical' | 'digital'>(route.query.type as ('physical' | 'digital') ?? 'physical')

const initialValues = reactive({
  name: '',
  description: '',
  isbn: '',
  reference_id: '',
  is_available: true,
  edition: '',
  location: '',
  author: '',
  source_url: '',
  category_id: null
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
    source_url: z.string().url('La URL de la fuente no es válida'),
    category_id: z.number(
      { message: 'La categoría es requerida' }
    ).int('La categoría es requerida')
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
    edition: z.string().nonempty('La edición del libro es requerida'),
    location: z.string().nonempty('La ubicación del libro es requerida'),
    author: z.string().nonempty('El autor del libro es requerido'),
    category_id: z.number(
      { message: 'La categoría es requerida' }
    ).int('La categoría es requerida'),
    is_available: z.boolean()
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
      navigateTo(`/admin/books/${bookType.value}`)
    }
    loading.value = false
    // navigateTo('/admin/books')
  }
}
</script>
