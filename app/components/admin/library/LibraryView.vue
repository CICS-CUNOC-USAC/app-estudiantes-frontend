<template>
  <section>
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr_1fr]">
      <CButton label="Nuevo libro" icon="icon-park-outline:plus" class="w-fit"
        :to="`/admin/books/create?type=${props.type}`" />
      <CInputText label="Nombre del libro" id="name" class="h-12" prepend-icon="icon-park-twotone:doc-search-two"
        clear-button no-borders :default-value="$route.query.name" @input="
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
        " @clear="
          () => {
            $router.push({
              query: {
                ...$route.query,
                name: undefined
              }
            })
          }
        " />
      <CInputText label="Autor" id="author" prepend-icon="icon-park-twotone:people-search" clear-button no-borders
        class="h-12" :default-value="$route.query.author" @input="
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
        " @clear="
          () => {
            $router.push({
              query: {
                ...$route.query,
                author: undefined
              }
            })
          }
        " />
      <CSelect :items="categories?.results || []" label="Categoria" id="category"
        prepend-icon="icon-park-twotone:category-management" no-borders clearable checkmark option-label="name"
        option-value="id" @value-change="
          ($event: number | null) => {
            $router.push({
              query: {
                ...$route.query,
                category_id: $event || undefined
              }
            })
          }
        " />
    </div>

    <PDataTable :value="data?.results" :loading="status === 'pending'" :rows="limit" :first="currentPage"
      :total-records="data?.meta?.total" :rows-per-page-options="[5, 10, 25, 50]" row-hover lazy paginator @page="
        ($event) =>
          $router.push({ query: { ...$route.query, page: $event.page + 1 } })
      " @update:rows="limit = $event">
      <PColumn field="name" header="Nombre" class="text-center" body-class="w-52">
      </PColumn>
      <PColumn field="author" header="Autor" class="text-center" body-class="w-60"></PColumn>
      <PColumn field="description" header="Descripcion" class="text-center" body-class="truncate max-w-0">
        <template #body="slotProps">
          <p class="truncate text-sm">
            {{ slotProps.data.description }}
          </p>
        </template>
      </PColumn>
      <PColumn field="" header="Acciones" class="w-32 text-center">
        <template #body="slotProps">
          <div class="flex flex-col items-center justify-center gap-y-2">
            <CButton icon="icon-park-twotone:eyes" size="small" label="Detalles" variant="tonal"
              @click="openDetail(slotProps.data, true)" />
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>
<script setup lang="ts">
import BookDetailDialog from '~/components/dialogs/BookDetailDialog.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import {
  deleteBook,
  fetchAllBooks,
  getAllCategories
} from '~/lib/api/admin/books'

const props = defineProps<{
  type: 'physical' | 'digital'
}>()

const route = useRoute()

const limit = ref(10)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

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
