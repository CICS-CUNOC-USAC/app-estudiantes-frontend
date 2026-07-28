<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent class="max-h-[90vh] max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {{ isEditando ? 'Editar grupo' : 'Crear nuevo grupo' }}
        </DialogTitle>
        <DialogDescription>
          {{ isEditando ? 'Actualiza la información del grupo de curso.' : 'Crea un nuevo grupo de curso para compartir con otros estudiantes.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmit">
        <FieldGroup :disabled="cargando" class="!gap-3 disabled:opacity-60">
          <h3 class="text-sm font-semibold">Información del curso</h3>
          
          <div class="grid grid-cols-2 gap-3">
            <VeeField 
              v-slot="{ componentField, errors }" 
              name="courseCode"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Código del curso"
                  id="group-course-code"
                  no-borders
                  prepend-icon="icon-park-twotone:hashtag-key"
                  placeholder="Ej: 101"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField 
              v-slot="{ componentField, errors }" 
              name="section"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Sección"
                  id="group-section"
                  no-borders
                  prepend-icon="icon-park-twotone:components"
                  placeholder="Ej: A"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <VeeField 
            v-slot="{ componentField, errors }" 
            name="courseNameCache"
            mode="blur"
          >
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Nombre del curso"
                id="group-course-name"
                no-borders
                prepend-icon="icon-park-twotone:tag"
                placeholder="Ej: Introducción a la Programación"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <Separator class="my-1" />

          <h3 class="text-sm font-semibold">Configuración del grupo</h3>

          <div class="grid grid-cols-2 gap-3">
            <VeeField 
              v-slot="{ componentField, errors }" 
              name="platform"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CSelect
                  v-bind="componentField"
                  :items="opcionesPlataforma"
                  label="Plataforma"
                  id="group-platform"
                  no-borders
                  prepend-icon="icon-park-twotone:wechat"
                  placeholder="Seleccionar plataforma"
                  option-label="label"
                  option-value="value"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField 
              v-slot="{ componentField, errors }" 
              name="visibility"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CSelect
                  v-bind="componentField"
                  :items="opcionesVisibilidad"
                  label="Visibilidad"
                  id="group-visibility"
                  no-borders
                  prepend-icon="icon-park-twotone:eyes"
                  placeholder="Seleccionar visibilidad"
                  option-label="label"
                  option-value="value"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <VeeField 
            v-slot="{ componentField, errors }" 
            name="link"
            mode="blur"
          >
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Enlace del grupo"
                id="group-link"
                no-borders
                prepend-icon="icon-park-twotone:copy-link"
                placeholder="https://chat.whatsapp.com/..."
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <div class="grid grid-cols-2 gap-3">
            <VeeField 
              v-slot="{ componentField, errors }" 
              name="typeId"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CSelect
                  v-bind="componentField"
                  :items="props.types"
                  label="Tipo de grupo"
                  id="group-type"
                  no-borders
                  prepend-icon="icon-park-twotone:category-management"
                  placeholder="Seleccionar tipo"
                  option-label="name"
                  option-value="id"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField 
              v-slot="{ componentField, errors }" 
              name="academicPeriodId"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CSelect
                  v-bind="componentField"
                  :items="props.periods"
                  label="Período académico"
                  id="group-period"
                  no-borders
                  prepend-icon="icon-park-twotone:calendar"
                  placeholder="Seleccionar período"
                  option-label="name"
                  option-value="id"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>

          <Separator class="my-1" />

          <h3 class="text-sm font-semibold">Información adicional</h3>

          <VeeField 
            v-slot="{ componentField, errors }" 
            name="lecturerName"
            mode="blur"
          >
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Docente (opcional)"
                id="group-lecturer"
                no-borders
                prepend-icon="icon-park-twotone:user-business"
                placeholder="Nombre del docente"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <div class="grid grid-cols-2 gap-3">
            <VeeField 
              v-slot="{ componentField, errors }" 
              name="alternativeContact"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Contacto alternativo (opcional)"
                  id="group-alt-contact"
                  no-borders
                  prepend-icon="icon-park-twotone:phone"
                  placeholder="Email o teléfono"
                  :error="errors[0]"
                />
              </Field>
            </VeeField>

            <VeeField 
              v-slot="{ componentField, errors }" 
              name="contactNotes"
              mode="blur"
            >
              <Field :data-invalid="!!errors.length">
                <CInputText
                  v-bind="componentField"
                  label="Notas de contacto (opcional)"
                  id="group-notes"
                  no-borders
                  prepend-icon="icon-park-twotone:notes"
                  placeholder="Notas adicionales..."
                  :error="errors[0]"
                />
              </Field>
            </VeeField>
          </div>
        </FieldGroup>

        <DialogFooter class="mt-4">
          <DialogClose as-child>
            <Button severity="secondary" label="Cancelar" />
          </DialogClose>
          <Button
            :label="isEditando ? 'Actualizar' : 'Crear'"
            icon="icon-park-outline:check"
            type="submit"
            :loading="cargando"
          />
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>


<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
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
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'

const props = defineProps<{
  open?: boolean
  group?: CourseGroup | null
  periods: AcademicPeriod[]
  types: GroupType[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [data: Partial<CourseGroup>]
}>()

const open = computed({
  get: () => props.open ?? false,
  set: (value) => emit('update:open', value)
})

const cargando = ref(false)
const isEditando = computed(() => !!props.group)

const opcionesPlataforma = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const opcionesVisibilidad = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])


const formSchema = z.object({
  courseCode: z.string().nonempty('El código del curso es requerido'),
  courseNameCache: z.string().nonempty('El nombre del curso es requerido').max(350, 'Máximo 350 caracteres'),
  section: z.string().nonempty('La sección del curso es requerida'),
  platform: z.string().nonempty('La plataforma es requerida'),
  link: z.string().nonempty('El enlace es requerido').url('Debe ser una URL válida'),
  visibility: z.string().nonempty('La visibilidad es requerida'),
  typeId: z.coerce.number({ required_error: 'El tipo de grupo es requerido' }),
  academicPeriodId: z.coerce.number({ required_error: 'El período académico es requerido' }),
  lecturerName: z.string().optional(),
  alternativeContact: z.string().optional(),
  contactNotes: z.string().optional()
})


const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    courseCode: '',
    courseNameCache: '',
    section: '',
    platform: '',
    link: '',
    visibility: '',
    typeId: undefined,
    academicPeriodId: undefined,
    lecturerName: '',
    alternativeContact: '',
    contactNotes: ''
  },
  validateOnMount: false 
})


