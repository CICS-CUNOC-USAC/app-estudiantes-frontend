<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <TeacherFormDialog @teacher-saved="onMutate" />

      <CInputText
        placeholder="Buscar por nombre o registro"
        label="Buscar"
        id="teacher_search"
        class="h-12"
        prepend-icon="lucide:search"
        clear-button
        no-borders
        :default-value="searchQuery"
        @input="($event: Event) => handleSearch(($event.target as HTMLInputElement).value)"
        @clear="handleClear"
      />

      <Dialog v-model:open="isImportModalOpen">
        <DialogTrigger as-child>
          <Button icon="lucide:upload" label="Importar CSV" />
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Docentes</DialogTitle>
            <DialogDescription>Sube un CSV con datos de docentes</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Docentes"
            description="Sube un CSV con datos de docentes"
            import-type="teachers"
            @imported="() => { isImportModalOpen = false; onMutate() }"
          />
        </DialogContent>
      </Dialog>
    </div>

    <DataTable
      :columns="columns"
      :data="paged"
      :total-elements="filtered.length"
      :total-pages="totalPages"
      :pagination-state="paginationState"
      :enable-sorting="false"
      table-key-name="schedules-teachers"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import TeacherFormDialog from '~/components/schedules-generator/TeacherFormDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import ImportCard from '../../components/ImportCard.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { fetchTeachers, deleteTeacher } from '~/lib/api/schedules-generator/teachers'
import type { Teacher } from '~/lib/api/schedules-generator/types'

const isImportModalOpen = ref(false)

const { data, refresh } = await useAsyncData(
  'schedules-teachers',
  () => fetchTeachers({})
)

const allTeachers = computed(() => data.value?.results ?? [])

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allTeachers, (t, q) =>
    t.nombre.toLowerCase().includes(q) ||
    t.registro_personal.toLowerCase().includes(q)
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
  try { await deleteTeacher(id); refresh() }
  catch { /* handled in API */ }
}

const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: 'nombre',
    meta: { displayName: 'Nombre' },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
  },
  {
    accessorKey: 'registro_personal',
    meta: { displayName: 'Registro Personal' },
    header: () => <div class="font-semibold">Registro Personal</div>,
    cell: ({ row }) => <div>{row.getValue('registro_personal')}</div>,
  },
  {
    accessorKey: 'hora_entrada',
    meta: { displayName: 'Hora Entrada' },
    header: () => <div class="font-semibold">Hora Entrada</div>,
    cell: ({ row }) => <div>{row.getValue('hora_entrada')}</div>,
  },
  {
    accessorKey: 'hora_salida',
    meta: { displayName: 'Hora Salida' },
    header: () => <div class="font-semibold">Hora Salida</div>,
    cell: ({ row }) => <div>{row.getValue('hora_salida')}</div>,
  },
  {
    accessorKey: 'activo',
    meta: { displayName: 'Activo' },
    header: () => <div class="font-semibold">Activo</div>,
    cell: ({ row }) => {
      const activo = row.getValue('activo') as boolean
      return (
        <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          activo
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex items-center gap-2">
        <TeacherFormDialog teacherId={row.original.id} onTeacherSaved={onMutate} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button label="Eliminar" icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
        </DeleteItemDialog>
      </div>
    ),
  },
]
</script>
