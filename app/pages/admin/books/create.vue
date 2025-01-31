<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon name="icon-park-twotone:book" class="mr-1.5 mb-1 inline-block" />
        Crear item de biblioteca
      </h1>
    </header>
    <section class="mt-4">
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

        <h5 class="font-medium">Archivo del libro</h5>
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

        <div class="flex gap-4">
          <CButton
            label="Cancelar"
            icon="icon-park-outline:arrow-left"
            to="/admin/books"
            class=""
          />
          <CButton
            label="Guardar"
            icon="icon-park-outline:check"
            type="submit"
            class=""
          />
        </div>
      </PForm>
    </section>
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
import { createBookItem } from '~/lib/api/admin/books'
definePageMeta({
  layout: 'admin'
})

const file = ref()

const initialValues = reactive({
  name: '',
  description: '',
  author: '',
  source_url: ''
})

const resolver = zodResolver(
  z.object({
    name: z.string().nonempty('El nombre del libro es requerido'),
    description: z.string().nonempty('La descripción del libro es requerida'),
    author: z.string().nonempty('El autor del libro es requerido'),
    source_url: z.string().url('La URL de la fuente no es válida'),
  })
)

const saveBook = async (e: FormSubmitEvent) => {
  if (e.valid && file.value) {
    await createBookItem({
      ...e.values as Omit<BookPayload, 'file'>,
      file: file.value
    })
    navigateTo('/admin/books')
  }
}
</script>
<style lang="scss" scoped></style>
