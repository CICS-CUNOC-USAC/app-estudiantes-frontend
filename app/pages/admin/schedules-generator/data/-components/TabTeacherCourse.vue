<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <Dialog v-model:open="isAddModalOpen">
        <DialogTrigger as-child>
          <Button label="Agregar relación" icon="lucide:plus" class="w-fit" @click="resetForm" />
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar relación docente-curso</DialogTitle>
            <DialogDescription>Selecciona un docente y un curso para crear la relación</DialogDescription>
          </DialogHeader>

          <form @submit.prevent="handleAddRelation" class="space-y-4">

            <!-- Buscador docente -->
            <ModalSearchField
              v-model:query="teacherModal.query.value"
              label="Docente *"
              placeholder="Buscar por nombre o registro..."
              :results="teacherModal.results.value"
              :selected="teacherModal.selected.value"
              :error="errors.docente_id"
              @clear="() => { teacherModal.clear(); newRelation.docente_id = 0 }"
            >
              <template #result="{ item }">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex flex-col"
                  :class="newRelation.docente_id === item.id ? 'bg-primary/10 text-primary' : ''"
                  @click="() => { teacherModal.select(item); newRelation.docente_id = item.id; errors.docente_id = '' }"
                >
                  <span class="font-medium">{{ item.nombre }}</span>
                  <span class="text-xs text-muted-foreground">{{ item.registro_personal }}</span>
                </button>
              </template>
              <template #selected="{ item }">
                <span class="font-medium text-primary">{{ item.nombre }}</span>
                <span class="text-xs text-muted-foreground ml-2">{{ item.registro_personal }}</span>
              </template>
            </ModalSearchField>

            <!-- Buscador curso -->
            <ModalSearchField
              v-model:query="courseModal.query.value"
              label="Curso *"
              placeholder="Buscar por nombre o código..."
              :results="courseModal.results.value"
              :selected="courseModal.selected.value"
              :error="errors.curso_id"
              @clear="() => { courseModal.clear(); newRelation.curso_id = 0 }"
            >
              <template #result="{ item }">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors flex flex-col"
                  :class="newRelation.curso_id === item.id ? 'bg-primary/10 text-primary' : ''"
                  @click="() => { courseModal.select(item); newRelation.curso_id = item.id; errors.curso_id = '' }"
                >
                  <span class="font-medium">{{ item.nombre }}</span>
                  <span class="text-xs text-muted-foreground">{{ item.codigo }}</span>
                </button>
              </template>
              <template #selected="{ item }">
                <span class="font-medium text-primary">{{ item.nombre }}</span>
                <span class="text-xs text-muted-foreground ml-2">{{ item.codigo }}</span>
              </template>
            </ModalSearchField>

            <div class="flex items-center gap-2">
              <input id="puede_laboratorio" v-model="newRelation.puede_laboratorio" type="checkbox"
                class="w-4 h-4 rounded border-border accent-primary cursor-pointer" />
              <label for="puede_laboratorio" class="text-sm font-medium cursor-pointer">Puede impartir laboratorio</label>
            </div>

            <DialogFooter class="flex gap-2 pt-4">
              <DialogClose as-child>
                <Button type="button" label="Cancelar" variant="text" />
              </DialogClose>
              <Button type="submit" label="Agregar" :loading="isSubmitting" severity="success" />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CInputText
        placeholder="Buscar por docente, registro, curso o código..."
        label="Buscar"
        id="relation_search"
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
            <DialogTitle>Importar Relaciones</DialogTitle>
            <DialogDescription>Sube un CSV con datos de cursos del docente</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Cursos del Docente"
            description="Sube un CSV con datos de cursos del docente"
            import-type="teacher-course"
            @imported="() => { isImportModalOpen = false; refresh() }"
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
      table-key-name="schedules-teacher-courses"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import ImportCard from '../../-components/ImportCard.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import ModalSearchField from '~/components/schedules-generator/Modalsearchfield.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { useModalSearch } from '~/composables/Usemodalsearch'
import { fetchTeacherCourses, createTeacherCourse, deleteTeacherCourse, fetchCourses } from '~/lib/api/schedules-generator/teachers-courses'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import type { TeacherCourse, CreateTeacherCourseInput, Teacher, Course } from '~/lib/api/schedules-generator/types'

const isAddModalOpen = ref(false)
const isImportModalOpen = ref(false)
const isSubmitting = ref(false)

const { data, refresh } = await useAsyncData(
  'schedules-teacher-courses',
  () => Promise.all([
    fetchTeacherCourses(),
    fetchCourses(),
    fetchTeachers({})
  ])
)

