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
      :value="data"
      :loading="status === 'pending'"
      :rows="limit"
      :first="currentPage"
      :total-records="data?.length"
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
      <PColumn
        field="library_reference_id"
        header="Referencia"
        class="text-center"
        body-class="w-52"
      >
      </PColumn>
      <PColumn
        field="library_reference.book.name"
        header="Nombre"
        class="text-center"
        body-class="w-52"
      >
      </PColumn>
      <PColumn
        field="library_reference.book.author"
        header="Autor"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn
        field="place"
        header="Lugar"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn
        field="id"
        header="Identificacion"
        class="text-center"
        body-class="truncate max-w-0"
      >
        <template #body="slotProps">
          <p class="truncate text-sm">
            {{ slotProps.data.ra?.length ?? 0 > 0 ? slotProps.data.ra : slotProps.data.personal_id }}
          </p>
        </template>
      </PColumn>
      <PColumn field="" header="Acciones" class="w-32 text-center">
        <template #body="slotProps">
          <div class="flex flex-col items-center justify-center gap-y-2">
            <LoanDetailDialog
              :title="slotProps.data.name"
              :loan-item="slotProps.data"
              show-all-info
            >
              <CButton
                icon="lucide:receipt-text"
                size="small"
                label="Detalle del Prestamo"
                variant="tonal"
              />
            </LoanDetailDialog>
            <CButton icon="icon-park-twotone:eyes" size="small" label="Detalle del Libro" variant="tonal"
              @click="openDetail(slotProps.data.library_reference.book, true)" />
            <LoanActionDialog
              :book-name="slotProps.data.library_reference.book.name"
              :book-reference-id="slotProps.data.library_reference_id"
              :loan_id="slotProps.data.id"
              @confirm="refresh"
              >
              <CButton
                icon="lucide:hand-helping"
                size="small"
                label="Retornar"
                variant="tonal"
              />
            </LoanActionDialog>
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>
<script setup lang="ts">
import LoanActionDialog from '~/components/dialogs/admin/loans/LoanActionDialog.vue'
import BookDetailDialog from '~/components/dialogs/BookDetailDialog.vue'
import LoanDetailDialog from '~/components/dialogs/LoanDetailDialog.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import {
  getAllCategories
} from '~/lib/api/admin/books'
import { fetchAllOutstandingLoans } from '~/lib/api/admin/loans'

const route = useRoute()

const limit = ref(10)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

const { data, status, refresh } = await useAsyncData(
  'admin-books',
  () =>
    fetchAllOutstandingLoans(
      {
        page: route.query.page ? Number(route.query.page) : 1,
        limit: limit.value,
        name: route.query.name,
        author: route.query.author,
        category_id: route.query.category_id
      },
    ),
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
      width: '50vw',
    },
    props: {
      modal: true,
      dismissableMask: true,
    },
    data: { bookItem, showAllInfo },
    onClose: () => { }
  })
}
</script>
