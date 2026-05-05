<template>
  <div class="max-w-5xl mx-auto">
    <DataTable
      :columns
      :data="data || []"
      :enable-sorting="false"
      disable-pagination
      disable-column-visibility
    >
    </DataTable>
  </div>
</template>
<script setup lang="tsx">
import type { ScrapedProgram } from '~/utils/server/types/programs'
import Button from '~/components/ui/button/Button.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const { teacherSearch, fromSearch } = defineProps<{
  teacherSearch: string
  data: ScrapedProgram[] | null
  searchEmpty: boolean
  loading: boolean
  fromSearch: string
}>()

const columns: ColumnDef<ScrapedProgram>[] = [
  {
    id: 'actions',
    meta: {
      displayName: 'Acciones'
    },
    header: () => <div class="text-center font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex flex-col items-center justify-center gap-y-2">
        <Button
          to={`/portal/general/cursos/programa/${row.original.id}?fromSearch=${fromSearch}`}
          icon="lucide:eye"
          fluid
          size="small"
          variant="tonal"
          label="Ver"
        />
        <Button
          href={row.original.pdfLink}
          icon="lucide:download"
          fluid
          size="small"
          variant="tonal"
          label="Descargar"
        />
      </div>
    )
  },
  {
    accessorKey: 'name',
    meta: {
      displayName: 'Nombre'
    },
    header: () => <div class="text-center font-semibold">Nombre</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'teacher',
    meta: {
      displayName: 'Docente'
    },
    header: () => <div class="text-center font-semibold">Docente</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('teacher')}</div>
  },
  {
    accessorKey: 'semester',
    meta: {
      displayName: 'Cohorte'
    },
    header: () => <div class="text-center font-semibold">Cohorte</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('semester')}</div>
  },
  {
    accessorKey: 'year',
    meta: {
      displayName: 'Año'
    },
    header: () => <div class="text-center font-semibold">Año</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('year')}</div>
  },
  {
    accessorKey: 'section',
    meta: {
      displayName: 'Sección'
    },
    header: () => <div class="text-center font-semibold">Sección</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('section')}</div>
  }
]
</script>
