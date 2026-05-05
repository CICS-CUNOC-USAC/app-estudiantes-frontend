<template>
  <div>
    <div
      class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_1fr]"
    >
      <Button
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
                full_name: undefined
              }
            })
          }
        "
      />
    </div>

    <div>
      <DataTable
        :columns
        :data="data?.results || []"
        :totalElements="data?.meta?.total"
        :totalPages="data?.meta?.total_pages"
        :paginationState="paginationOptions"
        :enable-sorting="false"
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
    </div>
  </div>
</template>
<script setup lang="tsx">
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { fetchAllStaffs } from '~/lib/api/admin/users'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { Icon } from '#components'

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

const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: 'first_name',
    meta: {
      displayName: 'Nombre'
    },
    header: () => (
      <div class="text-center font-semibold">
        {/* <Icon name="lucide:user" class="mr-1 mb-0.5 inline" /> */}
        Nombres
      </div>
    ),
    cell: ({ row }) => <div class="text-base">{row.getValue('first_name')}</div>
  },
  {
    accessorKey: 'last_name',
    meta: {
      displayName: 'Apellido'
    },
    header: () => (
      <div class="text-center font-semibold">
        {/* <Icon name="lucide:user" class="mr-1 mb-0.5 inline" /> */}
        Apellidos
      </div>
    ),
    cell: ({ row }) => <div class="text-base">{row.getValue('last_name')}</div>
  },
  {
    accessorKey: 'email',
    meta: {
      displayName: 'Correo electrónico'
    },
    header: () => (
      <div class="text-center font-semibold">
        {/* <Icon name="lucide:mail" class="mr-1 mb-0.5 inline" /> */}
        Correo electrónico
      </div>
    ),
    cell: ({ row }) => <div class="text-base">{row.getValue('email')}</div>
  },
  {
    id: 'actions',
    header: () => (
      <div class="text-center font-semibold">
        {/* <Icon name="lucide:mouse-pointer-click" class="inline mr-1 mb-0.5" /> */}
        Acciones
      </div>
    ),
    cell: ({ row }) => (
      <div class="flex flex-col  gap-y-2">
        <Button
          class="w-min"
          to={`/admin/users/edit/${row.original.id}`}
          icon="icon-park-twotone:edit"
          fluid
          size="small"
          variant="tonal"
          label="Editar"
        />
      </div>
    )
  }
]
</script>
