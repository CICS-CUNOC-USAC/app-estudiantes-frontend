<template>
  <div class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        <Icon
          name="icon-park-twotone:peoples"
          class="mr-1.5 mb-1 inline-block"
        />
        Generador de Horarios
      </h1>
      <p class="mt-2">Gestiona los horarios y importa datos</p>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <CCardAlt
        title="Datos"
        description="Importar archivos CSV"
        to="/admin/schedules-generator/data"
        header-icon="icon-park-twotone:data"
        interactive
      >
      </CCardAlt>

      <CCardAlt
        title="Horarios"
        description="Ver horarios generados"
        to="/admin/schedules-generator/schedules"
        header-icon="icon-park-twotone:calendar"
        interactive
      />

      <CCardAlt
        title="Reportes"
        description="Ver reportes de importación"
        to="/admin/schedules-generator/reports"
        header-icon="icon-park-twotone:chart-histogram-two"
        interactive
      />

      <CCardAlt
        title="Acerca de"
        description="Información del módulo"
        to="/admin/schedules-generator/about"
        header-icon="icon-park-twotone:info"
        interactive
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'

definePageMeta({
  layout: 'admin',
  subject: ['all'],
  action: ['manage'],
})
</script>
