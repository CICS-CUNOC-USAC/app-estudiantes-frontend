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
      <PForm
        :initial-values
        :resolver
        v-slot="$form"
        @submit="saveBook"
        class="flex flex-col gap-4"
      >
        <h2 class="font-medium">Información del libro</h2>
        <CInputText
          label="Nombre"
          name="name"
          id="name"
          no-borders
          prepend-icon="icon-park-twotone:book"
          :error="$form.name?.error?.message"
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
          label="Autor"
          name="author"
          id="author"
          no-borders
          prepend-icon="icon-park-twotone:people"
          :error="$form.author?.error?.message"
        />
        <CInputText
          label="URL de fuente"
          name="source_url"
          id="source_url"
          no-borders
          prepend-icon="icon-park-outline:link-one"
          :error="$form.source_url?.error?.message"
        />
        <div class="flex items-center gap-2">
          <PToggleSwitch
            v-model="enableBookEdit"
            :pt="{
              input: {
                id: 'enableBookEdit'
              }
            }"
          />
          <label for="enableBookEdit" class="text-sm select-none">
            Actualizar archivo
          </label>
        </div>
        <PFileUpload
          v-if="enableBookEdit"
          mode="advanced"
          accept="application/pdf"
          :multiple="false"
          pt:root:class="border-none!"
          @select="e => (file = e.files[0])"
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
            <div
              v-if="files.length > 0"
              class=" py-2 text-sm"
            >
              <div class="flex items-center gap-2">
                <Icon name="lucide:file" />
                <span>{{ files[0].name }}</span>
              </div>
            </div>
          </template>
        </PFileUpload>

        <div class="flex gap-4">
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/books"
            class="flex-1"
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            :loading="status === 'pending'"
            class="flex-1"
          />
        </div>
      </PForm>
      <div>
        <h2 class="mb-4 font-medium">Previsualización del libro</h2>
        <PdfPreview :pdf-url="book.media.url" :key="book.media.url" />
      </div>
    </section>
    <ElementNotFound
      v-if="!book && !loading"
      class="mt-4"
      element-type="manual"
      back-to-route="/admin/manuals"
      back-to-label="Volver a la lista de manuales"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import type { FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import PdfPreview from '~/components/content/PdfPreview.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CTextarea from '~/components/primitives/form/CTextarea.vue'
definePageMeta({
  layout: 'admin'
})
const { requiredFile, pdfFormat } = useFormValidators()
const route = useRoute()
const enableBookEdit = ref(true)
const { fetchBookById, updateBookItem } = useAdminLibraryStore()
const { updateMedia } = useMediaStore()
const {
  data: book,
  pending: loading,
  status,
  refresh
} = await useAsyncData('edit-book', () =>
  fetchBookById(+route.params.bookId)
)
const file = ref(undefined)
const bookFileForm = ref()

const initialValues = reactive({
  name: book.value?.name,
  description: book.value?.description,
  author: book.value?.author,
  source_url: book.value?.source_url
})

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    author: z.string().nonempty('El autor del libro es requerido'),
    source_url: z.string().url('La URL de la fuente no es válida')
  })
)

const saveBook = async (e: FormSubmitEvent) => {
  if (e.valid) {
    status.value = 'pending'
    await updateBookItem(+route.params.bookId, e.values)
    if (enableBookEdit.value && file.value) {
      await updateBookFile()
    }
    status.value = 'success'
    await refresh()
  }
}

const updateBookFile = async () => {
  if (file.value && book.value?.media?.id) {
    await updateMedia(file.value, book.value.media.id)
    enableBookEdit.value = false
  }
}
</script>
<style lang="scss" scoped></style>
