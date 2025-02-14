<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/"
      />
      <CButton
        icon="icon-park-twotone:search"
        variant="link"
        label="Buscar publicaciones"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        @click="$emit('search')"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon
        name="icon-park-twotone:view-grid-list"
        class="mr-1.5 mb-1 inline-block"
      />
      Todas las publicaciones oficiales
    </h1>
    <OfficialPostsInfiniteView />
  </main>
</template>
<script setup lang="ts">
import OfficialPostsInfiniteView from '~/components/portal/OfficialPostsInfiniteView.vue'
import CButton from '~/components/primitives/button/CButton.vue'

useCustomPageTitle('Publicaciones oficiales')
definePageMeta({
  title: 'Publicaciones oficiales'
})
</script>
