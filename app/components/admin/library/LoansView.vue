<template>
  <section>
    <div
      class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr_1fr]"
    >
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
        :model-value="$route.query.category_id ? String($route.query.category_id) : undefined"
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

    <DataTable
      :columns
      :data="data || []"
      :total-elements="data?.length"
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
import LoanActionDialog from '~/components/dialogs/admin/loans/LoanActionDialog.vue'
import BookDetailDialog from '~/components/dialogs/BookDetailDialog.vue'
import LoanDetailDialog from '~/components/dialogs/LoanDetailDialog.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import { getAllCategories } from '~/lib/api/admin/books'
import {
  fetchAllOutstandingLoans,
  fetchAllReturnedLoans
} from '~/lib/api/admin/loans'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Loan } from '~/lib/api/admin/loans'

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
  'admin-books',
  () =>
    fetchAllOutstandingLoans({
      page: route.query.page ? Number(route.query.page) : 1,
      limit: limit.value,
      name: route.query.name,
      author: route.query.author,
      category_id: route.query.category_id
    }),
  {
    watch: [limit, () => route.query]
  }
)

const {
  data: returnedLoans,
  status: returnedStatus,
  refresh: refreshReturned
} = await useAsyncData(
  'returned-loans',
  () =>
    fetchAllReturnedLoans({
      page: route.query.page ? Number(route.query.page) : 1,
      limit: limit.value,
      name: route.query.name,
      author: route.query.author,
      category_id: route.query.category_id
    }),
  {
    watch: [limit, () => route.query]
  }
)

const { data: categories } = useAsyncData('categories', () =>
  getAllCategories()
)

const dialog = useDialog()
function openDetail(bookItem: any, showAllInfo: any) {
  dialog.open(BookDetailDialog, {
    header: 'Información del libro',
    style: {
      width: '50vw'
    },
    props: {
      modal: true,
      dismissableMask: true
    },
    data: { bookItem, showAllInfo },
    onClose: () => { }
  })
}

const columns: ColumnDef<Loan>[] = [
  {
    accessorKey: 'library_reference_id',
    meta: {
      displayName: 'Referencia'
    },
    header: () => <div class="text-center font-semibold w-52">Referencia</div>,
    cell: ({ row }) => <div class="text-center w-52">{row.getValue('library_reference_id')}</div>
  },
  {
    accessorKey: 'library_reference.book.name',
    meta: {
      displayName: 'Nombre'
    },
    header: () => <div class="text-center font-semibold w-52">Nombre</div>,
    cell: ({ row }) => <div class="text-center w-52">{(row.original.library_reference as any).book?.name}</div>
  },
  {
    accessorKey: 'library_reference.book.author',
    meta: {
      displayName: 'Autor'
    },
    header: () => <div class="text-center font-semibold w-60">Autor</div>,
    cell: ({ row }) => <div class="text-center w-60">{(row.original.library_reference as any).book?.author}</div>
  },
  {
    accessorKey: 'place',
    meta: {
      displayName: 'Lugar'
    },
    header: () => <div class="text-center font-semibold w-60">Lugar</div>,
    cell: ({ row }) => <div class="text-center w-60">{row.getValue('place')}</div>
  },
  {
    accessorKey: 'id',
    meta: {
      displayName: 'Identificación'
    },
    header: () => <div class="text-center font-semibold truncate max-w-0">Identificación</div>,
    cell: ({ row }) => (
      <p class="truncate text-sm">
            {
              (row.getValue('ra')?.length ?? 0 > 0)
                ? row.getValue('ra')
                : row.getValue('personal_id')
            }
          </p>
    )
  },
  {
    id: 'actions',
    meta: {
      displayName: 'Acciones'
    },
    header: () => <div class="text-center font-semibold w-32">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex flex-col items-center justify-center gap-y-2">
        <LoanDetailDialog
          title={row.original.name}
          loanItem={row.original}
          showAllInfo
        >
          <Button
            icon="lucide:receipt-text"
            size="small"
            label="Detalle del Prestamo"
            variant="tonal"
          />
        </LoanDetailDialog>
        <Button icon="icon-park-twotone:eyes" size="small" label="Detalle del Libro" variant="tonal"
          onClick={() => openDetail((row.original.library_reference as any).book, true)} />
        <LoanActionDialog
          bookName={(row.original.library_reference as any).book.name}
          bookReferenceId={row.original.library_reference_id}
          loan_id={row.original.id}
          onConfirm={refresh}
        >
          <Button
            icon="lucide:hand-helping"
            size="small"
            label="Retornar"
            variant="tonal"
          />
        </LoanActionDialog>
      </div>
    )
  }
]
</script>
