<template>
  <section>
    <div
      class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr_1fr]"
    >
      <Button
        label="Nuevo libro"
        icon="icon-park-outline:plus"
        class="w-fit"
        :to="`/admin/books/create?type=${props.type}`"
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
        :items="categories?.results || []"
        label="Categoria"
        id="category"
        prepend-icon="icon-park-twotone:category-management"
        no-borders
        clearable
        option-label="name"
        option-value="id"
        :model-value="
          $route.query.category_id
            ? String($route.query.category_id)
            : undefined
        "
        @value-change="
          ($event: string | null) => {
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

    <DataTable
      :columns
      :data="data?.results || []"
      :total-elements="data?.meta?.total"
      :total-pages="data?.meta?.total_pages"
      :enable-sorting="false"
      :pagination-state="paginationOptions"
      @pagination-change="
        ($event) => {
          if (typeof $event === 'function') {
            paginationOptions = $event(paginationOptions)
          } else {
            paginationOptions = {
              ...paginationOptions,
              ...$event
            }
          }
        }
      "
    />
  </section>
</template>
<script setup lang="tsx">
import BookDetailDialog from '~/components/dialogs/BookDetailDialog.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import {
  deleteBook,
  fetchAllBooks,
  getAllCategories
} from '~/lib/api/admin/books'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Book } from '~/stores/admin-library'

const props = defineProps<{
  type: 'physical' | 'digital'
}>()

const route = useRoute()

const paginationOptions = computed({
  get: () => ({
    pageIndex: route.query.page ? Number(route.query.page) : 0,
    pageSize: route.query.limit ? Number(route.query.limit) : 10
  }),
  set: (value) => {
    navigateTo({
      query: {
        ...route.query,
        page: value.pageIndex,
        limit: value.pageSize
      }
    })
  }
})

const limit = computed(() => paginationOptions.value.pageSize)

const { data, status, refresh } = await useAsyncData(
  'outstanding-loans',
  () =>
    fetchAllBooks(
      {
        page: route.query.page ? Number(route.query.page) : 1,
        limit: limit.value,
        name: route.query.name,
        author: route.query.author,
        category_id: route.query.category_id
      },
      props.type
    ),
  {
    watch: [limit, () => route.query]
  }
)

const { data: categories } = useAsyncData('categories', () =>
  getAllCategories()
)

const handleDelete = async (id: number) => {
  await deleteBook(id)
  refresh()
}

const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'name',
    meta: {
      displayName: 'Nombre'
    },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div class=" ">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'author',
    meta: {
      displayName: 'Autor'
    },
    header: () => <div class="font-semibold">Autor</div>,
    cell: ({ row }) => <div class="">{row.getValue('author')}</div>
  },
  {
    accessorKey: 'description',
    meta: {
      displayName: 'Descripción'
    },
    header: () => <div class="font-semibold">Descripción</div>,
    cell: ({ row }) => (
      <p class="truncate text-sm">{row.getValue('description')}</p>
    )
  },
  {
    id: 'actions',
    meta: {
      displayName: 'Acciones'
    },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex flex-col items-center justify-center gap-y-2">
        <BookDetailDialog bookItem={row.original} showAllInfo={true}>
          <Button
            icon="icon-park-twotone:eyes"
            size="small"
            label="Detalles"
            variant="tonal"
          />
        </BookDetailDialog>
      </div>
    )
  }
]
</script>
