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
              <Button type="submit" label="Agregar" :loading="isLoading" severity="success" />
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
            @imported="() => { isImportModalOpen = false; loadData() }"
          />
        </DialogContent>
      </Dialog>
    </div>

    <!-- Paginación + columnas -->
    <TablePagination
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :total="filtered.length"
    >
      <template #actions>
        <ColumnToggle v-model:visible="visibleCols" :columns="columnDefs" />
      </template>
    </TablePagination>

    <!-- Tabla -->
    <div class="overflow-x-auto border border-border rounded-lg">
      <table class="w-full">
        <thead class="bg-muted/30 border-b border-border">
          <tr>
            <th
              v-for="col in columnDefs"
              v-show="visibleCols[col.key]"
              :key="col.key"
              class="px-4 py-3 text-left font-medium text-sm text-muted-foreground"
            >{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading && allRelations.length === 0">
            <td :colspan="visibleCount" class="px-4 py-8 text-center text-muted-foreground">Cargando relaciones...</td>
          </tr>
          <tr v-else-if="paged.length === 0">
            <td :colspan="visibleCount" class="px-4 py-8 text-center text-muted-foreground">No hay relaciones docente-curso</td>
          </tr>
          <tr v-for="r in paged" :key="r.id" class="border-b border-border hover:bg-muted/20 transition-colors last:border-0">
            <td v-show="visibleCols.docente" class="px-4 py-3 text-sm">
              {{ getTeacher(r.docente_id)?.nombre ?? `Docente ${r.docente_id}` }}
            </td>
            <td v-show="visibleCols.registro" class="px-4 py-3 text-sm text-muted-foreground">
              {{ getTeacher(r.docente_id)?.registro_personal ?? '—' }}
            </td>
            <td v-show="visibleCols.curso" class="px-4 py-3 text-sm">
              {{ getCourse(r.curso_id)?.nombre ?? `Curso ${r.curso_id}` }}
            </td>
            <td v-show="visibleCols.codigo" class="px-4 py-3 text-sm text-muted-foreground">
              {{ getCourse(r.curso_id)?.codigo ?? '—' }}
            </td>
            <td v-show="visibleCols.laboratorio" class="px-4 py-3 text-center">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="r.puede_laboratorio
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
              >{{ r.puede_laboratorio ? 'Sí' : 'No' }}</span>
            </td>
            <td v-show="visibleCols.acciones" class="px-4 py-3 text-center">
              <Button
                @click="handleDelete(r.id)"
                label="Eliminar"
                icon="lucide:trash-2"
                severity="danger"
                variant="outlined"
                size="sm"
                class="mx-auto"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import ImportCard from '../../components/ImportCard.vue'
import TablePagination from '~/components/schedules-generator/Tablepagination.vue'
import ModalSearchField from '~/components/schedules-generator/Modalsearchfield.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import ColumnToggle from '~/components/schedules-generator/Columntoggle.vue'
import { useModalSearch } from '~/composables/Usemodalsearch'
import { fetchTeacherCourses, createTeacherCourse, deleteTeacherCourse, fetchCourses } from '~/lib/api/schedules-generator/teachers-courses'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import type { TeacherCourse, CreateTeacherCourseInput, Teacher, Course } from '~/lib/api/schedules-generator/types'

const columnDefs = [
  { key: 'docente',      label: 'Docente' },
  { key: 'registro',     label: 'Registro' },
  { key: 'curso',        label: 'Curso' },
  { key: 'codigo',       label: 'Código' },
  { key: 'laboratorio',  label: 'Puede Laboratorio' },
  { key: 'acciones',     label: 'Acciones' },
]

const visibleCols = ref<Record<string, boolean>>(
  Object.fromEntries(columnDefs.map(c => [c.key, true]))
)

const visibleCount = computed(() =>
  Object.values(visibleCols.value).filter(Boolean).length
)

// ── Data ──────────────────────────────────────────────────────────────────────
const allRelations = ref<TeacherCourse[]>([])
const allTeachers  = ref<Teacher[]>([])
const allCourses   = ref<Course[]>([])
const isLoading = ref(false)
const isAddModalOpen = ref(false)
const isImportModalOpen = ref(false)

// ── Helpers lookup ─────────────────────────────────────────────────────────────
const getTeacher = (id: number) => allTeachers.value.find(t => t.id === id)
const getCourse  = (id: number) => allCourses.value.find(c => c.id === id)

// ── Tabla: filtrado + paginación ───────────────────────────────────────────────
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

// ── Modal: buscadores de docente y curso ──────────────────────────────────────
const teacherModal = useModalSearch(
  allTeachers,
  (t, q) => t.nombre.toLowerCase().includes(q) || t.registro_personal.toLowerCase().includes(q)
)

const courseModal = useModalSearch(
  allCourses,
  (c, q) => c.nombre.toLowerCase().includes(q) || (c.codigo?.toLowerCase().includes(q) ?? false)
)

// ── Form ───────────────────────────────────────────────────────────────────────
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

// ── CRUD ───────────────────────────────────────────────────────────────────────
const loadData = async () => {
  isLoading.value = true
  try {
    const [relData, courseData, teacherData] = await Promise.all([
      fetchTeacherCourses(),
      fetchCourses(),
      fetchTeachers({})
    ])
    allRelations.value = Array.isArray(relData)    ? relData    : []
    allCourses.value   = Array.isArray(courseData) ? courseData : []
    allTeachers.value  = teacherData && 'results' in teacherData
      ? teacherData.results || []
      : Array.isArray(teacherData) ? teacherData : []
  } catch { /* handled in API */ }
  finally { isLoading.value = false }
}

const handleAddRelation = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    await createTeacherCourse(newRelation)
    isAddModalOpen.value = false
    resetForm()
    await loadData()
  } catch { /* handled in API */ }
  finally { isLoading.value = false }
}

const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta relación?')) return
  try { await deleteTeacherCourse(id); await loadData() }
  catch { /* handled in API */ }
}

onMounted(loadData)
</script>
