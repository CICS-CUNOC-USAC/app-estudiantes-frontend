<template>
  <div class="text-center">
    <h2 class="my-6">
      <v-icon>mdi-alert-outline</v-icon>
      Elemento no encontrado
    </h2>
    <p class="mb-2">
      Parece que el recurso de {{ elementType }} que buscas no existe o fue
      eliminado.
    </p>
    <NuxtLink :to="backToRoute" style="color: orangered; text-decoration: none">
      <v-icon>mdi-arrow-left</v-icon>
      <strong>{{ backToLabel }}</strong>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  elementType: string
  backToRoute: string
  backToLabel: string
}>()
</script>
<style lang="scss" scoped></style>
