<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button label="Laboratorios" variant="tonal" icon="lucide:beaker" class="px-3 py-1 text-sm" />
    </DialogTrigger>

    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Laboratorios de la sección {{ seccionLetra }}</DialogTitle>
        <DialogDescription>
          Gestiona los laboratorios asignados a esta sección.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-2">
        <p class="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Laboratorios asignados
        </p>

        <div v-if="isLoadingList" class="space-y-2">
          <Skeleton class="h-16 w-full" />
          <Skeleton class="h-16 w-full" />
        </div>

        <p
          v-else-if="seccionLabs.length === 0"
          class="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm"
        >
          Esta sección no tiene laboratorios asignados.
        </p>

        <ul v-else class="space-y-2">
          <li
            v-for="sl in seccionLabs"
            :key="sl.id"
            class="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            <div class="min-w-0">
              <p class="text-foreground truncate text-sm font-medium">
                {{ labName(sl.laboratorio_id) }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-xs">
                <Icon name="lucide:map-pin" size="12" class="mb-0.5 inline" />
                {{ salonName(sl.salon_fijo_id) }}
                <span class="mx-1">·</span>
                <Icon name="lucide:user" size="12" class="mb-0.5 inline" />
                {{ docenteName(sl.docente_fijo_id) }}
              </p>
            </div>
            <DeleteItemDialog @confirm="handleDelete(sl.id)">
              <Button icon="lucide:trash-2" severity="danger" variant="text" size="sm" />
            </DeleteItemDialog>
          </li>
        </ul>
      </div>

      <form class="border-border space-y-3 border-t pt-4" @submit.prevent="handleAdd">
        <p class="text-sm font-semibold">Agregar laboratorio</p>

        <CSelect
          v-model="selectedLabId"
          label="Laboratorio *"
          :placeholder="labPlaceholder"
          :items="labItems"
          option-label="label"
          option-value="value"
          :disabled="!labItems.length"
          :error="addError"
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
            :disabled="!labItems.length"
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
            :disabled="!labItems.length"
            class="w-full"
          />
        </div>

        <div class="flex justify-end">
          <Button
            type="submit"
            label="Agregar"
            icon="lucide:plus"
            severity="success"
            size="sm"
            :loading="isAdding"
            :disabled="!labItems.length"
          />
        </div>
      </form>

      <DialogFooter class="pt-2">
        <DialogClose as-child>
          <Button type="button" label="Cerrar" variant="text" />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogTrigger from '~/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'
import DialogClose from '~/components/ui/dialog/DialogClose.vue'
import Button from '~/components/ui/button/Button.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import { Skeleton } from '~/components/ui/skeleton'
import DeleteItemDialog from '~/components/dialogs/DeleteItemDialog.vue'
import {
  fetchSeccionLabBySeccion,
  createSeccionLab,
  deleteSeccionLab
} from '~/lib/api/schedules-generator/seccion-laboratorio'
import { fetchLaboratoriosByCurso } from '~/lib/api/schedules-generator/laboratorios'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import type { SeccionLaboratorio, Laboratorio, Salon, Teacher } from '~/lib/api/schedules-generator/types'

const props = defineProps<{
  seccionId: number
  cursoId: number
  seccionLetra?: string
}>()

const isOpen = ref(false)
const isLoadingList = ref(false)
const isAdding = ref(false)
const addError = ref('')

const seccionLabs = ref<SeccionLaboratorio[]>([])
const laboratorios = ref<Laboratorio[]>([])
const salones = ref<Salon[]>([])
const docentes = ref<Teacher[]>([])

const selectedLabId = ref<string | null>(null)
const selectedSalonId = ref<string | null>(null)
const selectedDocenteId = ref<string | null>(null)

const salonLabel = (s: Salon) =>
  s.capacidad != null ? `${s.nombre} (cap. ${s.capacidad})` : s.nombre

const labMap = computed(() => Object.fromEntries(laboratorios.value.map((l) => [l.id, l])))
const salonMap = computed(() => Object.fromEntries(salones.value.map((s) => [s.id, s])))
const docenteMap = computed(() => Object.fromEntries(docentes.value.map((d) => [d.id, d])))

const assignedLabIds = computed(() => new Set(seccionLabs.value.map((sl) => sl.laboratorio_id)))
const availableLabs = computed(() =>
  laboratorios.value.filter((l) => !assignedLabIds.value.has(l.id))
)
const labItems = computed(() =>
  availableLabs.value.map((l) => ({ label: l.nombre, value: String(l.id) }))
)
const labPlaceholder = computed(() => {
  if (laboratorios.value.length === 0) return 'El curso no tiene laboratorios'
  if (labItems.value.length === 0) return 'Todos los laboratorios ya están asignados'
  return 'Selecciona un laboratorio'
})
const salonItems = computed(() =>
  salones.value.map((s) => ({ label: salonLabel(s), value: String(s.id) }))
)
const docenteItems = computed(() =>
  docentes.value.map((d) => ({ label: d.nombre, value: String(d.id) }))
)

const labName = (id: number) => labMap.value[id]?.nombre ?? `Lab #${id}`
const salonName = (id: number | null) => (id != null ? salonMap.value[id]?.nombre ?? `#${id}` : '—')
const docenteName = (id: number | null) => (id != null ? docenteMap.value[id]?.nombre ?? `#${id}` : '—')

const resetSubForm = () => {
  selectedLabId.value = null
  selectedSalonId.value = null
  selectedDocenteId.value = null
  addError.value = ''
}

const loadList = async () => {
  isLoadingList.value = true
  try {
    seccionLabs.value = await fetchSeccionLabBySeccion(props.seccionId).catch(() => [])
  } finally {
    isLoadingList.value = false
  }
}

const loadCatalogs = async () => {
  const [labs, s, d] = await Promise.all([
    fetchLaboratoriosByCurso(props.cursoId).catch(() => []),
    fetchSalones().catch(() => []),
    fetchTeachers().then((r) => r.results).catch(() => [])
  ])
  laboratorios.value = labs
  salones.value = s
  docentes.value = d
}

const handleAdd = async () => {
  addError.value = ''
  if (!selectedLabId.value) {
    addError.value = 'Selecciona un laboratorio'
    return
  }
  isAdding.value = true
  try {
    await createSeccionLab({
      seccion_id: props.seccionId,
      laboratorio_id: Number(selectedLabId.value),
      salon_fijo_id: selectedSalonId.value ? Number(selectedSalonId.value) : null,
      docente_fijo_id: selectedDocenteId.value ? Number(selectedDocenteId.value) : null
    })
    resetSubForm()
    await loadList()
  } catch {
  } finally {
    isAdding.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteSeccionLab(id)
    await loadList()
  } catch {
  }
}

watch(isOpen, async (open) => {
  if (!open) return
  resetSubForm()
  await Promise.all([loadCatalogs(), loadList()])
})
</script>
