<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button label="Nueva sección" icon="lucide:plus" class="w-fit" @click="resetForm" />
    </DialogTrigger>
    <DialogTrigger v-else as-child>
      <Button label="Editar" variant="tonal" icon="lucide:pencil" class="px-3 py-1 text-sm" @click="resetForm" />
    </DialogTrigger>

    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar sección' : 'Crear nueva sección' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos de la sección' : 'Crea una nueva sección' }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <CSelect
          v-model="selectedCursoId"
          label="Curso *"
          placeholder="Selecciona un curso"
          :items="cursoItems"
          option-label="label"
          option-value="value"
          :disabled="cursoLocked"
          :error="errors.curso_id"
          class="w-full"
        />

        <div class="grid grid-cols-2 gap-3">
          <CInputText
            v-model="formData.letra"
            label="Letra *"
            placeholder="Ej: A"
            :error="errors.letra"
            class="w-full"
          />
          <CInputText
            v-model.number="formData.num_estudiantes_seccion"
            type="number"
            label="N° de estudiantes"
            placeholder="Ej: 30"
            class="w-full"
          />
        </div>

        <p class="text-muted-foreground text-xs">
          Campos opcionales para fijar recursos. Deja en «Sin fijar» para que el algoritmo los asigne.
        </p>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CSelect
            v-model="selectedSalonId"
            label="Salón fijo"
            placeholder="Sin fijar"
            :items="salonItems"
            option-label="label"
            option-value="value"
            clearable
            :disabled="formData.sin_salon"
            :error="errors.salon_fijo_id"
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
            :error="errors.docente_fijo_id"
            class="w-full"
          />
          <CSelect
            v-model="selectedPeriodoId"
            label="Período inicio fijo"
            placeholder="Sin fijar"
            :items="periodoItems"
            option-label="label"
            option-value="value"
            clearable
            :error="errors.periodo_fijo_inicio_id"
            class="w-full"
          />
          <CSelect
            v-model="selectedDiaHorarioId"
            label="Día de horario fijo"
            placeholder="Sin fijar"
            :items="diaHorarioItems"
            option-label="label"
            option-value="value"
            clearable
            :error="errors.dia_horario_fijo_id"
            class="w-full"
          />
        </div>

        <div
          class="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium select-none"
          @click="formData.sin_salon = !formData.sin_salon"
        >
          <Checkbox :model-value="formData.sin_salon" class="pointer-events-none" />
          Sin salón
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
import { createSeccion, updateSeccion, fetchSeccionById, mapSeccionFkError } from '~/lib/api/schedules-generator/secciones'
import { fetchCursos } from '~/lib/api/schedules-generator/cursos'
import { fetchSalones } from '~/lib/api/schedules-generator/salones'
import { fetchTeachers } from '~/lib/api/schedules-generator/teachers'
import { fetchPeriods } from '~/lib/api/schedules-generator/periods'
import { fetchDiasHorario } from '~/lib/api/schedules-generator/dias-horario'
import type { Curso, Salon, Teacher, DiaHorario, Seccion, CreateSeccionInput } from '~/lib/api/schedules-generator/types'
import type { Period } from '~/lib/api/schedules-generator/periods'

const props = withDefaults(defineProps<{
  seccionId?: number
  preselectedCursoId?: number
}>(), { seccionId: undefined, preselectedCursoId: undefined })

const emit = defineEmits<{ 'section-saved': [seccion: Seccion] }>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.seccionId)

const cursos = ref<Curso[]>([])
const salones = ref<Salon[]>([])
const docentes = ref<Teacher[]>([])
const periodos = ref<Period[]>([])
const diasHorario = ref<DiaHorario[]>([])

const cursoLocked = computed(() => isEditing.value || props.preselectedCursoId != null)

const cursoItems = computed(() =>
  cursos.value.map((c) => ({ label: `${c.codigo} — ${c.nombre}`, value: String(c.id) }))
)
const salonItems = computed(() =>
  salones.value.map((s) => ({
    label: s.capacidad != null ? `${s.nombre} (cap. ${s.capacidad})` : s.nombre,
    value: String(s.id)
  }))
)
const docenteItems = computed(() =>
  docentes.value.map((d) => ({ label: d.nombre, value: String(d.id) }))
)
const periodoItems = computed(() =>
  periodos.value.map((p) => ({ label: `#${p.numero} · ${p.hora_inicio}–${p.hora_fin}`, value: String(p.id) }))
)
const diaHorarioItems = computed(() =>
  diasHorario.value.map((d) => ({ label: d.nombre, value: String(d.id) }))
)

