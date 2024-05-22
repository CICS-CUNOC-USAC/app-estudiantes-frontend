<template>
  <main>
    <h1 class="d-flex flex-column flex-md-row align-md-center align-start ga-4">
      <v-btn
        icon="mdi-arrow-left"
        density="comfortable"
        color="accent-2"
        :to="'/'"
      />
      Todas las publicaciones oficiales
    </h1>
    <OfficialPostsInfiniteView />
  </main>
</template>
<script setup lang="ts">
import OfficialPostsInfiniteView from '~/components/portal/OfficialPostsInfiniteView.vue'
</script>
<style lang="scss" scoped></style>
