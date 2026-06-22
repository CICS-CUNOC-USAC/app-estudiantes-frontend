<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_fit-content(100%)] md:items-end">
      <div ref="selectorRef" class="relative">
        <label class="mb-1.5 block text-sm font-medium">Curso</label>

        <div
          v-if="selectedCourse"
          class="border-primary/40 bg-primary/10 flex h-12 items-center justify-between gap-2 rounded-lg border px-4"
        >
          <span class="truncate text-sm font-medium">
            {{ selectedCourse.nombre }}
            <span class="text-muted-foreground font-normal">({{ selectedCourse.codigo }})</span>
          </span>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Quitar curso"
            @click="clearCourse"
          >
            <Icon name="lucide:x" size="18" />
          </button>
        </div>

        <template v-else>
          <div @focusin="isCourseOpen = true">
            <CInputText
              v-model="courseQuery"
              placeholder="Busca un curso por nombre o código..."
              prepend-icon="lucide:search"
              :no-borders="false"
            />
          </div>

          <div
            v-if="isCourseOpen"
            class="border-border bg-background absolute z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border shadow-lg"
          >
            <button
              v-for="curso in courseResults"
              :key="curso.id"
              type="button"
              class="hover:bg-muted border-border flex w-full flex-col items-start gap-0.5 border-b px-4 py-3 text-left transition-colors last:border-b-0"
              @click="selectCourse(curso)"
            >
              <span class="font-medium">{{ curso.nombre }}</span>
              <span class="text-muted-foreground text-xs">Código: {{ curso.codigo }}</span>
            </button>
            <p
              v-if="courseResults.length === 0"
              class="text-muted-foreground px-4 py-6 text-center text-sm"
            >
              Sin resultados para «{{ courseQuery }}»
            </p>
          </div>
        </template>
      </div>

      <Dialog v-model:open="isImportModalOpen">
        <DialogTrigger as-child>
          <Button icon="lucide:upload" label="Importar CSV" />
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Importar Secciones</DialogTitle>
            <DialogDescription>Sube un CSV con datos de secciones</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Secciones"
            description="Sube un CSV con datos de secciones"
            import-type="sections"
            @imported="() => { isImportModalOpen = false; if (selectedCourse) loadSecciones() }"
          />
        </DialogContent>
      </Dialog>
    </div>

    <div
      v-if="!selectedCourse"
      class="border-border text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm"
    >
      Selecciona un curso para ver y administrar sus secciones.
    </div>

    <template v-else>
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-medium">
          Secciones de
          <span class="text-primary">{{ selectedCourse.codigo }} — {{ selectedCourse.nombre }}</span>
        </p>
        <SectionFormDialog
          :preselected-curso-id="selectedCourse.id"
          @section-saved="loadSecciones"
        />
      </div>

      <div v-if="isLoading" class="space-y-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-full" />
      </div>

      <div
        v-else-if="secciones.length === 0"
        class="border-border text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm"
      >
        Este curso no tiene secciones todavía. Crea la primera con «Nueva sección».
      </div>

      <DataTable
        v-else
        :columns="columns"
        :data="paged"
        :total-elements="secciones.length"
        :total-pages="totalPages"
        :pagination-state="paginationState"
        :enable-sorting="false"
        table-key-name="schedules-sections"
        @pagination-change="onPaginationChange"
      />
    </template>
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
  DialogTrigger
} from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import { Skeleton } from '~/components/ui/skeleton'
import CInputText from '~/components/primitives/form/CInputText.vue'
import SectionFormDialog from '~/components/schedules-generator/SectionFormDialog.vue'
import SectionLabDialog from '~/components/schedules-generator/SectionLabDialog.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import ImportCard from '../../-components/ImportCard.vue'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import { fetchSeccionesByCurso, deleteSeccion } from '~/lib/api/schedules-generator/secciones'
import { fetchLaboratoriosByCurso } from '~/lib/api/schedules-generator/laboratorios'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import { fetchPeriods } from '~/lib/api/schedules-generator/periods'
import type { Curso, Seccion, Salon, Teacher } from '~/lib/api/schedules-generator/types'
import type { Period } from '~/lib/api/schedules-generator/periods'

const isImportModalOpen = ref(false)
const isLoading = ref(false)

const { data: cursosData } = await useAsyncData('schedules-sections-cursos', () => fetchCursos())
const allCursos = computed<Curso[]>(() => cursosData.value ?? [])

const salones = ref<Salon[]>([])
const docentes = ref<Teacher[]>([])
const periodos = ref<Period[]>([])

const salonMap = computed(() => Object.fromEntries(salones.value.map((s) => [s.id, s])))
const docenteMap = computed(() => Object.fromEntries(docentes.value.map((d) => [d.id, d])))
const periodoMap = computed(() => Object.fromEntries(periodos.value.map((p) => [p.id, p])))

const loadCatalogs = async () => {
  const [s, d, p] = await Promise.all([
    fetchSalones().catch(() => []),
    fetchTeachers().then((r) => r.results).catch(() => []),
    fetchPeriods().then((r) => r ?? []).catch(() => [])
  ])
  salones.value = s
  docentes.value = d
  periodos.value = p
}
await loadCatalogs()

