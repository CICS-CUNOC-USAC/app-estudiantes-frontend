<template>
  <main>
    <h1 class=" text-xl font-semibold">
      <Icon name="icon-park-twotone:bookshelf" class="mb-1 mr-1.5 inline-block" />
      Librería
    </h1>
    <p class="font-light mt-2 mb-4">
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
