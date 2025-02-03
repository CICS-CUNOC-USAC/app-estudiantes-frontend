<template>
  <main>
    <div v-if="book">
      <nav class="mb-4 flex flex-wrap gap-x-3 print:hidden">
        <CButton
          icon="icon-park-outline:arrow-left"
          variant="link"
          label="Regresar a libros"
          class="text-muted-color-emphasis mb-4 lg:mb-2"
          to="/dashboard/books"
        />
        <CButton
          icon="icon-park-twotone:download-three"
          variant="link"
          label="Descargar este libro"
          class="text-muted-color-emphasis mb-4 lg:mb-2"
          target="_blank"
          :href="book.media.url"
        />
      </nav>
      <h1 class="mb-1.5 text-xl font-semibold">
        <Icon name="icon-park-twotone:bookshelf" class="mr-1.5 mb-1 inline-block" />
        Libro: {{ book.name }}
      </h1>
      <p class="mb-1.5">
        <Icon name="icon-park-twotone:info" class="mr-1.5 mb-0.5 inline-block" size="16" />
        <span class="text-sm">Descripción:</span>
        {{ book?.description }}
      </p>
      <p class="mb-1.5">
        <Icon name="icon-park-twotone:people" class="mr-1.5 mb-0.5 inline-block" size="16" />
        <span class="text-sm">Autor:</span>
        {{ book?.author }}
      </p>

      <ClientOnly >
        <PdfPreview class="mt-4" :pdf-url="book.media.url" :show-zoom="false" fit-to-page />
        <template #fallback>
          <p class="font-weight-light">Cargando...</p>
        </template>
      </ClientOnly>
    </div>
    <ElementNotFound
      v-if="!book && !loading"
      element-type="biblioteca"
      back-to-route="/dashboard/books"
      back-to-label="Volver a la lista de libros"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '@/components/partials/ElementNotFound.vue'
import PdfPreview from '~/components/content/PdfPreview.vue'
import CButton from '~/components/primitives/button/CButton.vue'
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

