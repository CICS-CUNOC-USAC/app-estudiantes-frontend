<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Reportes</h1>
      <p class="text-muted-foreground mt-1">Ver historial e informes de importación</p>
    </div>

    <div class="p-6 border border-border rounded-lg text-center text-muted-foreground">
      <p>Los reportes se mostrarán aquí pronto</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  subject: ['all'],
  action: ['manage'],
})
</script>
