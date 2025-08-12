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
    <!-- <ContentDisplay :data v-if="data && status === 'success'" /> -->
    <main v-if="data && status === 'success'">
      <h1 class="py-3 text-xl font-semibold">
        <Icon name="lucide:book" class="mr-1.5 mb-1 inline-block" />
        {{ data.name }}
      </h1>
      <div class="content-renderer mx-auto">
        <StrapiBlocks :content="data.content" v-if="data.content" />
      </div>
    </main>
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
import { StrapiBlocks } from 'vue-strapi-blocks-renderer'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import type { ContentManual } from '~/lib/api/strapi/types'

const route = useRoute()

const { data, status } = await useAsyncData<ContentManual>('manuals', () =>
  $strapi(`/manuals/${route.params.slug}`, {
    params: {
      "populate[author]": "*",
    }
  })
)

const handlePrint = () => {
  window.print()
}

useCustomPageTitle(data.value?.name ? `Manual - ${data.value?.name}` : 'Manual')
definePageMeta({
  title: 'Manual'
})
</script>
<style></style>
