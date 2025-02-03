<template>
  <div>
    <div
      class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr]"
    >
      <CButton
        label="Nuevo usuario"
        icon="icon-park-outline:plus"
        class="w-fit"
        to="/admin/users/create"
      />
      <CInputText
        placeholder="Nombre del usuario"
        label="Buscar"
        id="full_name"
        class="h-12"
        prepend-icon="icon-park-twotone:doc-search-two"
        clear-button
        no-borders
        :default-value="$route.query.full_name"
        @input="
          ($event: Event) => {
            useDebounceFn(() => {
              $router.push({
                query: {
                  ...$route.query,
                  full_name:
                    ($event.target as HTMLInputElement).value || undefined
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
      <PColumn field="id" header="Id" class="text-center"> </PColumn>
      <PColumn field="first_name" header="Nombre" class="text-center">
      </PColumn>
      <PColumn field="last_name" header="Apellido" class="text-center">
      </PColumn>
      <PColumn field="email" header="Correo electrónico" class="text-center">
      </PColumn>
      <PColumn field="actions" header="Acciones" class="text-center">
        <template #body="slotProps">
          <div class="flex flex-col items-center justify-center gap-y-2">
            <CButton
              :to="`/admin/users/edit/${slotProps.data.id}`"
              icon="icon-park-twotone:edit"
              fluid
              size="small"
              variant="tonal"
              label="Editar"
            />
          </div>
        </template>
      </PColumn>
    </PDataTable>
  </div>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { fetchAllStaffs } from '~/lib/api/admin/users'

const route = useRoute()

const limit = ref(5)
const currentPage = computed(() => {
  return limit.value * (route.query.page ? Number(route.query.page) - 1 : 0)
})

const { data, refresh, status } = await useLazyAsyncData(
  'admin-staffs',
  () =>
    fetchAllStaffs({
      page: route.query.page ? Number(route.query.page) : 1,
      limit: limit.value,
      full_name: route.query.full_name
    }),
  {
    watch: [limit, () => route.query]
  }
)
</script>
<style lang="scss" scoped></style>
