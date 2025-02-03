<template>
  <main>
    <nav class="space-x-4">
      <CButton
          icon="icon-park-outline:arrow-left"
          variant="link"
          label="Regresar al inicio"
          class="mb-4 text-muted-color-emphasis lg:mb-2"
          to="/"
        />
    </nav>
    <h1 class="py-3  text-xl font-semibold">
      <Icon name="lucide:book" class="mb-1 mr-1.5 inline-block" />
      Manuales disponibles
    </h1>
    <p class="font-weight-light my-4">
      En esta sección podrás encontrar todos los manuales que pueden ayudarte a
      lo largo de tu carrera.
    </p>
    <div v-if="data" class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <CCardAlt
        v-for="manual in data"
        :to="`/portal/recursos/manuales/${manual._path.split('/').pop()}`"
        class="hover:bg-primary-200 dark:hover:bg-primary-900/50"
        interactive-inverse
        :key="manual._id"
      >
      <template #title>
        <Icon name="lucide:book" class="mb-1 mr-1.5 inline-block" />
        <h3 class="text-lg font-semibold py-2">{{ manual.title }}</h3>
      </template>
      <template #content>
        <p 
        class="text-sm truncate"
        >{{ manual.description }}</p>
      </template>
    </CCardAlt>
    </div>  
  </main>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CButton from '~/components/primitives/button/CButton.vue';

// const { data } = useAsyncData(() =>
//   fetchContentNavigation({
//     where: {
//       _path: { $contains: '/manuals' }
//     }
//   })
// )
const { data } = useAsyncData(() =>
  queryContent()
    .where({
      _path: { $contains: '/manuals' }
    })
    .without(['body'])
    .find()
)
</script>
