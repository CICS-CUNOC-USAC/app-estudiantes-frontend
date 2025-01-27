<template>
  <section>
    <div class="grid grid-cols-1 gap-2 pb-4 md:grid-cols-3">
      <CInputText
        label="Nombre del libro"
        id="name"
        prepend-icon="icon-park-twotone:doc-search-two"
        clear-button
        no-borders
        :default-value="$route.query.name"
        @input="
          ($event: Event) => {
            useDebounceFn(() => {
              $router.push({
                query: {
                  ...$route.query,
                  name: ($event.target as HTMLInputElement).value || undefined
                }
              })
            }, 500)()
          }
        "
        @clear="
          () => {
            $router.push({
              query: {
                ...$route.query,
                name: undefined
              }
            })
          }
        "
      />
      <CInputText
        label="Autor"
        id="author"
        prepend-icon="icon-park-twotone:people-search"
        clear-button
        no-borders
        :default-value="$route.query.author"
        @input="
          ($event: Event) => {
            useDebounceFn(() => {
              $router.push({
                query: {
                  ...$route.query,
                  author: ($event.target as HTMLInputElement).value || undefined
                }
              })
            }, 500)()
          }
        "
        @clear="
          () => {
            $router.push({
              query: {
                ...$route.query,
                author: undefined
              }
            })
          }
        "
      />
    </div>

    <PDataTable
      :value="data?.results"
      :loading="status === 'pending'"
      :rows="limit"
      :first="currentPage"
      :total-records="data?.meta?.total"
      :rows-per-page-options="rowOptions"
      row-hover
      lazy
      paginator
      @page="
        ($event) =>
          $router.push({ query: { ...$route.query, page: $event.page + 1 } })
      "
      @update:rows="limit = $event"
    >
      <PColumn field="name" header="Nombre" class="text-center"> </PColumn>
      <PColumn field="author" header="Autor" class="text-center"></PColumn>
      <PColumn
        field="description"
        header="Descripcion"
        class="text-center"
      ></PColumn>
      <PColumn field="" header="Acciones" class="w-32 text-center">
        <template #body="slotProps">
          <div class="flex flex-col items-center justify-center gap-y-2">
            <CButton
              :to="`/dashboard/books/${slotProps.data.id}`"
              icon="lucide:eye"
              fluid
              size="small"
              variant="tonal"
              label="Ver"
            />
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>

<script setup lang="ts">
import { fetchAllBooks } from '~/lib/api/books'
import CButton from '../primitives/button/CButton.vue'
import CInputText from '../primitives/form/CInputText.vue'

const route = useRoute()

const rowOptions = [5, 10, 25, 50]
const limit = ref(rowOptions[0])
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

const { data, status } = await useAsyncData(
  () =>
    fetchAllBooks({
      page: route.query.page ? Number(route.query.page) : 1,
      limit: limit.value,
      name: route.query.name,
      author: route.query.author
    }),
  {
    watch: [limit, () => route.query]
  }
)
</script>
<style lang="postcss" scoped></style>
