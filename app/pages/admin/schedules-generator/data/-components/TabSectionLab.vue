<template>
  <div class="space-y-4">
    <div class="sticky top-0 z-10 grid grid-cols-1 gap-4 py-4 md:grid-cols-[fit-content(100%)_1fr_fit-content(100%)]">
      <Dialog v-model:open="isCreateModalOpen">
        <DialogTrigger as-child>
          <Button icon="lucide:plus" label="Nueva sección de laboratorio" @click="resetCreateForm" />
        </DialogTrigger>
        <DialogContent class="max-w-xl">
          <DialogHeader>
            <DialogTitle>Agregar sección de laboratorio</DialogTitle>
            <DialogDescription>
              Selecciona una sección, el laboratorio y los recursos opcionales.
            </DialogDescription>
          </DialogHeader>

          <form class="space-y-4" @submit.prevent="handleCreate">
            <CSelect
              v-model="selectedSeccionId"
              label="Sección *"
              placeholder="Selecciona una sección"
              :items="sectionItems"
              option-label="label"
              option-value="value"
              :error="createErrors.seccion_id"
              class="w-full"
            />

            <CSelect
              v-model="selectedLaboratorioId"
              label="Laboratorio *"
              :placeholder="laboratorioPlaceholder"
              :items="laboratorioItems"
              option-label="label"
              option-value="value"
              :disabled="!selectedSeccion"
              :error="createErrors.laboratorio_id"
              class="w-full"
            />

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CSelect
                v-model="selectedSalonId"
                label="Salón fijo"
                placeholder="Sin fijar"
                :items="salonItems"
                option-label="label"
                option-value="value"
                clearable
                class="w-full"
              />
              <CSelect
                v-model="selectedDocenteId"
                label="Docente fijo"
                placeholder="Sin fijar"
                :items="docenteItems"
                option-label="label"
                option-value="value"
                clearable
                class="w-full"
              />
            </div>

            <div class="flex justify-end gap-2">
              <Button type="button" label="Cancelar" variant="text" @click="isCreateModalOpen = false" />
              <Button type="submit" label="Agregar" severity="success" :loading="isCreating" />
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CInputText
        placeholder="Buscar por sección, curso, laboratorio, salón o docente"
        label="Buscar"
        id="section_lab_search"
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
            <DialogTitle>Importar Secciones de Laboratorio</DialogTitle>
            <DialogDescription>Sube un CSV con datos de secciones de laboratorio</DialogDescription>
          </DialogHeader>
          <ImportCard
            title="Importar Secciones de Laboratorio"
            description="Sube un CSV con datos de secciones de laboratorio"
            import-type="section-lab"
            @imported="() => { isImportModalOpen = false; refreshData() }"
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
      table-key-name="schedules-section-lab"
      @pagination-change="onPaginationChange"
    />
  </div>
</template>

