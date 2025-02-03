<template>
  <main class="">
    <nav class="mb-4 flex flex-wrap gap-x-3 print:hidden">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a manuales"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/portal/recursos/manuales"
      />
      <CButton
        icon="icon-park-twotone:printer"
        variant="link"
        label="Imprimir/Guardar este manual"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        @click="handlePrint"
      />
    </nav>
    <ContentDisplay :data />
  </main>
</template>
<script setup lang="ts">
import ContentDisplay from '~/components/portal/ContentDisplay.vue'
import CButton from '~/components/primitives/button/CButton.vue'

const route = useRoute()

const { data } = await useAsyncData(() =>
  queryContent('manuals')
    .where({
      _path: { $contains: route.params.manualId }
    })
    .findOne()
)

const handlePrint = () => {
  window.print()
}

useHead({
  title: `Manual - ${data.value?.title}` || 'Manual',
})
</script>
<style>
</style>
