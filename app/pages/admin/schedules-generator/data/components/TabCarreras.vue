<template>
  <div class="space-y-4">
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr]">
      <CarreraFormDialog @carrera-saved="onMutate" />

      <CInputText
        placeholder="Buscar por nombre o código"
        label="Buscar"
        id="carrera_search"
        class="h-12"
        prepend-icon="lucide:search"
        clear-button
        no-borders
        :default-value="searchQuery"
        @input="($event: Event) => handleSearch(($event.target as HTMLInputElement).value)"
        @clear="handleClear"
      />
    </div>

    <DataTable
      :columns="columns"
      :data="paged"
      :total-elements="filtered.length"
      :total-pages="totalPages"
      :pagination-state="paginationState"
      :enable-sorting="false"
      table-key-name="schedules-carreras"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CarreraFormDialog from '~/components/schedules-generator/CarreraFormDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { fetchCarreras, deleteCarrera } from '~/lib/api/schedules-generator/carreras'
import type { Carrera } from '~/lib/api/schedules-generator/types'

const { data, refresh } = await useAsyncData('schedules-carreras', () => fetchCarreras())

const allCarreras = computed(() => data.value ?? [])

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allCarreras, (c, q) =>
    c.nombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q)
  )

const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const onPaginationChange = (updater: any) => {
  const next = typeof updater === 'function' ? updater(paginationState.value) : { ...paginationState.value, ...updater }
  paginationState.value = next
  currentPage.value = next.pageIndex + 1
}

const onMutate = () => {
  currentPage.value = 1
  paginationState.value = { ...paginationState.value, pageIndex: 0 }
  refresh()
}

const handleDelete = async (id: number) => {
  try { await deleteCarrera(id); refresh() }
  catch { /* handled in API */ }
}

const columns: ColumnDef<Carrera>[] = [
  {
    accessorKey: 'nombre',
    meta: { displayName: 'Nombre' },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
  },
  {
    accessorKey: 'codigo',
    meta: { displayName: 'Código' },
    header: () => <div class="font-semibold">Código</div>,
    cell: ({ row }) => (
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
        {row.getValue('codigo')}
      </span>
    ),
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex items-center gap-2">
        <CarreraFormDialog carreraId={row.original.id} onCarrera-saved={onMutate} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button label="Eliminar" icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
        </DeleteItemDialog>
      </div>
    ),
  },
]
</script>
