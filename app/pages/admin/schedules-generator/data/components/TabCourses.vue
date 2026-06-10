<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="sticky top-0 z-10 flex flex-col gap-4 py-4">
      <div
        class="grid grid-cols-1 gap-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]"
      >
        <CourseFormDialog
          :preselected-carrera-id="filterCarreraId ?? undefined"
          @curso-saved="onMutate"
        />

        <CInputText
          placeholder="Buscar por nombre o código"
          label="Buscar"
          id="course_search"
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
              <DialogTitle>Importar Cursos</DialogTitle>
              <DialogDescription
                >Sube un CSV con datos de cursos</DialogDescription
              >
            </DialogHeader>
            <ImportCard
              title="Importar Cursos"
              description="Sube un CSV con datos de cursos"
              import-type="courses"
              @imported="
                () => {
                  isImportModalOpen = false
                  onMutate()
                }
              "
            />
          </DialogContent>
        </Dialog>
      </div>

      <!-- Filters row -->
      <div class="flex flex-wrap items-center gap-3">
        <CSelect
          v-model="filterCarreraStr"
          label="Carrera"
          placeholder="Todas las carreras"
          :items="carreraFilterItems"
          option-label="label"
          option-value="value"
          clearable
        />

        <CSelect
          v-model="filterSemestreStr"
          label="Semestre"
          placeholder="Todos los semestres"
          :items="semestreItems"
          option-label="label"
          option-value="value"
          clearable
        />
      </div>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-muted-foreground text-sm">Acciones masivas:</span>
        <Button
          label="Desactivar pares"
          variant="tonal"
          severity="secondary"
          size="sm"
          @click="openBulkDialog('desactivar-pares')"
        />
        <Button
          label="Desactivar impares"
          variant="tonal"
          severity="secondary"
          size="sm"
          @click="openBulkDialog('desactivar-impares')"
        />
        <Button
          label="Desactivar todos"
          variant="tonal"
          severity="danger"
          size="sm"
          @click="openBulkDialog('desactivar-todos')"
        />
        <Button
          label="Activar todos"
          variant="tonal"
          severity="success"
          size="sm"
          @click="openBulkDialog('activar-todos')"
        />
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="paged"
      :total-elements="filtered.length"
      :total-pages="totalPages"
      :pagination-state="paginationState"
      :enable-sorting="false"
      table-key-name="schedules-courses"
      @pagination-change="onPaginationChange"
    />

    <!-- Bulk action confirmation dialog -->
    <Dialog v-model:open="bulkDialogOpen">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{{ bulkDialogConfig.title }}</DialogTitle>
          <DialogDescription>{{
            bulkDialogConfig.description
          }}</DialogDescription>
        </DialogHeader>
        <DialogFooter class="flex gap-2 pt-4">
          <DialogClose as-child>
            <Button type="button" label="Cancelar" variant="text" />
          </DialogClose>
          <Button
            label="Confirmar"
            :severity="bulkDialogConfig.severity"
            :loading="isBulkLoading"
            @click="executeBulkAction"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CourseFormDialog from '~/components/schedules-generator/CourseFormDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import ImportCard from '../../components/ImportCard.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import {
  fetchCursos,
  deleteCurso,
  desactivarCursosPares,
  desactivarCursosImpares,
  desactivarTodosCursos,
  activarTodosCursos
} from '~/lib/api/schedules-generator/cursos'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import type { Curso, Carrera } from '~/lib/api/schedules-generator/types'

const isImportModalOpen = ref(false)
const bulkDialogOpen = ref(false)
const isBulkLoading = ref(false)
const pendingBulkAction = ref<
  | 'desactivar-pares'
  | 'desactivar-impares'
  | 'desactivar-todos'
  | 'activar-todos'
  | null
>(null)

const [{ data: cursosData, refresh }, { data: carrerasData }] =
  await Promise.all([
    useAsyncData('schedules-courses', () => fetchCursos()),
    useAsyncData('schedules-carreras-filter', () => fetchCarreras())
  ])

const allCursos = computed(() => cursosData.value ?? [])
const allCarreras = computed(() => carrerasData.value ?? [])

const carreraMap = computed(() =>
  Object.fromEntries(allCarreras.value.map((c: Carrera) => [c.id, c]))
)

const carreraFilterItems = computed(() =>
  allCarreras.value.map((c: Carrera) => ({
    label: `${c.codigo} — ${c.nombre}`,
    value: String(c.id)
  }))
)

const semestreItems = Array.from({ length: 10 }, (_, i) => ({
  label: `Semestre ${i + 1}`,
  value: String(i + 1)
}))

const filterCarreraStr = ref<string | null>(null)
const filterSemestreStr = ref<string | null>(null)

const filterCarreraId = computed(() =>
  filterCarreraStr.value ? Number(filterCarreraStr.value) : null
)
const filterSemestreNum = computed(() =>
  filterSemestreStr.value ? Number(filterSemestreStr.value) : null
)

const filteredByDropdowns = computed(() => {
  let result = allCursos.value
  if (filterCarreraId.value != null) {
    result = result.filter((c: Curso) => c.carrera_id === filterCarreraId.value)
  }
  if (filterSemestreNum.value != null) {
    result = result.filter((c: Curso) => c.semestre === filterSemestreNum.value)
  }
  return result
})

const {
  searchQuery,
  currentPage,
  filtered,
  totalPages,
  paged,
  handleSearch,
  handleClear
} = useTableSearch(
  filteredByDropdowns,
  (c: Curso, q) =>
    c.nombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q)
)

