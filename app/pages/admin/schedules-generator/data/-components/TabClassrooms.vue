<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <SalonFormDialog @salon-saved="onMutate" />

      <CInputText
        placeholder="Buscar por nombre"
        label="Buscar"
        id="salon_search"
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
            <DialogTitle>Importar Salones</DialogTitle>
            <DialogDescription>Sube un CSV con datos de salones</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Salones"
            description="Sube un CSV con datos de salones"
            import-type="classrooms"
            @imported="() => { isImportModalOpen = false; onMutate() }"
          />
        </DialogContent>
      </Dialog>
    </div>

    <!-- Filtros rápidos (client-side) -->
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex items-center gap-1">
        <span class="text-xs font-medium text-muted-foreground mr-1">Tipo:</span>
        <Button
          v-for="opt in typeOptions"
          :key="opt.value"
          :label="opt.label"
          size="sm"
          :variant="typeFilter === opt.value ? 'default' : 'tonal'"
          @click="typeFilter = opt.value"
        />
      </div>

      <Separator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-1">
        <span class="text-xs font-medium text-muted-foreground mr-1">Jornada:</span>
        <Button
          v-for="opt in shiftOptions"
          :key="opt.value"
          :label="opt.label"
          size="sm"
          :variant="shiftFilter === opt.value ? 'default' : 'tonal'"
          @click="shiftFilter = opt.value"
        />
      </div>

      <Separator orientation="vertical" class="h-6" />

      <div class="flex items-center gap-2">
        <Checkbox id="only_active" v-model="onlyActive" class="cursor-pointer" />
        <label for="only_active" class="text-xs font-medium cursor-pointer">Solo activos</label>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="paged"
      :total-elements="filtered.length"
      :total-pages="totalPages"
      :pagination-state="paginationState"
      :enable-sorting="false"
      table-key-name="schedules-salones"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Checkbox } from '~/components/ui/checkbox'
import Button from '~/components/ui/button/Button.vue'
import Separator from '~/components/ui/separator/Separator.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import SalonFormDialog from '~/components/schedules-generator/SalonFormDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import ImportCard from '../../-components/ImportCard.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { fetchSalones, deleteSalon } from '~/lib/api/schedules-generator/salones'
import type { Salon } from '~/lib/api/schedules-generator/types'

const isImportModalOpen = ref(false)

const { data, refresh } = await useAsyncData('schedules-salones', () => fetchSalones())

const allSalones = computed(() => data.value ?? [])

// ── Filtros rápidos (client-side) ──────────────────────────
type TypeFilter = 'all' | 'aula' | 'laboratorio'
type ShiftFilter = 'all' | 'manana' | 'tarde'

const typeFilter = ref<TypeFilter>('all')
const shiftFilter = ref<ShiftFilter>('all')
const onlyActive = ref(false)

const typeOptions: { label: string; value: TypeFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aula', value: 'aula' },
  { label: 'Laboratorio', value: 'laboratorio' }
]
const shiftOptions: { label: string; value: ShiftFilter }[] = [
  { label: 'Todas', value: 'all' },
  { label: 'Mañana', value: 'manana' },
  { label: 'Tarde', value: 'tarde' }
]

// Pre-filtra por tipo/jornada/activo antes de pasar a la búsqueda + paginación
const filteredByQuickFilters = computed(() =>
  allSalones.value.filter((s) => {
    if (typeFilter.value === 'aula' && s.es_laboratorio) return false
    if (typeFilter.value === 'laboratorio' && !s.es_laboratorio) return false
    if (shiftFilter.value === 'manana' && !s.disponible_manana) return false
    if (shiftFilter.value === 'tarde' && !s.disponible_tarde) return false
    if (onlyActive.value && !s.activo) return false
    return true
  })
)

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(filteredByQuickFilters, (s, q) =>
    s.nombre.toLowerCase().includes(q)
  )

const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const onPaginationChange = (updater: any) => {
  const next = typeof updater === 'function' ? updater(paginationState.value) : { ...paginationState.value, ...updater }
  paginationState.value = next
  currentPage.value = next.pageIndex + 1
}

// Al cambiar un filtro rápido, volver a la primera página
watch([typeFilter, shiftFilter, onlyActive], () => {
  currentPage.value = 1
  paginationState.value = { ...paginationState.value, pageIndex: 0 }
})

const onMutate = () => {
  currentPage.value = 1
  paginationState.value = { ...paginationState.value, pageIndex: 0 }
  refresh()
}

const handleDelete = async (id: number) => {
  try { await deleteSalon(id); refresh() }
  catch { /* manejado en la API */ }
}

// Badge reutilizable para valores booleanos (Sí / No)
const boolBadge = (value: boolean) => (
  <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
    value
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }`}>
    {value ? 'Sí' : 'No'}
  </span>
)

const columns: ColumnDef<Salon>[] = [
  {
    accessorKey: 'nombre',
    meta: { displayName: 'Nombre' },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
  },
  {
    accessorKey: 'capacidad',
    meta: { displayName: 'Capacidad' },
    header: () => <div class="font-semibold">Capacidad</div>,
    cell: ({ row }) => {
      const cap = row.getValue('capacidad') as number | null
      return <div>{cap ?? '—'}</div>
    },
  },
  {
    accessorKey: 'es_laboratorio',
    meta: { displayName: 'Tipo' },
    header: () => <div class="font-semibold">Tipo</div>,
    cell: ({ row }) => {
      const esLab = row.getValue('es_laboratorio') as boolean
      return (
        <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          esLab
            ? 'bg-primary/10 text-primary'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {esLab ? 'Laboratorio' : 'Aula'}
        </span>
      )
    },
  },
  {
    accessorKey: 'lab_habilitado_teorico',
    meta: { displayName: 'Lab. teórico' },
    header: () => <div class="font-semibold">Lab. teórico</div>,
    cell: ({ row }) => boolBadge(row.getValue('lab_habilitado_teorico') as boolean),
  },
  {
    accessorKey: 'disponible_manana',
    meta: { displayName: 'Disp. mañana' },
    header: () => <div class="font-semibold">Disp. mañana</div>,
    cell: ({ row }) => boolBadge(row.getValue('disponible_manana') as boolean),
  },
  {
    accessorKey: 'disponible_tarde',
    meta: { displayName: 'Disp. tarde' },
    header: () => <div class="font-semibold">Disp. tarde</div>,
    cell: ({ row }) => boolBadge(row.getValue('disponible_tarde') as boolean),
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
        <SalonFormDialog salonId={row.original.id} onSalon-saved={onMutate} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button label="Eliminar" icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
        </DeleteItemDialog>
      </div>
    ),
  },
]
</script>
