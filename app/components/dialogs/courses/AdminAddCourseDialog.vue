<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent class="max-h-[90vh] max-w-lg">
      <DialogHeader>
        <DialogTitle>Agregar curso al pensum</DialogTitle>
        <DialogDescription>
          Crear un nuevo curso y asignarlo a este pensum.
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit">
        <FieldGroup :disabled="asyncStatus === 'loading'" class="!gap-3 disabled:opacity-60">
          <h3 class="text-sm font-semibold">Informacion del curso</h3>
          <div class="grid grid-cols-2 gap-3">
            <VeeField v-slot="{ componentField, errors }" name="courseCode">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Codigo"
                  id="add-course-code"
                  no-borders
                  prepend-icon="icon-park-twotone:hashtag-key"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ componentField, errors }" name="courseCredits">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Creditos"
                  id="add-course-credits"
                  type="number"
                  no-borders
                  prepend-icon="icon-park-twotone:degree-hat"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <VeeField v-slot="{ componentField, errors }" name="courseName">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Nombre del curso"
                id="add-course-name"
                no-borders
                prepend-icon="icon-park-twotone:tag"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <VeeField v-slot="{ componentField, errors }" name="courseDescription">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Descripcion"
                id="add-course-description"
                no-borders
                prepend-icon="icon-park-twotone:file-text"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <Separator class="my-1" />

          <h3 class="text-sm font-semibold">Asignacion al pensum</h3>
          <div class="grid grid-cols-2 gap-3">
            <VeeField v-slot="{ componentField, errors }" name="semester">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Semestre"
                  id="add-course-semester"
                  type="number"
                  no-borders
                  prepend-icon="icon-park-twotone:calendar"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField v-slot="{ componentField, errors }" name="field">
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Area"
                  id="add-course-field"
                  type="number"
                  no-borders
                  prepend-icon="icon-park-twotone:category-management"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <div class="flex items-center gap-3">
            <label class="flex cursor-pointer items-center gap-2.5">
              <Switch v-model="isMandatory" />
              <div>
                <span class="text-sm font-medium">Obligatorio</span>
                <span class="text-muted-color-emphasis block text-xs">
                  Marcar si el curso es obligatorio
                </span>
              </div>
            </label>
          </div>
        </FieldGroup>

        <DialogFooter class="mt-4">
          <DialogClose as-child>
            <Button severity="secondary" label="Cancelar" />
          </DialogClose>
          <Button
            label="Agregar curso"
            icon="icon-park-outline:check"
            type="submit"
            :loading="asyncStatus === 'loading'"
          />
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FetchError } from 'ofetch'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { Field, FieldGroup } from '~/components/ui/field'
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
import { addCourseToPensum, type AddCourseToPensumPayload } from '~/lib/api/admin/pensums'

const props = defineProps<{
  pensumId: number
}>()

const emit = defineEmits<{
  added: []
}>()

const open = ref(false)
const isMandatory = ref(true)

const formSchema = z.object({
  courseCode: z.string().nonempty('El codigo es requerido'),
  courseName: z.string().nonempty('El nombre es requerido').max(350, 'Maximo 350 caracteres'),
  courseDescription: z.string().nonempty('La descripcion es requerida'),
  courseCredits: z.coerce.number({ required_error: 'Los creditos son requeridos', invalid_type_error: 'Debe ser un numero valido' }).int().min(1, 'Minimo 1 credito'),
  semester: z.coerce.number({ required_error: 'El semestre es requerido', invalid_type_error: 'Debe ser un numero valido' }).int().min(1, 'Minimo semestre 1'),
  field: z.coerce.number({ required_error: 'El campo es requerido', invalid_type_error: 'Debe ser un numero valido' }).int().min(1, 'Campo invalido'),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    courseCode: '',
    courseName: '',
    courseDescription: '',
    courseCredits: undefined,
    semester: undefined,
    field: undefined,
  }
})

watch(open, (val) => {
  if (val) {
    resetForm()
    isMandatory.value = true
  }
})

const onSubmit = handleSubmit((values) => {
  mutate({ ...values, mandatory: isMandatory.value } as AddCourseToPensumPayload)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (data: AddCourseToPensumPayload) => addCourseToPensum(props.pensumId, data),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al agregar el curso', { description: `Detalle: ${parsedMessage}` })
  },
  onSuccess() {
    toast.success('Curso agregado al pensum')
    open.value = false
    emit('added')
  }
})
</script>
