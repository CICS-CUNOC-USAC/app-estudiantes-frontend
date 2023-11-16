<template>
  <main>
    <div v-if="book">
      <v-btn prepend-icon="mdi-arrow-left" class="my-3" @click="$router.back()">
        Regresar
      </v-btn>
      <h1 class="mb-4">{{ book?.name }}</h1>
      <p class="mb-4">
        {{ book?.description }}
      </p>
      <ClientOnly class="d-flex justify-center w-100">
        <PdfPreview :pdf-url="book.media.url" :show-zoom="false" fit-to-page />
        <template #fallback>
          <v-progress-circular indeterminate :size="50" :width="6" />
          <p class="font-weight-light">Cargando...</p>
        </template>
      </ClientOnly>
    </div>
    <ElementNotFound
      v-if="!book && !loading"
      element-type="manual"
      back-to-route="/manuals"
      back-to-label="Volver a la lista de manuales"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import PdfPreview from '~/components/content/PdfPreview.vue'
const { fetchBookById } = useUserLibraryStore()
const route = useRoute()
const { data: book, pending: loading } = await useLazyAsyncData(
  'edit-manual',
  () => fetchBookById(+route.params.bookId)
)
definePageMeta({
  layout: 'dashboard'
})
</script>
<style lang="scss" scoped></style>
