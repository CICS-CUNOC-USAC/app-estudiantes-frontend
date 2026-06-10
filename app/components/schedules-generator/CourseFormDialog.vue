<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button label="Nuevo curso" icon="lucide:plus" class="w-fit" @click="resetForm" />
    </DialogTrigger>
    <DialogTrigger v-else as-child>
      <Button label="Editar" variant="tonal" icon="lucide:pencil" class="px-3 py-1 text-sm" @click="resetForm" />
    </DialogTrigger>

    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar curso' : 'Crear nuevo curso' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos del curso' : 'Crea un nuevo curso' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <CInputText
          v-model="formData.nombre"
          label="Nombre *"
          placeholder="Ej: Introducción a la Programación"
          :error="errors.nombre"
          class="w-full"
        />

        <div class="grid grid-cols-2 gap-3">
          <CInputText
            v-model="formData.codigo"
            label="Código *"
            placeholder="Ej: IP-01"
            :error="errors.codigo"
            class="w-full"
          />

          <CInputText
            v-model.number="formData.semestre"
            type="number"
            label="Semestre *"
            placeholder="Ej: 1"
            :error="errors.semestre"
            class="w-full"
          />
        </div>

        <CSelect
          v-model="formData.tipo"
          label="Tipo *"
          placeholder="Selecciona un tipo"
          :items="tipoItems"
          option-label="label"
          option-value="value"
          :error="errors.tipo"
          class="w-full"
        />

        <CSelect
          v-model="selectedCarreraId"
          label="Carrera"
          placeholder="Sin carrera"
          :items="carreraItems"
          option-label="label"
          option-value="value"
          clearable
          class="w-full"
        />

        <CInputText
          v-model.number="formData.num_estudiantes"
          type="number"
          label="Número de estudiantes"
          placeholder="Ej: 30"
          class="w-full"
        />

        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <Checkbox id="puede_manana" v-model="formData.puede_manana" class="cursor-pointer" />
            <label for="puede_manana" class="text-sm font-medium cursor-pointer">Puede mañana</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="puede_tarde" v-model="formData.puede_tarde" class="cursor-pointer" />
            <label for="puede_tarde" class="text-sm font-medium cursor-pointer">Puede tarde</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="tiene_laboratorio" v-model="formData.tiene_laboratorio" class="cursor-pointer" />
            <label for="tiene_laboratorio" class="text-sm font-medium cursor-pointer">Tiene laboratorio</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="activo" v-model="formData.activo" class="cursor-pointer" />
            <label for="activo" class="text-sm font-medium cursor-pointer">Activo</label>
          </div>
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
import { createCurso, updateCurso, fetchCursoById } from '~/lib/api/schedules-generator/cursos'
import { fetchCarreras } from '~/lib/api/schedules-generator/carreras'
import type { Carrera, Curso, CreateCursoInput } from '~/lib/api/schedules-generator/types'

const props = withDefaults(defineProps<{
  cursoId?: number
  preselectedCarreraId?: number
}>(), { cursoId: undefined, preselectedCarreraId: undefined })

const emit = defineEmits<{ 'curso-saved': [curso: Curso] }>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.cursoId)
const carreras = ref<Carrera[]>([])

const tipoItems = [
  { label: 'Obligatorio', value: 'obligatorio' },
  { label: 'Optativo', value: 'optativo' }
]

const carreraItems = computed(() =>
  carreras.value.map((c) => ({ label: `${c.codigo} — ${c.nombre}`, value: String(c.id) }))
)

const defaultForm = (): CreateCursoInput => ({
  nombre: '',
  codigo: '',
  carrera_id: props.preselectedCarreraId ?? null,
  semestre: 1,
  tipo: 'obligatorio',
  num_estudiantes: null,
  puede_manana: true,
  puede_tarde: true,
  tiene_laboratorio: false,
  activo: true
})

const formData = reactive<CreateCursoInput>(defaultForm())
const errors = reactive({ nombre: '', codigo: '', semestre: '', tipo: '' })

const selectedCarreraId = computed({
  get: () => formData.carrera_id != null ? String(formData.carrera_id) : null,
  set: (val: string | null) => { formData.carrera_id = val ? Number(val) : null }
})

const resetForm = () => {
  const d = defaultForm()
  Object.assign(formData, d)
  errors.nombre = ''
  errors.codigo = ''
  errors.semestre = ''
  errors.tipo = ''
}

const validateForm = () => {
  errors.nombre = ''
  errors.codigo = ''
  errors.semestre = ''
  errors.tipo = ''
  let valid = true
  if (!formData.nombre.trim()) { errors.nombre = 'El nombre es requerido'; valid = false }
  if (!formData.codigo.trim()) { errors.codigo = 'El código es requerido'; valid = false }
  if (!formData.semestre || formData.semestre < 1) { errors.semestre = 'Semestre inválido'; valid = false }
  if (!formData.tipo) { errors.tipo = 'El tipo es requerido'; valid = false }
  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    let result: Curso
    if (isEditing.value && props.cursoId) {
      result = await updateCurso(props.cursoId, formData)
    } else {
      result = await createCurso(formData)
    }
    emit('curso-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message ?? ''
    if (error?.status === 409 && message.toLowerCase().includes('nombre')) {
      errors.nombre = 'Ya existe un curso con ese nombre'
    }
  } finally {
    isLoading.value = false
  }
}

const loadData = async () => {
  carreras.value = await fetchCarreras().catch(() => [])
}

const loadCursoData = async () => {
  if (!props.cursoId) return
  const curso = await fetchCursoById(props.cursoId).catch(() => null)
  if (!curso) return
  formData.nombre = curso.nombre
  formData.codigo = curso.codigo
  formData.carrera_id = curso.carrera_id
  formData.semestre = curso.semestre
  formData.tipo = curso.tipo
  formData.num_estudiantes = curso.num_estudiantes
  formData.puede_manana = curso.puede_manana
  formData.puede_tarde = curso.puede_tarde
  formData.tiene_laboratorio = curso.tiene_laboratorio
  formData.activo = curso.activo
}

watch(isOpen, async (open) => {
  if (!open) return
  await loadData()
  if (isEditing.value) {
    await loadCursoData()
  } else {
    resetForm()
  }
})
</script>
