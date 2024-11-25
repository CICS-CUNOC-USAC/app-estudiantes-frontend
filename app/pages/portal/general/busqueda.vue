<template>
  <div>
    <nav class="space-x-4">
      <CButton
        icon="lucide:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="mb-4 text-muted-color lg:mb-2"
        to="/"
      />
      <CButton
        icon="lucide:layout-dashboard"
        variant="link"
        label="Ir a publicaciones"
        class="mb-4 text-muted-color lg:mb-2"
        to="/"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="lucide:search" class="mb-1 mr-1.5 inline-block" />
      Buscando:
      <span class="font-normal text-primary-500"> {{ route.query.q }} </span>
      en Ingeniería CUNOC
    </h1>

    <div
      v-if="data && status === 'success'"
      class="grid grid-cols-1 gap-4 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <CCardAlt
        v-for="item in data"
        :key="item.internal_link"
        :to="`/portal/post/${item.internal_link}`"
        class="hover:bg-surface-100 dark:hover:bg-surface-700"
      >
        <template #content>
          <h1 class="text-xl font-medium">
            <span v-html="highlightQuery(item.title)"></span>
          </h1>
          <p class="my-2 text-sm">
            Categoría: <span class="font-medium">{{ item.category }}</span>
          </p>
          <small class="block text-xs text-muted-color-emphasis">
            <span>Fecha publicación: </span>{{ item.posted_since }}
          </small>
        </template>
      </CCardAlt>
    </div>
    <div v-else-if="status === 'pending'" class="animate-pulse">
      <h1 class="text-xl font-medium">Cargando...</h1>
    </div>
    <div v-else-if="!data || status === 'error'">
      <CCardAlt>
        <template #content>
          <h1 class="text-xl font-medium">No se encontraron resultados</h1>
        </template>
      </CCardAlt>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'

const route = useRoute()

const { data, status } = await useAsyncData(
  'official-search',
  () =>
    $fetch('/api/official-search', {
      query: { search: route.query.q }
    }),
  {
    watch: [() => route.query.q]
  }
)

const highlightQuery = (title: string) => {
  const query = route.query.q?.toString() || ''
  if (!query) return title

  const regex = new RegExp(`(${query})`, 'gi')

  return title.replace(
    regex,
    '<span class="text-primary-500 font-semibold">$1</span>'
  )
}
</script>

<style lang="postcss" scoped></style>
