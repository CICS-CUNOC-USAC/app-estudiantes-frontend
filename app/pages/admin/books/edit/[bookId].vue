<template>
  <main>
    <h1 class="mb-4">Editar libro</h1>
    <v-skeleton-loader v-if="loading" type="heading, paragraph, actions" />
    <div v-if="book && !loading">
      <v-row>
        <v-col cols="12" md="10">
          <v-row>
            <v-col cols="12" :md="true">
              <v-text-field v-model="book.name" label="Nombre"></v-text-field>
            </v-col>
            <v-col cols="12" :md="true">
              <v-textarea
                v-model="book.description"
                label="Descripción"
                no-resize
                :rows="2"
              ></v-textarea>
            </v-col>
            <v-col cols="12" :md="true">
              <v-text-field v-model="book.author" label="Autor"></v-text-field>
            </v-col>
            <v-col cols="12" :md="true">
              <v-text-field
                v-model="book.source_url"
                label="URL de fuente"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="2" align-self="center">
          <div class="d-flex flex-column justify-center" style="gap: 12px">
            <v-btn prepend-icon="mdi-arrow-left" to="/admin/books"
              >Cancelar</v-btn
            >
            <v-btn prepend-icon="mdi-content-save-outline" @click="saveBook"
              >Guardar</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="6" md="3">
              <v-checkbox-btn
                v-model="enableBookEdit"
                label="Actualizar archivo de libro?"
              ></v-checkbox-btn>
            </v-col>
            <v-col v-if="enableBookEdit" cols="6">
              <v-form ref="bookFileForm">
                <v-file-input
                  v-model="file"
                  accept="application/pdf"
                  :multiple="false"
                  label="Archivo PDF"
                  :rules="[requiredFile, pdfFormat]"
                  variant="underlined"
                  density="comfortable"
                ></v-file-input>
              </v-form>
            </v-col>
            <v-col v-if="enableBookEdit" cols="12" md="3" align-self="center">
              <v-btn
                prepend-icon="mdi-upload-outline"
                color="black"
                variant="tonal"
                block
                @click="updateBookFile"
              >
                Subir
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="!enableBookEdit" cols="12">
          <div v-if="book.media">
            <h3 class="mb-4">Previsualización del libro</h3>

            <ClientOnly class="d-flex justify-center">
              <PdfPreview :pdf-url="book.media.url" />
              <template #fallback>
                <v-progress-circular indeterminate :size="50" :width="6" />
                <p class="font-weight-light">Cargando...</p>
              </template>
            </ClientOnly>
          </div>
        </v-col>
      </v-row>
    </div>
    <ElementNotFound
      v-if="!book && !loading"
      element-type="manual"
      back-to-route="/admin/manuals"
      back-to-label="Volver a la lista de manuales"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import PdfPreview from '~/components/content/PdfPreview.vue'
definePageMeta({
  layout: 'admin'
})
const { requiredFile, pdfFormat } = useFormValidators()
const route = useRoute()
const enableBookEdit = ref(false)
const { fetchBookById, updateBookItem } = useAdminLibraryStore()
const { updateMedia } = useMediaStore()
const {
  data: book,
  pending: loading,
  refresh
} = await useLazyAsyncData('edit-book', () =>
  fetchBookById(+route.params.bookId)
)
const file = ref(undefined)
const bookFileForm = ref()

const saveBook = async () => {
  if (book.value) {
    const { name, description, author, source_url } = book.value
    updateBookItem(+route.params.bookId, {
      name,
      description,
      author,
      source_url
    })
    await refresh()
  }
}

const updateBookFile = async () => {
  const { valid } = await bookFileForm.value.validate()
  if (!valid) return
  if (file.value && book.value?.media?.id) {
    loading.value = true
    await updateMedia(file.value[0], book.value.media.id)
    loading.value = false
    await refresh()
    enableBookEdit.value = false
  }
}
</script>
<style lang="scss" scoped></style>
