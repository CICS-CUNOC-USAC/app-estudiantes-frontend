<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Generador de Horarios</h1>
      <p class="text-muted-foreground mt-1">Gestiona los horarios y importa datos</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <NuxtLink
        to="/admin/schedules-generator/data"
        class="p-6 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <div class="text-lg font-semibold">Datos</div>
        <p class="text-sm text-muted-foreground mt-1">Importar archivos CSV</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/schedules-generator/schedules"
        class="p-6 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <div class="text-lg font-semibold">Horarios</div>
        <p class="text-sm text-muted-foreground mt-1">Ver horarios generados</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/schedules-generator/reports"
        class="p-6 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <div class="text-lg font-semibold">Reportes</div>
        <p class="text-sm text-muted-foreground mt-1">Ver reportes de importación</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/schedules-generator/about"
        class="p-6 rounded-lg border border-border hover:bg-accent transition-colors"
      >
        <div class="text-lg font-semibold">Acerca de</div>
        <p class="text-sm text-muted-foreground mt-1">Información del módulo</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
