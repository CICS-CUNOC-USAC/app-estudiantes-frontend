<template>
  <main>
    <div v-if="book">
      <v-row class="mb-1" no-gutters>
        <v-col cols="12" md="2" class="mr-2 my-2">
          <v-btn block prepend-icon="mdi-arrow-left" @click="$router.back()">
            Regresar
          </v-btn>
        </v-col>
        <v-col cols="12" md="2" class="mr-2 my-2">
          <v-btn
            block
            color="gray"
            :href="book.media.url"
            target="_blank"
            prepend-icon="mdi-download"
          >
            Descargar
          </v-btn>
        </v-col>
      </v-row>

      <h1 class="mb-4">{{ book?.name }}</h1>
      <p class="mb-4">
        {{ book?.description }}
      </p>
      <h2 class="mb-4">Autor</h2>
      <p class="mb-4">
        {{ book?.author }}
      </p>
      <!-- <a
        :href="`https://www.google.com/search?q=${book?.author}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-btn color="primary" class="mb-4">
          Buscar más libros de {{ book?.author }}
        </v-btn>
      </a> -->

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
