<template>
  <div>
    <v-btn
      icon="mdi-arrow-left"
      size="small"
      class="mr-2"
      @click="() => $router.push(`/portal/general/cursos/programas`)"
    ></v-btn>
    <v-btn
      prepend-icon="mdi-download"
      :href="`/api/pdfprogram?program=${id}`"
      target="_blank"
      >Descargar</v-btn
    >
    <h1>Programa de curso</h1>
    <p>Curso: {{ id }}</p>
    <ClientOnly>
      <PdfPreview :pdf-url="`/api/pdfprogram?program=${id}`" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import PdfPreview from '~/components/content/PdfPreview.vue'

const route = useRoute()
const id = route.params.cursoId
</script>
<style lang="scss" scoped></style>
