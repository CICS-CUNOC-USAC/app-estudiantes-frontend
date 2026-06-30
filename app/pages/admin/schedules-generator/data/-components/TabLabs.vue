<template>
  <div class="space-y-4">
    <!-- Header: crear + buscar + importar -->
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <LaboratorioFormDialog @laboratorio-saved="onMutate" />

      <CInputText
        placeholder="Buscar por curso o nombre"
        label="Buscar"
        id="lab_search"
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
            <DialogTitle>Importar Laboratorios</DialogTitle>
            <DialogDescription>Sube un CSV con datos de laboratorios</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Laboratorios"
            description="Sube un CSV con datos de laboratorios"
            import-type="labs"
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
      table-key-name="schedules-labs"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import LaboratorioFormDialog from '~/components/schedules-generator/LaboratorioFormDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import ImportCard from '../../-components/ImportCard.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { fetchLaboratorios, deleteLaboratorio } from '~/lib/api/schedules-generator/laboratorios'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import type { Laboratorio } from '~/lib/api/schedules-generator/types'

const isImportModalOpen = ref(false)

// El backend no hace JOIN: traemos laboratorios y cursos por separado y
// resolvemos el nombre del curso en el front (join visual).
const { data, refresh } = await useAsyncData('schedules-labs', async () => {
  const [labs, cursos] = await Promise.all([fetchLaboratorios(), fetchCursos()])
  return { labs, cursos }
})

const allLabs = computed(() => data.value?.labs ?? [])
const cursoNameById = computed(() => {
  const map = new Map<number, string>()
  for (const c of data.value?.cursos ?? []) {
    map.set(c.id, c.codigo ? `${c.codigo} — ${c.nombre}` : c.nombre)
  }
  return map
})

const cursoLabel = (cursoId: number) => cursoNameById.value.get(cursoId) ?? `Curso #${cursoId}`

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allLabs, (lab, q) =>
    cursoLabel(lab.curso_id).toLowerCase().includes(q) ||
    (lab.nombre?.toLowerCase().includes(q) ?? false)
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
  try { await deleteLaboratorio(id); refresh() }
  catch { /* manejado en la API */ }
}

const boolBadge = (value: boolean) => (
  <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    value
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }`}>
    {value ? 'Sí' : 'No'}
  </span>
)

const columns: ColumnDef<Laboratorio>[] = [
  {
    id: 'curso',
    meta: { displayName: 'Curso' },
    header: () => <div class="font-semibold">Curso</div>,
    cell: ({ row }) => <div>{cursoLabel(row.original.curso_id)}</div>,
  },
  {
    accessorKey: 'nombre',
    meta: { displayName: 'Nombre' },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div>{(row.getValue('nombre') as string | null) ?? '—'}</div>,
  },
  {
    accessorKey: 'num_periodos',
    meta: { displayName: 'Períodos' },
    header: () => <div class="font-semibold">Períodos</div>,
    cell: ({ row }) => <div>{row.getValue('num_periodos')}</div>,
  },
  {
    accessorKey: 'puede_manana',
    meta: { displayName: 'Puede mañana' },
    header: () => <div class="font-semibold">Puede mañana</div>,
    cell: ({ row }) => boolBadge(row.getValue('puede_manana') as boolean),
  },
  {
    accessorKey: 'puede_tarde',
    meta: { displayName: 'Puede tarde' },
    header: () => <div class="font-semibold">Puede tarde</div>,
    cell: ({ row }) => boolBadge(row.getValue('puede_tarde') as boolean),
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
        <LaboratorioFormDialog laboratorioId={row.original.id} onLaboratorio-saved={onMutate} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button label="Eliminar" icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
        </DeleteItemDialog>
      </div>
    ),
  },
]
</script>