const allRelations = computed<TeacherCourse[]>(() =>
  Array.isArray(data.value?.[0]) ? data.value![0] as TeacherCourse[] : []
)
const allCourses = computed<Course[]>(() =>
  Array.isArray(data.value?.[1]) ? data.value![1] as Course[] : []
)
const allTeachers = computed<Teacher[]>(() => {
  const raw = data.value?.[2]
  if (!raw) return []
  return 'results' in (raw as any) ? (raw as any).results ?? [] : Array.isArray(raw) ? raw as Teacher[] : []
})

const getTeacher = (id: number) => allTeachers.value.find(t => t.id === id)
const getCourse  = (id: number) => allCourses.value.find(c => c.id === id)

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allRelations, (r, q) => {
    const t = getTeacher(r.docente_id)
    const c = getCourse(r.curso_id)
    return !!(
      t?.nombre.toLowerCase().includes(q) ||
      t?.registro_personal.toLowerCase().includes(q) ||
      c?.nombre.toLowerCase().includes(q) ||
      c?.codigo?.toLowerCase().includes(q)
    )
  })

const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const onPaginationChange = (updater: any) => {
  const next = typeof updater === 'function' ? updater(paginationState.value) : { ...paginationState.value, ...updater }
  paginationState.value = next
  currentPage.value = next.pageIndex + 1
}

const teacherModal = useModalSearch(
  allTeachers,
  (t, q) => t.nombre.toLowerCase().includes(q) || t.registro_personal.toLowerCase().includes(q)
)

const courseModal = useModalSearch(
  allCourses,
  (c, q) => c.nombre.toLowerCase().includes(q) || (c.codigo?.toLowerCase().includes(q) ?? false)
)

const newRelation = reactive<CreateTeacherCourseInput>({ docente_id: 0, curso_id: 0, puede_laboratorio: false })
const errors = reactive({ docente_id: '', curso_id: '' })

const resetForm = () => {
  newRelation.docente_id = 0
  newRelation.curso_id = 0
  newRelation.puede_laboratorio = false
  errors.docente_id = ''
  errors.curso_id = ''
  teacherModal.reset()
  courseModal.reset()
}

const validateForm = () => {
  errors.docente_id = newRelation.docente_id ? '' : 'Debe seleccionar un docente'
  errors.curso_id   = newRelation.curso_id   ? '' : 'Debe seleccionar un curso'
  return !errors.docente_id && !errors.curso_id
}

const handleAddRelation = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    await createTeacherCourse(newRelation)
    isAddModalOpen.value = false
    resetForm()
    refresh()
  } catch { /* handled in API */ }
  finally { isSubmitting.value = false }
}

const handleDelete = async (id: number) => {
  try { await deleteTeacherCourse(id); refresh() }
  catch { /* handled in API */ }
}

const columns: ColumnDef<TeacherCourse>[] = [
  {
    id: 'docente',
    meta: { displayName: 'Docente' },
    header: () => <div class="font-semibold">Docente</div>,
    cell: ({ row }) => {
      const t = getTeacher(row.original.docente_id)
      return <div>{t?.nombre ?? `Docente ${row.original.docente_id}`}</div>
    },
  },
  {
    id: 'registro',
    meta: { displayName: 'Registro' },
    header: () => <div class="font-semibold">Registro</div>,
    cell: ({ row }) => {
      const t = getTeacher(row.original.docente_id)
      return <div class="text-muted-foreground">{t?.registro_personal ?? '—'}</div>
    },
  },
  {
    id: 'curso',
    meta: { displayName: 'Curso' },
    header: () => <div class="font-semibold">Curso</div>,
    cell: ({ row }) => {
      const c = getCourse(row.original.curso_id)
      return <div>{c?.nombre ?? `Curso ${row.original.curso_id}`}</div>
    },
  },
  {
    id: 'codigo',
    meta: { displayName: 'Código' },
    header: () => <div class="font-semibold">Código</div>,
    cell: ({ row }) => {
      const c = getCourse(row.original.curso_id)
      return <div class="text-muted-foreground">{c?.codigo ?? '—'}</div>
    },
  },
  {
    accessorKey: 'puede_laboratorio',
    meta: { displayName: 'Puede Laboratorio' },
    header: () => <div class="font-semibold">Puede Laboratorio</div>,
    cell: ({ row }) => {
      const puede = row.getValue('puede_laboratorio') as boolean
      return (
        <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          puede
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {puede ? 'Sí' : 'No'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
        <Button label="Eliminar" icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
      </DeleteItemDialog>
    ),
  },
]
</script>
