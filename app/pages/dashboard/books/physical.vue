<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:bookshelf"
          class="mb-1 mr-1.5 inline-block"
        />
        Biblioteca (elementos físicos)
      </h1>
    </header>
    <p class="font-weight-light mt-2">
      En esta sección podrás encontrar información sobre los libros físicos que se encuentran disponibles en la biblioteca del Módulo de Ingeniería para consultar su disponibilidad y más detalles.
    </p>
    <UserLibraryView type="physical" />
  </main>
</template>
<script setup lang="ts">
import UserLibraryView from '~/components/dashboard/UserLibraryView.vue';
definePageMeta({
  layout: 'dashboard'
})
</script>
