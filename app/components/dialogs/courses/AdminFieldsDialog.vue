<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent class="max-h-[90vh] max-w-lg">
      <DialogHeader>
        <DialogTitle>Areas del pensum</DialogTitle>
        <DialogDescription>
          Administrar las areas academicas de este pensum.
        </DialogDescription>
      </DialogHeader>

      <div v-if="fieldsStatus === 'pending'" class="text-muted-foreground flex items-center gap-2 py-4 text-sm">
        <Icon name="svg-spinners:bars-rotate-fade" />
        Cargando areas...
      </div>

      <div v-else-if="fields.length" class="space-y-2">
        <div
          v-for="field in fields"
          :key="field.field_number"
          class="border-surface-200 dark:border-surface-700 rounded-lg border px-3 py-2.5"
        >
          <template v-if="editingFieldNumber === field.field_number">
            <div class="space-y-2">
              <CInputText
                v-model="editName"
                placeholder="Nombre del area"
                no-borders
                prepend-icon="icon-park-twotone:tag"
              />
              <div class="flex items-center justify-between">
                <label class="flex cursor-pointer items-center gap-2">
                  <Switch v-model="editCommonField" />
                  <span class="text-xs">Area comun</span>
                </label>
                <div class="flex gap-1">
                  <Button
                    label="Guardar"
                    icon="icon-park-outline:check"
                    size="small"
                    :loading="editLoading"
                    @click="saveEdit(field)"
                  />
                  <Button
                    label="Cancelar"
                    size="small"
                    severity="secondary"
                    @click="editingFieldNumber = null"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="size-3 shrink-0 rounded-sm"
                  :style="{ backgroundColor: getFieldColor(field.field_number) }"
                />
                <span class="text-sm">
                  <span class="text-muted-foreground font-mono text-xs">{{ field.field_number }}.</span>
                  <span class="ml-1 font-medium">{{ field.name }}</span>
                </span>
                <span
                  v-if="field.common_field"
                  class="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                >
                  Comun
                </span>
              </div>
              <div class="flex shrink-0 gap-1">
                <button
                  type="button"
                  class="hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded p-1 transition"
                  @click="startEdit(field)"
                >
                  <Icon name="icon-park-twotone:edit" size="14" class="text-primary-600 dark:text-primary-300" />
                </button>
                <ConfirmDialog
                  title="¿Eliminar esta area?"
                  description="El area sera eliminada del pensum permanentemente."
                  @confirm="onDeleteField(field.field_number)"
                >
                  <button
                    type="button"
                    class="cursor-pointer rounded p-1 transition hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Icon name="icon-park-outline:delete" size="14" class="text-red-500" />
                  </button>
                </ConfirmDialog>
              </div>
            </div>
          </template>
        </div>
      </div>

      <p v-else-if="fieldsStatus === 'success'" class="text-muted-foreground py-3 text-sm">
        Sin areas registradas.
      </p>

      <!-- Add field -->
      <div class="mt-3">
        <template v-if="!showAddForm">
          <Button
            label="Agregar area"
            icon="icon-park-outline:plus"
            size="small"
            variant="tonal"
            @click="showAddForm = true"
          />
        </template>
        <template v-else>
          <div class="border-surface-200 dark:border-surface-700 space-y-3 rounded-lg border p-3">
            <div class="grid grid-cols-3 gap-2">
              <CInputText
                v-model="newFieldNumber"
                placeholder="Numero"
                type="number"
                no-borders
                prepend-icon="icon-park-twotone:hashtag-key"
              />
              <div class="col-span-2">
                <CInputText
                  v-model="newName"
                  placeholder="Nombre del area"
                  no-borders
                  prepend-icon="icon-park-twotone:tag"
                />
              </div>
            </div>
            <label class="flex cursor-pointer items-center gap-2">
              <Switch v-model="newCommonField" />
              <span class="text-xs">Area comun</span>
            </label>
            <div class="flex gap-2">
              <Button
                label="Agregar"
                icon="icon-park-outline:check"
                size="small"
                :loading="addLoading"
                @click="addField"
              />
              <Button
                label="Cancelar"
                size="small"
                severity="secondary"
                @click="showAddForm = false"
              />
            </div>
          </div>
        </template>
      </div>

      <DialogFooter class="mt-4">
        <DialogClose as-child>
          <Button severity="secondary" label="Cerrar" />
        </DialogClose>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
<script setup lang="ts">
import { FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Switch } from '~/components/ui/switch'
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import {
  fetchFields,
  createField,
  updateField,
  deleteField,
  type PensumField,
  type CreateFieldPayload,
  type UpdateFieldPayload
} from '~/lib/api/admin/fields'
import { getFieldColor } from '~/utils/field-color'

const props = defineProps<{
  pensumId: number
}>()

const open = ref(false)

const fields = ref<PensumField[]>([])
const fieldsStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function loadFields() {
  fieldsStatus.value = 'pending'
  try {
    fields.value = await fetchFields(props.pensumId)
    fieldsStatus.value = 'success'
  } catch {
    fieldsStatus.value = 'error'
  }
}

watch(open, (val) => {
  if (val) {
    loadFields()
    editingFieldNumber.value = null
    showAddForm.value = false
  }
})

// --- Edit ---

const editingFieldNumber = ref<number | null>(null)
const editName = ref('')
const editCommonField = ref(false)
const editLoading = ref(false)

function startEdit(field: PensumField) {
  editingFieldNumber.value = field.field_number
  editName.value = field.name
  editCommonField.value = field.common_field
}

async function saveEdit(field: PensumField) {
  if (!editName.value.trim()) {
    toast.warning('El nombre del area es requerido')
    return
  }
  editLoading.value = true
  try {
    await updateField(props.pensumId, field.field_number, {
      name: editName.value,
      commonField: editCommonField.value
    })
    toast.success('Area actualizada')
    await loadFields()
    editingFieldNumber.value = null
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al actualizar area', { description: `Detalle: ${parsedMessage}` })
  } finally {
    editLoading.value = false
  }
}

// --- Delete ---

async function onDeleteField(fieldNumber: number) {
  try {
    await deleteField(props.pensumId, fieldNumber)
    toast.success('Area eliminada')
    await loadFields()
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al eliminar area', { description: `Detalle: ${parsedMessage}` })
  }
}

// --- Add ---

const showAddForm = ref(false)
const newFieldNumber = ref('')
const newName = ref('')
const newCommonField = ref(false)
const addLoading = ref(false)

async function addField() {
  if (!newFieldNumber.value || !newName.value.trim()) {
    toast.warning('El numero y nombre del area son requeridos')
    return
  }
  addLoading.value = true
  try {
    await createField(props.pensumId, {
      fieldNumber: Number(newFieldNumber.value),
      name: newName.value,
      commonField: newCommonField.value
    })
    toast.success('Area agregada')
    newFieldNumber.value = ''
    newName.value = ''
    newCommonField.value = false
    showAddForm.value = false
    await loadFields()
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al agregar area', { description: `Detalle: ${parsedMessage}` })
  } finally {
    addLoading.value = false
  }
}
</script>
