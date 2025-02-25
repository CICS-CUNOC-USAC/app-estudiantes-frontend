<template>
  <main>
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:bookshelf"
          class="mb-1 mr-1.5 inline-block"
        />
        Biblioteca (elementos digitales)
      </h1>
    </header>
    <p class="font-weight-light mt-2">
      En esta sección podrás encontrar todos los recursos digitales disponibles dentro de esta aplicación y también podrás descargarlos.
    </p>
    <UserLibraryView type="digital" />
  </main>
</template>
<script setup lang="ts">
import UserLibraryView from '~/components/dashboard/UserLibraryView.vue';
definePageMeta({
  layout: 'dashboard'
})
</script>