const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const onPaginationChange = (updater: any) => {
  const next =
    typeof updater === 'function'
      ? updater(paginationState.value)
      : { ...paginationState.value, ...updater }
  paginationState.value = next
  currentPage.value = next.pageIndex + 1
}

const onMutate = () => {
  currentPage.value = 1
  paginationState.value = { ...paginationState.value, pageIndex: 0 }
  refresh()
}

const handleDelete = async (id: number) => {
  try {
    await deleteCurso(id)
    refresh()
  } catch {
    /* handled in API */
  }
}

type BulkAction =
  | 'desactivar-pares'
  | 'desactivar-impares'
  | 'desactivar-todos'
  | 'activar-todos'

const bulkDialogConfigs: Record<
  BulkAction,
  { title: string; description: string; severity: string }
> = {
  'desactivar-pares': {
    title: 'Desactivar cursos de semestres pares',
    description:
      'Se desactivarán todos los cursos de semestres pares (2, 4, 6...) y sus laboratorios asociados.',
    severity: 'secondary'
  },
  'desactivar-impares': {
    title: 'Desactivar cursos de semestres impares',
    description:
      'Se desactivarán todos los cursos de semestres impares (1, 3, 5...) y sus laboratorios asociados.',
    severity: 'secondary'
  },
  'desactivar-todos': {
    title: 'Desactivar todos los cursos',
    description:
      'Se desactivarán TODOS los cursos y sus laboratorios asociados.',
    severity: 'danger'
  },
  'activar-todos': {
    title: 'Activar todos los cursos',
    description: 'Se activarán TODOS los cursos y sus laboratorios asociados.',
    severity: 'success'
  }
}

const bulkDialogConfig = computed(() =>
  pendingBulkAction.value
    ? bulkDialogConfigs[pendingBulkAction.value]
    : { title: '', description: '', severity: 'secondary' }
)

const openBulkDialog = (action: BulkAction) => {
  pendingBulkAction.value = action
  bulkDialogOpen.value = true
}

const executeBulkAction = async () => {
  if (!pendingBulkAction.value) return
  isBulkLoading.value = true
  try {
    const actionMap: Record<BulkAction, () => Promise<any>> = {
      'desactivar-pares': desactivarCursosPares,
      'desactivar-impares': desactivarCursosImpares,
      'desactivar-todos': desactivarTodosCursos,
      'activar-todos': activarTodosCursos
    }
    await actionMap[pendingBulkAction.value]()
    bulkDialogOpen.value = false
    refresh()
  } catch {
    /* handled in API */
  } finally {
    isBulkLoading.value = false
  }
}

const columns: ColumnDef<Curso>[] = [
  {
    accessorKey: 'nombre',
    meta: { displayName: 'Nombre' },
    header: () => <div class="font-semibold">Nombre</div>,
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>
  },
  {
    accessorKey: 'codigo',
    meta: { displayName: 'Código' },
    header: () => <div class="font-semibold">Código</div>,
    cell: ({ row }) => (
      <span class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
        {row.getValue('codigo')}
      </span>
    )
  },
  {
    accessorKey: 'carrera_id',
    meta: { displayName: 'Carrera' },
    header: () => <div class="font-semibold">Carrera</div>,
    cell: ({ row }) => {
      const carrera = carreraMap.value[row.getValue('carrera_id') as number]
      return carrera ? (
        <span class="text-sm">{carrera.codigo}</span>
      ) : (
        <span class="text-muted-foreground text-xs">—</span>
      )
    }
  },
  {
    accessorKey: 'semestre',
    meta: { displayName: 'Semestre' },
    header: () => <div class="font-semibold">Sem.</div>,
    cell: ({ row }) => <div class="text-center">{row.getValue('semestre')}</div>
  },
  {
    accessorKey: 'tipo',
    meta: { displayName: 'Tipo' },
    header: () => <div class="font-semibold">Tipo</div>,
    cell: ({ row }) => {
      const tipo = row.getValue('tipo') as string
      return (
        <span
          class={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            tipo === 'obligatorio'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
          }`}
        >
          {tipo === 'obligatorio' ? 'Obligatorio' : 'Optativo'}
        </span>
      )
    }
  },
  {
    accessorKey: 'num_estudiantes',
    meta: { displayName: 'Estudiantes' },
    header: () => <div class="font-semibold">Estudiantes</div>,
    cell: ({ row }) => {
      const val = row.getValue('num_estudiantes') as number | null
      return <div class="text-center">{val ?? '—'}</div>
    }
  },
  {
    accessorKey: 'tiene_laboratorio',
    meta: { displayName: 'Lab' },
    header: () => <div class="font-semibold">Lab</div>,
    cell: ({ row }) => {
      const tiene = row.getValue('tiene_laboratorio') as boolean
      return tiene ? (
        <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          Sí
        </span>
      ) : (
        <span class="text-muted-foreground text-xs">No</span>
      )
    }
  },
  {
    accessorKey: 'activo',
    meta: { displayName: 'Activo' },
    header: () => <div class="font-semibold">Activo</div>,
    cell: ({ row }) => {
      const activo = row.getValue('activo') as boolean
      return (
        <span
          class={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            activo
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex items-center gap-2">
        <CourseFormDialog cursoId={row.original.id} onCurso-saved={onMutate} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button
            label="Eliminar"
            icon="lucide:trash-2"
            severity="danger"
            variant="text"
            size="sm"
          />
        </DeleteItemDialog>
      </div>
    )
  }
]
</script>
