<template>
  <div class="flex items-center gap-2 rounded-md border bg-red-50 px-3 py-2">
    <Icon name="icon-park-twotone:help" class="text-red-600"/>
    <div class="">
      <h2 class="font-semibold">Elemento no encontrado</h2>
      <p class="text-red-600">
        Parece que el recurso de {{ elementType }} que buscas no existe o fue
        eliminado.
      </p>
      <CButton
      class="mt-2"
        :label="backToLabel"
        variant="link"
        icon="icon-park-outline:arrow-left"
        :to="backToRoute"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from '../primitives/button/CButton.vue'

defineProps<{
  elementType: string
  backToRoute: string
  backToLabel: string
}>()
</script>
<style lang="scss" scoped></style>
