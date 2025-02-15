<template>
  <section>
    <div
      class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr_1fr]"
    >
      <CButton
        label="Nuevo libro"
        icon="icon-park-outline:plus"
        class="w-fit"
        :to="`/dashboard/books/create?type=${props.type}`"
      />
      <CInputText
        label="Nombre del libro"
        id="name"
        class="h-12"
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
        class="h-12"
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
      <CSelect
        :items="categories?.results"
        label="Categoria"
        id="category"
        prepend-icon="icon-park-twotone:category-management"
        no-borders
        clearable
        checkmark
        option-label="name"
        option-value="id"
        @value-change="
          ($event: number | null) => {
            $router.push({
              query: {
                ...$route.query,
                category_id: $event || undefined
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
      :rows-per-page-options="[5, 10, 25, 50]"
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
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>
<script setup lang="ts">
import { fetchAllBooks, getAllCategories } from '~/lib/api/books'
import CButton from '../primitives/button/CButton.vue'
import CInputText from '../primitives/form/CInputText.vue'

const route = useRoute()

const props = defineProps<{
  type: 'physical' | 'digital'
}>()

const limit = ref(5)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

const { data: categories } = useAsyncData('categories', () =>
  getAllCategories()
)

const { data, status } = await useAsyncData(
  () =>
    fetchAllBooks(
      {
        page: route.query.page ? Number(route.query.page) : 1,
        limit: limit.value,
        name: route.query.name,
        author: route.query.author
      },
      props.type
    ),
  {
    watch: [limit, () => route.query]
  }
)
</script>
<style lang="postcss" scoped></style>
