<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <TeacherFormDialog @teacher-saved="refreshTeachers" />

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

      <button
        @click="isImportModalOpen = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <Icon name="lucide:upload" size="18" />
        Importar CSV
      </button>
    </div>

    <!-- Paginación + columnas -->
    <TablePagination
      v-model:current-page="currentPage"
      :total-pages="totalPages"
      :total="filtered.length"
    >
      <template #actions>
        <ColumnToggle
          v-model:visible="visibleCols"
          :columns="columnDefs"
        />
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
              :class="col.key === 'activo' || col.key === 'acciones' ? 'text-center' : ''"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="visibleCount" class="px-4 py-8 text-center text-muted-foreground">
              Cargando docentes...
            </td>
          </tr>
          <tr v-else-if="paged.length === 0">
            <td :colspan="visibleCount" class="px-4 py-8 text-center text-muted-foreground">
              No hay docentes disponibles
            </td>
          </tr>
          <tr
            v-for="t in paged"
            :key="t.id"
            class="border-b border-border hover:bg-muted/20 transition-colors last:border-0"
          >
            <td v-show="visibleCols.nombre"    class="px-4 py-3 text-sm">{{ t.nombre }}</td>
            <td v-show="visibleCols.registro"  class="px-4 py-3 text-sm">{{ t.registro_personal }}</td>
            <td v-show="visibleCols.entrada"   class="px-4 py-3 text-sm">{{ t.hora_entrada }}</td>
            <td v-show="visibleCols.salida"    class="px-4 py-3 text-sm">{{ t.hora_salida }}</td>
            <td v-show="visibleCols.activo"    class="px-4 py-3 text-center">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="t.activo
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'"
              >{{ t.activo ? 'Activo' : 'Inactivo' }}</span>
            </td>
            <td v-show="visibleCols.acciones"  class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <TeacherFormDialog :teacher-id="t.id" @teacher-saved="refreshTeachers" />
                <button
                  @click="handleDelete(t.id)"
                  class="px-3 py-1 text-sm border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-1"
                >
                  <Icon name="lucide:trash-2" size="16" />
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal importación -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isImportModalOpen"
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="isImportModalOpen = false"
        >
          <div class="bg-background rounded-lg shadow-lg max-w-md w-full">
            <div class="p-6 border-b border-border flex items-center justify-between">
              <h2 class="text-lg font-semibold">Importar Docentes</h2>
              <button @click="isImportModalOpen = false" class="text-muted-foreground hover:text-foreground">
                <Icon name="lucide:x" size="20" />
              </button>
            </div>
            <div class="p-6">
              <ImportCard
                title="Importar Docentes"
                description="Sube un CSV con datos de docentes"
                import-type="teachers"
                @imported="() => { isImportModalOpen = false; refreshTeachers() }"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import TeacherFormDialog from '~/components/schedules-generator/TeacherFormDialog.vue'
import ImportCard from '../../components/ImportCard.vue'
import TablePagination from '~/components/schedules-generator/Tablepagination.vue'
import ColumnToggle from '~/components/schedules-generator/Columntoggle.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { fetchTeachers, deleteTeacher } from '~/lib/api/schedules-generator/teachers'
import type { Teacher } from '~/lib/api/schedules-generator/types'

// ── Columnas ───────────────────────────────────────────────────────────────────
const columnDefs = [
  { key: 'nombre',   label: 'Nombre' },
  { key: 'registro', label: 'Registro Personal' },
  { key: 'entrada',  label: 'Hora Entrada' },
  { key: 'salida',   label: 'Hora Salida' },
  { key: 'activo',   label: 'Activo' },
  { key: 'acciones', label: 'Acciones' },
]

const visibleCols = ref<Record<string, boolean>>(
  Object.fromEntries(columnDefs.map(c => [c.key, true]))
)

const visibleCount = computed(() =>
  Object.values(visibleCols.value).filter(Boolean).length
)

// ── Data ───────────────────────────────────────────────────────────────────────
const allTeachers = ref<Teacher[]>([])
const isLoading = ref(false)
const isImportModalOpen = ref(false)

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allTeachers, (t, q) =>
    t.nombre.toLowerCase().includes(q) ||
    t.registro_personal.toLowerCase().includes(q)
  )

const loadTeachers = async () => {
  isLoading.value = true
  try {
    const response = await fetchTeachers({})
    allTeachers.value = response.results || []
  } catch {
    allTeachers.value = []
  } finally {
    isLoading.value = false
  }
}

const refreshTeachers = () => {
  currentPage.value = 1
  loadTeachers()
}

const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este docente?')) return
  try { await deleteTeacher(id); refreshTeachers() }
  catch { /* handled in API */ }
}

onMounted(loadTeachers)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>