<template>
  <div>
    <h1 class="py-4 text-xl font-semibold">
      <Icon name="lucide:search" class="mb-1 inline" />
      Buscando:
      <span class="font-normal text-primary-500"> {{ route.query.q }} </span>
      en Ingeniería CUNOC
    </h1>

    <div
      v-if="data"
      class="grid grid-cols-1 gap-4 lg:grid-cols-3 2xl:grid-cols-4"
      :class="{
        'animate-pulse': status === 'pending'
      }"
    >
      <CCardAlt
        v-for="item in data"
        :key="item.internal_link"
        :to="`/portal/post/${item.internal_link}`"
        class="hover:bg-surface-100 dark:hover:bg-surface-700"
        interactive-inverse
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
  </div>
</template>

<script setup lang="ts">
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
