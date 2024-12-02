<template>
  <main>
    <h1 class="mb-4">Manuales</h1>
    <p class="font-weight-light my-4">
      En esta sección podrás encontrar todos los manuales que pueden ayudarte a
      lo largo de tu carrera.
    </p>
    <!-- <ManualsView /> -->
    <div v-if="data" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NuxtLink v-for="manual in data" :key="manual._id" class="border p-3 mb-3" :to="`/portal/recursos/manuales/${manual._path.split('/').pop()}`">
        <h2
          
        >{{ manual.title }}</h2>
        <p>{{ manual.description }}</p>
      </NuxtLink>
    </div>
    <HelpDialog title="Manuales" :content="content_help"></HelpDialog>
  </main>
</template>
<script setup lang="ts">
import ManualsView from '~/components/portal/ManualsView.vue'
import HelpDialog from '@/components/dialogs/help/HelpDialog.vue'

// const { data } = useAsyncData(() =>
//   fetchContentNavigation({
//     where: {
//       _path: { $contains: '/manuals' }
//     }
//   })
// )
const { data } = useAsyncData(() =>
  queryContent().where({
    _path: { $contains: '/manuals' }
  }).without(['body']).find()
)

const content_help = `Los Manuales es la seccion de la Aplicacion para Estdiantes que permite la visualizacion de Manuales creados con el fin de ayudar al estudiantado
  ## Funcionamiento:
  ### Busqueda:
  Para poder buscar un manual basta con ingresar su nombre en la barra de busqueda.
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)`
</script>
<style lang="scss" scoped></style>
