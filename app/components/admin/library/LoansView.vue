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
    </div>

    <PDataTable
      :value="data"
      :loading="status === 'pending'"
      row-hover
      lazy
    >
      <PColumn
        field="id"
        header="ID"
        class="text-center"
        body-class="w-52"
      >
      </PColumn>
      <PColumn
        field="ra"
        header="Registro Academico"
        class="text-center"
        body-class="w-52"
      >
      </PColumn>
      <PColumn
        field="personal_id"
        header="Identificacion Personal"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn
        field="library_reference.id"
        header="ID en Biblioteca"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn
        field="library_reference.book.name"
        header="Nombre"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn
        field="library_reference.location"
        header="Ubicacion"
        class="text-center"
        body-class="w-60"
      ></PColumn>
      <PColumn field="" header="Acciones" class="w-32 text-center">
        <template #body="slotProps">
          <div class="flex flex-col items-center justify-center gap-y-2">
            <LoanDetailDialog
              :loanInfo="slotProps.data"
            >
              <CButton
                icon="icon-park-twotone:eyes"
                size="small"
                label="Detalles"
                variant="tonal"
              />
              <CButton
                icon="lucide:helping-hand"
                size="small"
                label="Devolver"
                variant="tonal"
              />
            </LoanDetailDialog>
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </section>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import LoanDetailDialog from '~/components/dialogs/admin/loans/LoanDetailDialog.vue'
import {
  deleteBook,
  fetchAllLoans,
  loanOrReturn,
} from '~/lib/api/admin/books'

const route = useRoute()

const limit = ref(5)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})


const { data, status, refresh } = await useAsyncData(
  'loans',
  () =>
    fetchAllLoans(
      {
        name: route.query.name,
        author: route.query.author
      }
    ),
  {
    watch: [limit, () => route.query]
  }
)
</script>
