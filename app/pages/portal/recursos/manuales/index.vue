<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="lucide:book" class="mr-1.5 mb-1 inline-block" />
      Manuales disponibles
    </h1>
    <p class="font-weight-light my-4">
      En esta sección podrás encontrar todos los manuales que pueden ayudarte a
      lo largo de tu carrera.
    </p>
    <div v-if="data" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <CCardAlt
        v-for="manual in data.data"
        :to="`/portal/recursos/manuales/${manual.slug}`"
        class="hover:bg-primary-200 dark:hover:bg-primary-900/50"
        interactive-inverse
        :key="manual.documentId"
      >
        <template #title>
          <Icon name="lucide:book" class="mr-1.5 mb-1 inline-block" />
          <h3 class="py-2 text-lg font-semibold">{{ manual.name }}</h3>
        </template>
        <template #content>
          <p class="truncate text-sm">{{ manual.description }}</p>
        </template>
      </CCardAlt>
    </div>
  </main>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import type { Strapi5ResponseMany } from '@nuxtjs/strapi'
import type { ContentManual } from '~/lib/api/strapi/types'

// const { data } = useAsyncData(() =>
//   queryCollection('manuals')
//   .select('id', 'title', 'description', 'path')
//   .all()
// )
const { data } = await useAsyncData<Strapi5ResponseMany<ContentManual>>(
  'public-manuals',
  () => $strapi('/manuals')
)

useCustomPageTitle('Manuales')
definePageMeta({
  title: 'Manuales'
})
</script>