const defaultForm = (): CreateSeccionInput => ({
  curso_id: props.preselectedCursoId ?? 0,
  letra: '',
  num_estudiantes_seccion: null,
  salon_fijo_id: null,
  docente_fijo_id: null,
  periodo_fijo_inicio_id: null,
  dia_horario_fijo_id: null,
  sin_salon: false
})

const formData = reactive<CreateSeccionInput>(defaultForm())
const errors = reactive({
  curso_id: '',
  letra: '',
  salon_fijo_id: '',
  docente_fijo_id: '',
  periodo_fijo_inicio_id: '',
  dia_horario_fijo_id: ''
})

type NullableIdField =
  | 'salon_fijo_id'
  | 'docente_fijo_id'
  | 'periodo_fijo_inicio_id'
  | 'dia_horario_fijo_id'

const makeIdProxy = (key: NullableIdField) =>
  computed<string | null>({
    get: () => (formData[key] != null ? String(formData[key]) : null),
    set: (val) => { formData[key] = val ? Number(val) : null }
  })

const selectedCursoId = computed<string | null>({
  get: () => (formData.curso_id ? String(formData.curso_id) : null),
  set: (val) => { formData.curso_id = val ? Number(val) : 0 }
})
const selectedSalonId = makeIdProxy('salon_fijo_id')
const selectedDocenteId = makeIdProxy('docente_fijo_id')
const selectedPeriodoId = makeIdProxy('periodo_fijo_inicio_id')
const selectedDiaHorarioId = makeIdProxy('dia_horario_fijo_id')

watch(() => formData.sin_salon, (sinSalon) => {
  if (sinSalon) formData.salon_fijo_id = null
})

const clearErrors = () => {
  errors.curso_id = ''
  errors.letra = ''
  errors.salon_fijo_id = ''
  errors.docente_fijo_id = ''
  errors.periodo_fijo_inicio_id = ''
  errors.dia_horario_fijo_id = ''
}

const resetForm = () => {
  Object.assign(formData, defaultForm())
  clearErrors()
}

const validateForm = () => {
  clearErrors()
  let valid = true
  if (!formData.curso_id) { errors.curso_id = 'El curso es requerido'; valid = false }
  if (!formData.letra.trim()) { errors.letra = 'La letra es requerida'; valid = false }
  return valid
}

const buildPayload = (): CreateSeccionInput => ({
  curso_id: formData.curso_id,
  letra: formData.letra.trim(),
  num_estudiantes_seccion: formData.num_estudiantes_seccion || null,
  salon_fijo_id: formData.sin_salon ? null : formData.salon_fijo_id,
  docente_fijo_id: formData.docente_fijo_id,
  periodo_fijo_inicio_id: formData.periodo_fijo_inicio_id,
  dia_horario_fijo_id: formData.dia_horario_fijo_id,
  sin_salon: formData.sin_salon
})

const handleSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    const payload = buildPayload()
    let result: Seccion
    if (isEditing.value && props.seccionId) {
      result = await updateSeccion(props.seccionId, payload)
    } else {
      result = await createSeccion(payload)
    }
    emit('section-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error: any) {
    if (error?.status === 404) {
      const message = error?.data?.error ?? error?.data?.message
      const field = mapSeccionFkError(message)
      if (field) {
        errors[field] = message ?? 'Referencia no encontrada'
      } else {
        errors.curso_id = message ?? 'Una referencia no existe'
      }
    }
  } finally {
    isLoading.value = false
  }
}

const loadCatalogs = async () => {
  const [c, s, d, p, dh] = await Promise.all([
    fetchCursos().catch(() => []),
    fetchSalones().catch(() => []),
    fetchTeachers().then((r) => r.results).catch(() => []),
    fetchPeriods().then((r) => r ?? []).catch(() => []),
    fetchDiasHorario().catch(() => [])
  ])
  cursos.value = c
  salones.value = s
  docentes.value = d
  periodos.value = p
  diasHorario.value = dh
}

const loadSeccionData = async () => {
  if (!props.seccionId) return
  const seccion = await fetchSeccionById(props.seccionId).catch(() => null)
  if (!seccion) return
  formData.curso_id = seccion.curso_id
  formData.letra = seccion.letra
  formData.num_estudiantes_seccion = seccion.num_estudiantes_seccion
  formData.salon_fijo_id = seccion.salon_fijo_id
  formData.docente_fijo_id = seccion.docente_fijo_id
  formData.periodo_fijo_inicio_id = seccion.periodo_fijo_inicio_id
  formData.dia_horario_fijo_id = seccion.dia_horario_fijo_id
  formData.sin_salon = seccion.sin_salon
}

watch(isOpen, async (open) => {
  if (!open) return
  await loadCatalogs()
  if (isEditing.value) {
    await loadSeccionData()
  } else {
    resetForm()
  }
})
</script>
