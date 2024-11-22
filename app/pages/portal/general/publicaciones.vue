<template>
  <main>
    <CButton
        icon="mdi-arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-4 text-muted-color lg:mb-2"
        to="/"
      />
    <h1 class="py-4  text-xl font-semibold">
      <Icon name="lucide:layout-dashboard" class="mb-1" />
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
