<template>
  <section>
    <div
      class="grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr] sticky top-0 z-10"
    >
      <CButton
        label="Nuevo libro"
        icon="icon-park-outline:plus"
        class="w-fit"
        to="/admin/books/create"
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
            <CButton
              :to="`/admin/books/edit/${slotProps.data.id}`"
              icon="icon-park-twotone:edit"
              fluid
              size="small"
              variant="tonal"
              label="Editar"
            />
            <DeleteItemDialog @confirm="() => handleDelete(slotProps.data.id)">
              <CButton
                icon="icon-park-twotone:delete"
                fluid
                size="small"
                variant="tonal"
                label="Eliminar"
              />
            </DeleteItemDialog>
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>
<script setup lang="ts">
import DeleteItemDialog from '@/components/dialogs/DeleteItemDialog.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { fetchAllBooks, deleteBook } from '~/lib/api/admin/books'

const route = useRoute()

const limit = ref(5)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

const { data, status, refresh } = await useAsyncData(
  'admin-books',
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

const handleDelete = async (id: number) => {
  await deleteBook(id)
  refresh()
}
</script>
