<template>
  <main>
    <nav class="space-x-4">
      <CButton
          icon="lucide:arrow-left"
          variant="link"
          label="Regresar al inicio"
          class="mb-4 text-muted-color-emphasis lg:mb-2"
          to="/"
        />
      <CButton
          icon="lucide:search"
          variant="link"
          label="Buscar publicaciones"
          class="mb-4 text-muted-color-emphasis lg:mb-2"
          @click="$emit('search')"
        />
    </nav>
    <h1 class="py-3  text-xl font-semibold">
      <Icon name="lucide:layout-dashboard" class="mb-1 mr-1.5 inline-block" />
      Todas las publicaciones oficiales
    </h1>
    <OfficialPostsInfiniteView />
  </main>
</template>
<script setup lang="ts">
import OfficialPostsInfiniteView from '~/components/portal/OfficialPostsInfiniteView.vue'
import CButton from '~/components/primitives/button/CButton.vue';
</script>
<style lang="scss" scoped></style>
