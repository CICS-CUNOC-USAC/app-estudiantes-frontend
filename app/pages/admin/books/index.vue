<template>
  <main>
    <h1 class="mb-4">
      <v-icon size="32" class="mr-2"> mdi-book-open-page-variant </v-icon>
      Libreria
    </h1>
    <p class="font-weight-light my-4">
      En esta sección se podrán administrar todos los recursos de libros
      disponibles en el portal de estudiantes (Solo usuarios registrados).
    </p>
    <LibraryView />
  </main>
</template>
<script setup lang="ts">
import LibraryView from '@/components/admin/library/LibraryView.vue'
definePageMeta({
  layout: 'admin'
})
</script>
<style lang="scss" scoped></style>
