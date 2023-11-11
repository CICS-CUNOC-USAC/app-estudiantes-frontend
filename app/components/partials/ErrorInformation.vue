<template>
  <div>
    <p>Oops! Ha ocurrido un error al cargar el manual.</p>
    <p class="text-overline">{{ error.cause }}</p>
    <v-btn color="primary" prepend-icon="mdi-refresh" @click="refresh"
      >Reintentar</v-btn
    >
  </div>
</template>
<script setup lang="ts">
defineProps<{
  error: Error
  refresh: () => void
}>()
</script>
<style lang="scss" scoped></style>
