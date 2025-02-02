<template>
  <main class="pb-12"> 
    <nav class="space-x-4">
      <CButton
        v-if="fromSearch"
        icon="icon-park-outline:arrow-left"
        variant="link"
        :label="`Regresar a búsqueda &quot;${fromSearch}&quot;` "
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        :to="`/portal/general/cursos/programas?curso=${fromSearch}`"
      />
      <CButton
      v-else
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a programas"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/portal/general/cursos/programas"
      />
    </nav>
    <h1 class="mb-8 mt-2 text-xl font-semibold flex items-center">
      
      <span>
        <Icon
          name="lucide:file-text"
          class="mb-1 mr-1.5 inline-block"
        />
          Vista previa: Programa de curso #{{ id }}
        </span>

        <CButton
          icon="icon-park-twotone:download-three"
          variant="tonal"
          label="Descargar"
          class="ml-4"
          :href="`/api/pdfprogram?program=${id}`"
          target="_blank"
        />
    </h1>
    <div class="">

      <ClientOnly>
        <PdfPreview :pdf-url="`/api/pdfprogram?program=${id}`" />
      </ClientOnly>
    </div>
  </main>
</template>
<script setup lang="ts">
import PdfPreview from '~/components/content/PdfPreview.vue'
import CButton from '~/components/primitives/button/CButton.vue';

const route = useRoute()
const id = route.params.cursoId
const fromSearch = route.query.fromSearch
</script>
<style lang="scss" scoped></style>
