<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">Acerca de</h1>
      <p class="text-muted-foreground mt-1">Información del módulo Generador de Horarios</p>
    </div>

    <div class="p-6 border border-border rounded-lg space-y-4">
      <div>
        <h2 class="text-xl font-semibold mb-2">Descripción</h2>
        <p class="text-muted-foreground">
          Este módulo te ayuda a gestionar horarios de cursos importando datos de docentes, cursos y aulas.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-2">Características</h2>
        <ul class="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Importar información de docentes</li>
          <li>Importar datos de cursos</li>
          <li>Asignar docentes a cursos</li>
          <li>Gestionar asignaciones de aulas y laboratorios</li>
          <li>Ver reportes de importación</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-semibold mb-2">Empezar</h2>
        <p class="text-muted-foreground">
          Visita la sección <NuxtLink to="/admin/schedules-generator/data" class="text-primary hover:underline">Datos</NuxtLink> para subir tus archivos CSV.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>
