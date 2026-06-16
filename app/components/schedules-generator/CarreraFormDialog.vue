<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button label="Nueva carrera" icon="lucide:plus" class="w-fit" @click="resetForm" />
    </DialogTrigger>
    <DialogTrigger v-else as-child>
      <Button label="Editar" variant="tonal" icon="lucide:pencil" class="px-3 py-1 text-sm" @click="resetForm" />
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Editar carrera' : 'Crear nueva carrera' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos de la carrera' : 'Crea una nueva carrera' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <CInputText
          v-model="formData.nombre"
          label="Nombre *"
          placeholder="Ej: Ingeniería en Sistemas"
          :error="errors.nombre"
          class="w-full"
        />

        <CInputText
          v-model="formData.codigo"
          label="Código *"
          placeholder="Ej: ISC"
          :error="errors.codigo"
          class="w-full"
        />

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
import { createCarrera, updateCarrera, fetchCarreraById } from '~/lib/api/schedules-generator/carreras'
import type { Carrera, CreateCarreraInput } from '~/lib/api/schedules-generator/types'

const props = withDefaults(defineProps<{ carreraId?: number }>(), { carreraId: undefined })

const emit = defineEmits<{ 'carrera-saved': [carrera: Carrera] }>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.carreraId)

const formData = reactive<CreateCarreraInput>({ nombre: '', codigo: '' })
const errors = reactive({ nombre: '', codigo: '' })

const resetForm = () => {
  formData.nombre = ''
  formData.codigo = ''
  errors.nombre = ''
  errors.codigo = ''
}

const validateForm = () => {
  errors.nombre = ''
  errors.codigo = ''
  let valid = true
  if (!formData.nombre.trim()) { errors.nombre = 'El nombre es requerido'; valid = false }
  if (!formData.codigo.trim()) { errors.codigo = 'El código es requerido'; valid = false }
  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isLoading.value = true
  try {
    let result: Carrera
    if (isEditing.value && props.carreraId) {
      result = await updateCarrera(props.carreraId, formData)
    } else {
      result = await createCarrera(formData)
    }
    emit('carrera-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error: any) {
    const message = error?.data?.error ?? error?.data?.message ?? ''
    if (message.toLowerCase().includes('código') || message.toLowerCase().includes('codigo')) {
      errors.codigo = 'El código ya existe'
    }
  } finally {
    isLoading.value = false
  }
}

watch(isOpen, (open) => {
  if (open && isEditing.value && props.carreraId) {
    fetchCarreraById(props.carreraId).then((c) => {
      formData.nombre = c.nombre
      formData.codigo = c.codigo
    }).catch(() => {})
  } else if (open) {
    resetForm()
  }
})
</script>
