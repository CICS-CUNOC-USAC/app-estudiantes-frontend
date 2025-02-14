<template>
  <main class="">
    <nav
      class="mb-4 flex flex-wrap gap-x-3 print:hidden"
      v-if="data && status === 'success'"
    >
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a manuales"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/recursos/manuales"
      />
      <CButton
        icon="icon-park-twotone:printer"
        variant="link"
        label="Imprimir/Guardar este manual"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        @click="handlePrint"
      />
    </nav>
    <ContentDisplay :data v-if="data && status === 'success'" />
    <ElementNotFound
      v-else-if="status === 'error' && !data"
      title="Manual no encontrado"
      subtitle="Parece que el manual que buscas no existe o no está disponible."
      back-to-label="Regresar a manuales"
      back-to-route="/portal/recursos/manuales"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import ContentDisplay from '~/components/portal/ContentDisplay.vue'
import CButton from '~/components/primitives/button/CButton.vue'

const route = useRoute()

const { data, status } = await useAsyncData(() =>
  queryCollection('content').where('path', 'LIKE', `%${route.params.manualId}`).first()
)

const handlePrint = () => {
  window.print()
}

useCustomPageTitle(
  data.value?.title ? `Manual - ${data.value?.title}` : 'Manual'
)
definePageMeta({
  title: 'Manual',
})
</script>
<style></style>
