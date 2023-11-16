<template>
  <main>
    <h1 class="mb-4">
      <v-icon size="32" class="mr-2"> mdi-book-open-page-variant </v-icon>
      Libreria
    </h1>
    <p class="font-weight-light my-4">
      En esta sección podras encontrar libros de todos los temas que puedan
      ayudarte en tu carrera y sean de tu interes.
    </p>
    <UserLibraryView />
  </main>
</template>
<script setup lang="ts">
import UserLibraryView from '~/components/dashboard/UserLibraryView.vue'

definePageMeta({
  layout: 'dashboard'
})
</script>
<style lang="scss" scoped></style>
