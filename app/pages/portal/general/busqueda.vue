<template>
  <div>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="text-muted-color mb-4 lg:mb-2"
        to="/"
      />
      <CButton
        icon="lucide:layout-dashboard"
        variant="link"
        label="Ir a publicaciones"
        class="text-muted-color mb-4 lg:mb-2"
        to="/portal/general/publicaciones"
      />
    </nav>
    <h1 class="py-3 text-xl font-semibold" v-if="route.query.q">
      <Icon name="lucide:search" class="mr-1.5 mb-1 inline-block" />
      Buscando:
      <span class="text-primary-400 font-normal"> {{ route.query.q }} </span>
      en Ingeniería CUNOC
    </h1>
    <h1 class="mt-4 py-3 text-center font-semibold" v-else>
      <Icon name="lucide:info" class="mr-1.5 mb-1 inline-block" />
      Utiliza el botón de búsqueda en la parte superior o haz clic
      <button @click="$emit('search')" class="text-primary-400">aquí</button>
      para encontrar publicaciones oficiales
    </h1>

    <div
      v-if="data && status === 'success' && route.query.q"
      class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-2"
    >
      <p
        v-if="!data.length"
        class="text-muted-color-emphasis col-span-2 mt-6 text-center"
      >
        <Icon name="lucide:inbox" class="mr-1.5 mb-1 inline-block" />
        Parece que no hay resultados para ésta búsqueda, puedes
        <button class="text-primary-600" @click="$emit('search')">
          intentar
        </button>
        con otro término
      </p>
      <NuxtLink
        v-for="(item, index) in data"
        :key="index"
        class="group bg-surface-50 hover:bg-primary-50 flex flex-col gap-2 rounded-xl border border-black p-5 transition active:translate-x-1 active:translate-y-1 dark:bg-neutral-900 dark:hover:bg-zinc-700/60"
        :to="`/portal/post/${item.internal_link}?fromSearch=${route.query.q}`"
      >
        <div class="flex-1 space-y-3">
          <h1 class="text-xl font-semibold">
            <span v-html="highlightQuery(item.title)"></span>
          </h1>
          <p class="text-muted-color-emphasis">
            Categoría:
            <span class="text-color font-medium">{{ item.category }}</span>
          </p>
        </div>
        <small class="text-muted-color block"
          >Fecha: <strong>{{ item.posted_since }}</strong></small
        >
        <span class="text-primary-emphasis-alt">
          Leer
          <Icon
            name="icon-park-outline:arrow-right"
            class="mb-0.5 inline-block transition-transform group-hover:translate-x-1"
          />
        </span>
      </NuxtLink>
      <!-- <CCardAlt
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
      </CCardAlt> -->
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
    '<span class="text-primary-400 font-semibold">$1</span>'
  )
}

useHead({
  title: () =>
    route.query.q
      ? `"${route.query.q}" en Ingeniería CUNOC | CICS App`
      : 'Busqueda de publicaciones | CICS App'
})

definePageMeta({
  title: 'Búsqueda'
})
</script>

<style lang="postcss" scoped></style>