const courseQuery = ref('')
const selectedCourse = ref<Curso | null>(null)
const selectorRef = ref<HTMLElement | null>(null)
const isCourseOpen = ref(false)

onClickOutside(selectorRef, () => { isCourseOpen.value = false })

const courseResults = computed<Curso[]>(() => {
  const q = courseQuery.value.trim().toLowerCase()
  const list = allCursos.value
  if (!q) return list.slice(0, 50)
  return list
    .filter((c) => c.nombre.toLowerCase().includes(q) || c.codigo.toLowerCase().includes(q))
    .slice(0, 50)
})

const secciones = ref<Seccion[]>([])
const courseHasLabs = ref(false)
const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const totalPages = computed(() =>
  Math.max(1, Math.ceil(secciones.value.length / paginationState.value.pageSize))
)
const paged = computed(() => {
  const start = paginationState.value.pageIndex * paginationState.value.pageSize
  return secciones.value.slice(start, start + paginationState.value.pageSize)
})

const onPaginationChange = (updater: any) => {
  paginationState.value =
    typeof updater === 'function'
      ? updater(paginationState.value)
      : { ...paginationState.value, ...updater }
}

const loadSecciones = async () => {
  if (!selectedCourse.value) return
  isLoading.value = true
  paginationState.value = { ...paginationState.value, pageIndex: 0 }
  try {
    secciones.value = await fetchSeccionesByCurso(selectedCourse.value.id).catch(() => [])
  } finally {
    isLoading.value = false
  }
}

const selectCourse = async (curso: Curso) => {
  selectedCourse.value = curso
  courseQuery.value = ''
  isCourseOpen.value = false
  const labs = await fetchLaboratoriosByCurso(curso.id).catch(() => [])
  courseHasLabs.value = labs.length > 0
  loadSecciones()
}

const clearCourse = () => {
  selectedCourse.value = null
  secciones.value = []
  courseHasLabs.value = false
  courseQuery.value = ''
  isCourseOpen.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteSeccion(id)
    await loadSecciones()
  } catch {
  }
}

const periodoLabel = (id: number | null) => {
  if (id == null) return '—'
  const p = periodoMap.value[id]
  return p ? `#${p.numero} · ${p.hora_inicio}` : `#${id}`
}

const columns: ColumnDef<Seccion>[] = [
  {
    accessorKey: 'letra',
    meta: { displayName: 'Letra' },
    header: () => <div class="font-semibold">Letra</div>,
    cell: ({ row }) => (
      <span class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
        {row.getValue('letra')}
      </span>
    )
  },
  {
    accessorKey: 'num_estudiantes_seccion',
    meta: { displayName: 'Estudiantes' },
    header: () => <div class="font-semibold">Estudiantes</div>,
    cell: ({ row }) => {
      const val = row.getValue('num_estudiantes_seccion') as number | null
      return <div class="text-center">{val ?? '—'}</div>
    }
  },
  {
    accessorKey: 'docente_fijo_id',
    meta: { displayName: 'Docente fijo' },
    header: () => <div class="font-semibold">Docente fijo</div>,
    cell: ({ row }) => {
      const id = row.getValue('docente_fijo_id') as number | null
      const docente = id != null ? docenteMap.value[id] : null
      return docente
        ? <span class="text-sm">{docente.nombre}</span>
        : <span class="text-muted-foreground text-xs">—</span>
    }
  },
  {
    accessorKey: 'salon_fijo_id',
    meta: { displayName: 'Salón fijo' },
    header: () => <div class="font-semibold">Salón fijo</div>,
    cell: ({ row }) => {
      if (row.original.sin_salon) {
        return <span class="text-muted-foreground text-xs italic">Sin salón</span>
      }
      const id = row.getValue('salon_fijo_id') as number | null
      const salon = id != null ? salonMap.value[id] : null
      return salon
        ? <span class="text-sm">{salon.nombre}</span>
        : <span class="text-muted-foreground text-xs">—</span>
    }
  },
  {
    accessorKey: 'periodo_fijo_inicio_id',
    meta: { displayName: 'Período fijo' },
    header: () => <div class="font-semibold">Período fijo</div>,
    cell: ({ row }) => {
      const label = periodoLabel(row.getValue('periodo_fijo_inicio_id') as number | null)
      return label === '—'
        ? <span class="text-muted-foreground text-xs">—</span>
        : <span class="text-sm">{label}</span>
    }
  },
  {
    id: 'actions',
    meta: { displayName: 'Acciones' },
    header: () => <div class="font-semibold">Acciones</div>,
    cell: ({ row }) => (
      <div class="flex items-center gap-2">
        {courseHasLabs.value && (
          <SectionLabDialog
            seccionId={row.original.id}
            cursoId={row.original.curso_id}
            seccionLetra={row.original.letra}
          />
        )}
        <SectionFormDialog seccionId={row.original.id} onSection-saved={loadSecciones} />
        <DeleteItemDialog onConfirm={() => handleDelete(row.original.id)}>
          <Button icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
        </DeleteItemDialog>
      </div>
    )
  }
]
</script>
