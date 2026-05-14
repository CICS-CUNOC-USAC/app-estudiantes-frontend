<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button
        label="Nuevo docente"
        icon="lucide:plus"
        class="w-fit"
        @click="resetForm"
      />
    </DialogTrigger>
    <DialogTrigger v-else as-child>
      <button
        @click="resetForm"
        class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center gap-1"
      >
        <Icon name="lucide:pencil" size="16" />
        Editar
      </button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar docente' : 'Crear nuevo docente' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos del docente' : 'Crea un nuevo docente' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="text-sm font-medium mb-1 block">Nombre *</label>
          <CInputText
            v-model="formData.nombre"
            placeholder="Ej: Juan Pérez"
            :error="errors.nombre"
            class="w-full"
          />
        </div>

        <div>
          <label class="text-sm font-medium mb-1 block">Registro Personal *</label>
          <CInputText
            v-model="formData.registro_personal"
            placeholder="Ej: RP123"
            :error="errors.registro_personal"
            class="w-full"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm font-medium mb-1 block">Hora Entrada *</label>
            <CInputText
              v-model="formData.hora_entrada"
              type="time"
              :error="errors.hora_entrada"
              class="w-full"
            />
          </div>
          <div>
            <label class="text-sm font-medium mb-1 block">Hora Salida *</label>
            <CInputText
              v-model="formData.hora_salida"
              type="time"
              :error="errors.hora_salida"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="activo"
            v-model="formData.activo"
            type="checkbox"
            class="w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <label for="activo" class="text-sm font-medium cursor-pointer">
            Activo
          </label>
        </div>

        <DialogFooter class="flex gap-2 pt-4">
          <DialogClose as-child>
            <Button
              type="button"
              label="Cancelar"
              variant="text"
            />
          </DialogClose>
          <Button
            type="submit"
            label="Guardar"
            :loading="isLoading"
            severity="success"
          />
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
import { Icon } from '#components'
import { createTeacher, updateTeacher, fetchTeacherById } from '~/lib/api/schedules-generator/teachers'
import type { Teacher, CreateTeacherInput } from '~/lib/api/schedules-generator/types'

interface Props {
  teacherId?: number
}

const props = withDefaults(defineProps<Props>(), {
  teacherId: undefined
})

const emit = defineEmits<{
  'teacher-saved': [teacher: Teacher]
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.teacherId)

const formData = reactive<CreateTeacherInput>({
  nombre: '',
  registro_personal: '',
  hora_entrada: '07:00',
  hora_salida: '15:00',
  activo: true
})

const errors = reactive({
  nombre: '',
  registro_personal: '',
  hora_entrada: '',
  hora_salida: ''
})

const resetForm = () => {
  formData.nombre = ''
  formData.registro_personal = ''
  formData.hora_entrada = '07:00'
  formData.hora_salida = '15:00'
  formData.activo = true
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const validateForm = () => {
  let isValid = true
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.registro_personal.trim()) {
    errors.registro_personal = 'El registro personal es requerido'
    isValid = false
  }

  if (!formData.hora_entrada) {
    errors.hora_entrada = 'La hora de entrada es requerida'
    isValid = false
  }

  if (!formData.hora_salida) {
    errors.hora_salida = 'La hora de salida es requerida'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    let result: Teacher
    if (isEditing.value && props.teacherId) {
      result = await updateTeacher(props.teacherId, formData)
    } else {
      result = await createTeacher(formData)
    }
    emit('teacher-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error) {
    // Error handling is done in the API function
  } finally {
    isLoading.value = false
  }
}

const loadTeacherData = async () => {
  if (props.teacherId) {
    try {
      const teacher = await fetchTeacherById(props.teacherId)
      formData.nombre = teacher.nombre
      formData.registro_personal = teacher.registro_personal
      formData.hora_entrada = teacher.hora_entrada
      formData.hora_salida = teacher.hora_salida
      formData.activo = teacher.activo
    } catch (error) {
      // Error is handled in the API function
    }
  }
}

watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal && isEditing.value) {
      loadTeacherData()
    } else if (newVal && !isEditing.value) {
      resetForm()
    }
  }
)
</script>