<template>
  <div>
    <v-btn
      prepend-icon="mdi-arrow-left"
      @click="() => $router.push(`/portal/general/cursos/programas`)"
      >Regresar</v-btn
    >
    <h1>Programa de curso</h1>
    <p>Curso: {{ id }}</p>
    <ClientOnly>
      <PdfPreview
        :pdf-url="`/api/pdfprogram?program=${id}`"
      />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import PdfPreview from '~/components/content/PdfPreview.vue'

const route = useRoute()
const id = route.params.cursoId
</script>
<style lang="scss" scoped></style>