watch(open, (val) => {
  if (val) {
    if (props.group) {
     
      setValues({
        courseCode: props.group.courseCode,
        courseNameCache: props.group.courseNameCache,
        section: props.group.section || '',
        platform: props.group.platform,
        link: props.group.link,
        visibility: props.group.visibility,
        typeId: props.group.type.id,
        academicPeriodId: props.group.academicPeriod.id,
        lecturerName: props.group.lecturer?.fullName || '',
        alternativeContact: props.group.alternativeContact || '',
        contactNotes: props.group.contactNotes || ''
      })
    } else {
    
      const periodoActual = props.periods.find(p => p.current)
      resetForm()
      nextTick(() => {
        setValues({
          platform: '',
          visibility: '',
          academicPeriodId: periodoActual?.id,
          typeId: props.types[0]?.id
        })
      })
    }
  }
})

async function guardarGrupo(values: any) {
  cargando.value = true
  
  try {
    const groupData: Partial<CourseGroup> = {
      id: props.group?.id,
      courseCode: values.courseCode,
      courseNameCache: values.courseNameCache,
      section: values.section || undefined,
      platform: values.platform as 'whatsapp' | 'telegram',
      link: values.link,
      visibility: values.visibility as 'abierto' | 'privado',
      type: props.types.find(t => t.id === values.typeId)!,
      academicPeriod: props.periods.find(p => p.id === values.academicPeriodId)!,
      alternativeContact: values.alternativeContact || undefined,
      contactNotes: values.contactNotes || undefined,
      lecturer: values.lecturerName ? {
        id: Math.floor(Math.random() * 1000),
        fullName: values.lecturerName,
        email: '',
        school: ''
      } : undefined
    }
    
    emit('save', groupData)
    toast.success(isEditando.value ? 'Grupo actualizado exitosamente' : 'Grupo creado exitosamente')
    open.value = false
  } catch (error) {
    toast.error('Error al guardar el grupo', { 
      description: error instanceof Error ? error.message : 'Ocurrió un error inesperado' 
    })
  } finally {
    cargando.value = false
  }
}

const onSubmit = handleSubmit(guardarGrupo)

defineExpose({ 
  open: () => open.value = true,
  close: () => open.value = false,
  isOpen: () => open.value
})
</script>