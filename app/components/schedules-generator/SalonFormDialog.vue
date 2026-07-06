<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger v-if="!isEditing" as-child>
      <Button
        label="Nuevo salón"
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
        <DialogTitle>{{ isEditing ? 'Editar salón' : 'Crear nuevo salón' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Actualiza los datos del salón' : 'Crea un nuevo salón' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <CInputText
            v-model="formData.nombre"
            placeholder="Ej: Salon 1"
            :error="errors.nombre"
            class="w-full"
            label="Nombre *"
          />
        </div>

        <div>
          <CInputText
            v-model="capacidadModel"
            type="number"
            min="1"
            step="1"
            placeholder="Ej: 40"
            :error="errors.capacidad"
            class="w-full"
            label="Capacidad"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex items-center gap-2">
            <Checkbox id="es_laboratorio" v-model="formData.es_laboratorio" class="cursor-pointer" />
            <label for="es_laboratorio" class="text-sm font-medium cursor-pointer">Es laboratorio</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox
              id="lab_habilitado_teorico"
              v-model="formData.lab_habilitado_teorico"
              :disabled="!formData.es_laboratorio"
              class="cursor-pointer"
            />
            <label
              for="lab_habilitado_teorico"
              class="text-sm font-medium cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': !formData.es_laboratorio }"
            >
              Lab. teórico
            </label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="disponible_manana" v-model="formData.disponible_manana" class="cursor-pointer" />
            <label for="disponible_manana" class="text-sm font-medium cursor-pointer">Disp. mañana</label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="disponible_tarde" v-model="formData.disponible_tarde" class="cursor-pointer" />
            <label for="disponible_tarde" class="text-sm font-medium cursor-pointer">Disp. tarde</label>
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
import { Checkbox } from '~/components/ui/checkbox'
import { createSalon, updateSalon, fetchSalonById } from '~/lib/api/schedules-generator/salones'
import type { Salon, CreateSalonInput } from '~/lib/api/schedules-generator/types'

interface Props {
  salonId?: number
}

const props = withDefaults(defineProps<Props>(), {
  salonId: undefined
})

const emit = defineEmits<{
  'salon-saved': [salon: Salon]
}>()

const isOpen = ref(false)
const isLoading = ref(false)
const isEditing = computed(() => !!props.salonId)

const formData = reactive<CreateSalonInput>({
  nombre: '',
  capacidad: null,
  es_laboratorio: false,
  lab_habilitado_teorico: false,
  disponible_manana: true,
  disponible_tarde: true,
  activo: true
})

const errors = reactive({
  nombre: '',
  capacidad: ''
})

// Puente entre el input de texto (string) y capacidad numérica/null.
// Solo conserva dígitos para que la capacidad sea siempre un entero positivo.
const capacidadModel = computed({
  get: () => (formData.capacidad === null ? '' : String(formData.capacidad)),
  set: (val: string) => {
    const digits = String(val).replace(/\D/g, '')
    formData.capacidad = digits === '' ? null : Number(digits)
  }
})

const resetForm = () => {
  formData.nombre = ''
  formData.capacidad = null
  formData.es_laboratorio = false
  formData.lab_habilitado_teorico = false
  formData.disponible_manana = true
  formData.disponible_tarde = true
  formData.activo = true
  errors.nombre = ''
  errors.capacidad = ''
}

const validateForm = () => {
  errors.nombre = ''
  errors.capacidad = ''
  let isValid = true

  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
    isValid = false
  }

  if (
    formData.capacidad !== null &&
    (!Number.isInteger(formData.capacidad) || formData.capacidad < 1)
  ) {
    errors.capacidad = 'La capacidad debe ser un número entero positivo'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    let result: Salon
    if (isEditing.value && props.salonId) {
      result = await updateSalon(props.salonId, formData)
    } else {
      result = await createSalon(formData)
    }
    emit('salon-saved', result)
    isOpen.value = false
    resetForm()
  } catch (error: any) {
    const message = (error?.data?.error ?? error?.data?.message ?? '').toLowerCase()
    if (error?.status === 400 && message.includes('nombre')) {
      errors.nombre = 'El nombre es obligatorio'
    }
  } finally {
    isLoading.value = false
  }
}

const loadSalonData = async () => {
  if (!props.salonId) return
  const salon = await fetchSalonById(props.salonId).catch(() => null)
  if (!salon) return
  formData.nombre = salon.nombre
  formData.capacidad = salon.capacidad
  formData.es_laboratorio = salon.es_laboratorio
  formData.lab_habilitado_teorico = salon.lab_habilitado_teorico
  formData.disponible_manana = salon.disponible_manana
  formData.disponible_tarde = salon.disponible_tarde
  formData.activo = salon.activo
}

watch(
  () => isOpen.value,
  (newVal) => {
    if (newVal && isEditing.value) {
      loadSalonData()
    } else if (newVal && !isEditing.value) {
      resetForm()
    }
  }
)
</script>