<script setup lang="tsx">
import type { ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import DataTable from '~/components/partials/datatable/DataTable.vue'
import ImportCard from '../../-components/ImportCard.vue'
import { useTableSearch } from '~/composables/Usetablesearch'
import { createSeccionLab, deleteSeccionLab, fetchSeccionLab } from '~/lib/api/schedules-generator/seccion-laboratorio'
import { fetchSecciones } from '~/lib/api/schedules-generator/secciones'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import { fetchLaboratorios } from '~/lib/api/schedules-generator/laboratorios'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import type { SeccionLaboratorio, Seccion, Curso, Laboratorio, Salon, Teacher } from '~/lib/api/schedules-generator/types'

const isCreateModalOpen = ref(false)
const isImportModalOpen = ref(false)
const isCreating = ref(false)

const { data, refresh } = await useAsyncData('schedules-section-labs', async () => {
  const [sectionLabs, secciones, cursos, laboratorios, salones, teachersResponse] = await Promise.all([
    fetchSeccionLab(),
    fetchSecciones(),
    fetchCursos(),
    fetchLaboratorios(),
    fetchSalones(),
    fetchTeachers(),
  ])

  return {
    sectionLabs,
    secciones,
    cursos,
    laboratorios,
    salones,
    teachers: teachersResponse.results,
  }
})

const refreshData = async () => {
  await refresh()
}

const allSectionLabs = computed<SeccionLaboratorio[]>(() => data.value?.sectionLabs ?? [])
const allSecciones = computed<Seccion[]>(() => data.value?.secciones ?? [])
const allCursos = computed<Curso[]>(() => data.value?.cursos ?? [])
const allLaboratorios = computed<Laboratorio[]>(() => data.value?.laboratorios ?? [])
const allSalones = computed<Salon[]>(() => data.value?.salones ?? [])
const allTeachers = computed<Teacher[]>(() => data.value?.teachers ?? [])

const cursosConLaboratorio = computed(() => {
  return new Set(allLaboratorios.value.map((lab) => lab.curso_id))
})

const seccionesConLaboratorio = computed(() => {
  return allSecciones.value.filter((seccion) => cursosConLaboratorio.value.has(seccion.curso_id))
})

const cursoMap = computed(() => new Map(allCursos.value.map((curso) => [curso.id, curso])))
const seccionMap = computed(() => new Map(allSecciones.value.map((seccion) => [seccion.id, seccion])))
const laboratorioMap = computed(() => new Map(allLaboratorios.value.map((lab) => [lab.id, lab])))
const salonMap = computed(() => new Map(allSalones.value.map((salon) => [salon.id, salon])))
const teacherMap = computed(() => new Map(allTeachers.value.map((teacher) => [teacher.id, teacher])))

const sectionLabel = (sectionId: number) => {
  const seccion = seccionMap.value.get(sectionId)
  if (!seccion) return `Sección #${sectionId}`

  const curso = cursoMap.value.get(seccion.curso_id)
  const cursoLabel = curso ? `${curso.codigo} — ${curso.nombre}` : `Curso #${seccion.curso_id}`
  return `${cursoLabel} · Sección ${seccion.letra}`
}

const laboratorioLabel = (labId: number) => laboratorioMap.value.get(labId)?.nombre ?? `Laboratorio #${labId}`
const salonLabel = (salonId: number | null) => (salonId != null ? salonMap.value.get(salonId)?.nombre ?? `#${salonId}` : '—')
const docenteLabel = (docenteId: number | null) => (docenteId != null ? teacherMap.value.get(docenteId)?.nombre ?? `#${docenteId}` : '—')

const { searchQuery, currentPage, filtered, totalPages, paged, handleSearch, handleClear } =
  useTableSearch(allSectionLabs, (rel, q) => {
    return (
      sectionLabel(rel.seccion_id).toLowerCase().includes(q) ||
      laboratorioLabel(rel.laboratorio_id).toLowerCase().includes(q) ||
      salonLabel(rel.salon_fijo_id).toLowerCase().includes(q) ||
      docenteLabel(rel.docente_fijo_id).toLowerCase().includes(q)
    )
  })

const paginationState = ref({ pageIndex: 0, pageSize: 10 })

const onPaginationChange = (updater: any) => {
  const next = typeof updater === 'function' ? updater(paginationState.value) : { ...paginationState.value, ...updater }
  paginationState.value = next
  currentPage.value = next.pageIndex + 1
}

const isCreateFormValid = () => !!selectedSeccionId.value && !!selectedLaboratorioId.value

const selectedSeccionId = ref<string | null>(null)
const selectedLaboratorioId = ref<string | null>(null)
const selectedSalonId = ref<string | null>(null)
const selectedDocenteId = ref<string | null>(null)
const createErrors = reactive({ seccion_id: '', laboratorio_id: '' })

const selectedSeccion = computed(() => {
  const id = selectedSeccionId.value ? Number(selectedSeccionId.value) : null
  return id != null ? seccionMap.value.get(id) ?? null : null
})

const assignedLabIds = computed(() => {
  const id = selectedSeccion.value?.id
  if (!id) return new Set<number>()
  return new Set(
    allSectionLabs.value
      .filter((rel) => rel.seccion_id === id)
      .map((rel) => rel.laboratorio_id)
  )
})

const availableLabs = computed(() => {
  if (!selectedSeccion.value) return []
  return allLaboratorios.value.filter((lab) => lab.curso_id === selectedSeccion.value!.curso_id && !assignedLabIds.value.has(lab.id))
})

const sectionItems = computed(() =>
  seccionesConLaboratorio.value.map((seccion) => ({
    label: `${sectionLabel(seccion.id)}`,
    value: String(seccion.id),
  }))
)

const laboratorioItems = computed(() =>
  availableLabs.value.map((lab) => ({
    label: lab.nombre,
    value: String(lab.id),
  }))
)

const salonItems = computed(() =>
  allSalones.value.map((salon) => ({
    label: salon.capacidad != null ? `${salon.nombre} (cap. ${salon.capacidad})` : salon.nombre,
    value: String(salon.id),
  }))
)

const docenteItems = computed(() =>
  allTeachers.value.map((teacher) => ({
    label: teacher.nombre,
    value: String(teacher.id),
  }))
)

const laboratorioPlaceholder = computed(() => {
  if (!selectedSeccion.value) return 'Selecciona una sección primero'
  if (availableLabs.value.length === 0) return 'No hay laboratorios disponibles'
  return 'Selecciona un laboratorio'
})

watch(selectedSeccionId, () => {
  selectedLaboratorioId.value = null
  selectedSalonId.value = null
  selectedDocenteId.value = null
  createErrors.seccion_id = ''
  createErrors.laboratorio_id = ''
})

const resetCreateForm = () => {
  selectedSeccionId.value = null
  selectedLaboratorioId.value = null
  selectedSalonId.value = null
  selectedDocenteId.value = null
  createErrors.seccion_id = ''
  createErrors.laboratorio_id = ''
}

const handleCreate = async () => {
  createErrors.seccion_id = selectedSeccionId.value ? '' : 'Selecciona una sección'
  createErrors.laboratorio_id = selectedLaboratorioId.value ? '' : 'Selecciona un laboratorio'
  if (!isCreateFormValid()) return

  isCreating.value = true
  try {
    await createSeccionLab({
      seccion_id: Number(selectedSeccionId.value),
      laboratorio_id: Number(selectedLaboratorioId.value),
      salon_fijo_id: selectedSalonId.value ? Number(selectedSalonId.value) : null,
      docente_fijo_id: selectedDocenteId.value ? Number(selectedDocenteId.value) : null,
    })
    isCreateModalOpen.value = false
    resetCreateForm()
    await refreshData()
  } catch {
  } finally {
    isCreating.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteSeccionLab(id)
    await refreshData()
  } catch {
  }
}



const columns: ColumnDef<SeccionLaboratorio>[] = [
  {
    id: 'seccion',
    meta: { displayName: 'Sección' },
    header: () => <div class="font-semibold">Sección</div>,
    cell: ({ row }) => <div>{sectionLabel(row.original.seccion_id)}</div>,
  },
  {
    id: 'laboratorio',
    meta: { displayName: 'Laboratorio' },
    header: () => <div class="font-semibold">Laboratorio</div>,
    cell: ({ row }) => <div>{laboratorioLabel(row.original.laboratorio_id)}</div>,
  },
  {
    id: 'salon',
    meta: { displayName: 'Salón fijo' },
    header: () => <div class="font-semibold">Salón fijo</div>,
    cell: ({ row }) => <div class="text-muted-foreground">{salonLabel(row.original.salon_fijo_id)}</div>,
  },
  {
    id: 'docente',
    meta: { displayName: 'Docente fijo' },
    header: () => <div class="font-semibold">Docente fijo</div>,
    cell: ({ row }) => <div class="text-muted-foreground">{docenteLabel(row.original.docente_fijo_id)}</div>,
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
