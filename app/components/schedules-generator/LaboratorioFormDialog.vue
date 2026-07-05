<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button
        label="Nuevo laboratorio"
        icon="lucide:plus"
        class="w-fit"
        @click="resetForm"
      />
    </DialogTrigger>
    <DialogTrigger v-else as-child>
      <Button
        label="Editar"
        variant="tonal"
        icon="lucide:pencil"
        class="px-3 py-1 text-sm"
        @click="resetForm"
      />
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar laboratorio' : 'Crear nuevo laboratorio' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos del laboratorio' : 'Crea un nuevo laboratorio' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <CSelect
            v-model="selectedCursoId"
            label="Curso *"
            placeholder="Selecciona un curso"
            :items="cursoItems"
            option-label="label"
            option-value="value"
            :error="errors.curso_id"
            class="w-full"
          />
          <p v-if="cursoItems.length === 0" class="mt-1 text-xs text-muted-foreground">
            No hay cursos con laboratorio habilitado. Activa "tiene laboratorio" en un curso primero.
          </p>
        </div>

        <div>
          <CInputText
            v-model="formData.nombre"
            placeholder="Se completa con el curso (editable)"
            class="w-full"
            label="Nombre"
          />
        </div>

        <div>
          <CInputText
            v-model="numPeriodosModel"
            type="number"
            min="1"
            step="1"
            placeholder="Ej: 3"
            :error="errors.num_periodos"
            class="w-full"
            label="Número de períodos"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2">
            <Checkbox id="puede_manana" v-model="formData.puede_manana" class="cursor-pointer" />
            <label for="puede_manana" class="text-sm font-medium cursor-pointer">Puede mañana</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="puede_tarde" v-model="formData.puede_tarde" class="cursor-pointer" />
            <label for="puede_tarde" class="text-sm font-medium cursor-pointer">Puede tarde</label>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox id="activo" v-model="formData.activo" class="cursor-pointer" />
          <label for="activo" class="text-sm font-medium cursor-pointer">Activo</label>
        </div>

        <DialogFooter class="flex gap-2 pt-4">
          <DialogClose as-child>
            <Button type="button" label="Cancelar" variant="text" />
          </DialogClose>
          <Button type="submit" label="Guardar" :loading="isLoading" severity="success" />
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Dialog from '~/components/ui/dialog/Dialog.vue'
import DialogTrigger from '~/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '~/components/ui/dialog/DialogContent.vue'
import DialogHeader from '~/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '~/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '~/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '~/components/ui/dialog/DialogFooter.vue'
import DialogClose from '~/components/ui/dialog/DialogClose.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import { Checkbox } from '~/components/ui/checkbox'
import { createLaboratorio, updateLaboratorio, fetchLaboratorioById } from '~/lib/api/schedules-generator/laboratorios'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import type { Laboratorio, CreateLaboratorioInput, Curso } from '~/lib/api/schedules-generator/types'

interface Props {
  laboratorioId?: number
}

const props = withDefaults(defineProps<Props>(), {
  laboratorioId: undefined
})

const emit = defineEmits<{
  'laboratorio-saved': [laboratorio: Laboratorio]
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.laboratorioId)

const cursos = ref<Curso[]>([])

const formData = reactive<CreateLaboratorioInput>({
  curso_id: 0,
  nombre: '',
  num_periodos: 3,
  puede_manana: true,
  puede_tarde: true,
  activo: true
})

const errors = reactive({
  curso_id: '',
  num_periodos: ''
})

// Dropdown: solo cursos con tiene_laboratorio = true
const cursoItems = computed(() =>
  cursos.value
    .filter((c) => c.tiene_laboratorio)
    .map((c) => ({ label: `${c.codigo} — ${c.nombre}`, value: String(c.id) }))
)

// Nombre sugerido a partir del curso: "Laboratorio de NOMBRE"
const suggestedName = (cursoId: number) => {
  const curso = cursos.value.find((c) => c.id === cursoId)
  return curso ? `Laboratorio de ${curso.nombre}` : ''
}

// Puente string <-> number para el CSelect (emite strings)
const selectedCursoId = computed({
  get: () => (formData.curso_id ? String(formData.curso_id) : ''),
  set: (val: string | null) => {
    const prevId = formData.curso_id
    const nextId = val ? Number(val) : 0
    formData.curso_id = nextId

    // Autocompleta el nombre solo si está vacío o si el usuario no lo había
    // tocado (seguía con el nombre sugerido del curso anterior).
    if (nextId && (!formData.nombre.trim() || formData.nombre === suggestedName(prevId))) {
      formData.nombre = suggestedName(nextId)
    }
  }
})

// num_periodos como entero positivo
const numPeriodosModel = computed({
  get: () => (formData.num_periodos == null ? '' : String(formData.num_periodos)),
  set: (val: string) => {
    const digits = String(val).replace(/\D/g, '')
    formData.num_periodos = digits === '' ? undefined : Number(digits)
  }
})

const resetForm = () => {
  formData.curso_id = 0
  formData.nombre = ''
  formData.num_periodos = 3
  formData.puede_manana = true
  formData.puede_tarde = true
  formData.activo = true
  errors.curso_id = ''
  errors.num_periodos = ''
}

const validateForm = () => {
  errors.curso_id = ''
  errors.num_periodos = ''
  let isValid = true

  if (!formData.curso_id) {
    errors.curso_id = 'Debes seleccionar un curso'
    isValid = false
  }

  if (
    formData.num_periodos != null &&
    (!Number.isInteger(formData.num_periodos) || formData.num_periodos < 1)
  ) {
    errors.num_periodos = 'Los períodos deben ser un entero positivo'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    let result: Laboratorio
    if (isEditing.value && props.laboratorioId) {
      result = await updateLaboratorio(props.laboratorioId, formData)
    } else {
      result = await createLaboratorio(formData)
    }
    emit('laboratorio-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error: any) {
    const message = (error?.data?.error ?? error?.data?.message ?? '').toLowerCase()
    if (error?.status === 409) {
      errors.curso_id = 'El curso ya tiene un laboratorio asignado'
    } else if (error?.status === 404 && message.includes('curso')) {
      errors.curso_id = 'El curso indicado no existe'
    }
  } finally {
    isLoading.value = false
  }
}

const loadCursos = async () => {
  cursos.value = await fetchCursos().catch(() => [])
}

const loadLaboratorioData = async () => {
  if (!props.laboratorioId) return
  const lab = await fetchLaboratorioById(props.laboratorioId).catch(() => null)
  if (!lab) return
  formData.curso_id = lab.curso_id
  formData.nombre = lab.nombre ?? ''
  formData.num_periodos = lab.num_periodos
  formData.puede_manana = lab.puede_manana
  formData.puede_tarde = lab.puede_tarde
  formData.activo = lab.activo
}

watch(
  () => isOpen.value,
  async (newVal) => {
    if (!newVal) return
    await loadCursos()
    if (isEditing.value) {
      await loadLaboratorioData()
    } else {
      resetForm()
    }
  }
)
</script>
