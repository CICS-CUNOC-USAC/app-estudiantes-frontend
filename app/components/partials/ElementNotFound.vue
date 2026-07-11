<template>
  <CMessage
    :title="title || 'Elemento no encontrado'"
    :subtitle="subtitle || `Parece que el recurso de ${elementType} que buscas no existe o fue eliminado.`"
    icon="icon-park-twotone:help"
    :backToRoute="backToRoute"
    :backToLabel="backToLabel"
    variant="destructive"
  />
</template>
<script setup lang="ts">
import CMessage from './CMessage.vue';

defineProps<{
  elementType?: string
  title?: string
  subtitle?: string
  backToRoute: string
  backToLabel: string
}>()
</script>
