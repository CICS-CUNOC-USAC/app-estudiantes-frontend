<template>
  <main class="pb-10 max-w-4xl mx-auto">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Volver a mis grupos"
        class="text-muted-color-emphasis mb-4"
        @click="$emit('cancel')"
      />
    </nav>

    <header class="mb-8">
      <h1 class="text-2xl font-semibold">
        <Icon name="icon-park-twotone:edit-two" class="mr-2 inline-block" />
        Editar grupo
      </h1>
      <p class="text-muted-color mt-2">
        Actualiza la información del grupo de curso.
      </p>
    </header>

    <form @submit.prevent="onSubmit">
      <FieldGroup :disabled="loading || catalogLoading" class="space-y-6 disabled:opacity-60">
        <CCardAlt>
          <template #content>
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Icon name="icon-park-twotone:book" class="mr-2" />
                Información del curso
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label class="text-xs text-gray-500">Código del curso</label>
                  <p class="font-medium">{{ props.group.courseCode }}</p>
                </div>

                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label class="text-xs text-gray-500">Nombre del curso</label>
                  <p class="font-medium">{{ props.group.courseNameCache }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VeeField v-slot="{ componentField, errors }" name="section">
                  <Field :data-invalid="!!errors.length">
                    <CInputText
                      v-bind="componentField"
                      label="Sección"
                      id="section"
                      no-borders
                      prepend-icon="icon-park-twotone:components"
                      placeholder="Ej: A-01"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="typeId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="props.types"
                      label="Tipo de grupo"
                      id="type"
                      no-borders
                      prepend-icon="icon-park-twotone:category-management"
                      placeholder="Seleccionar tipo"
                      option-label="name"
                      option-value="id"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="academicPeriodId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="props.periods"
                      label="Período académico"
                      id="period"
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
            </div>
          </template>
        </CCardAlt>

        <CCardAlt>
          <template #content>
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Icon name="icon-park-twotone:setting" class="mr-2" />
                Configuración del grupo
              </h3>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="platform">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="platformOptions"
                      label="Plataforma"
                      id="platform"
                      no-borders
                      prepend-icon="icon-park-twotone:wechat"
                      placeholder="Seleccionar plataforma"
                      option-label="label"
                      option-value="value"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="visibility">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="visibilityOptions"
                      label="Visibilidad"
                      id="visibility"
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

              <VeeField v-slot="{ componentField, errors }" name="link">
                <Field :data-invalid="!!errors.length">
                  <CInputText
                    v-bind="componentField"
                    label="Enlace del grupo"
                    id="link"
                    no-borders
                    prepend-icon="icon-park-twotone:link"
                    placeholder="https://chat.whatsapp.com/..."
                    :error="errors[0]"
                  />
                </Field>
              </VeeField>
            </div>
          </template>
        </CCardAlt>

        <CCardAlt>
          <template #content>
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Icon name="icon-park-twotone:info" class="mr-2" />
                Información adicional
              </h3>

              <VeeField v-slot="{ componentField, errors }" name="lecturerName">
                <Field :data-invalid="!!errors.length">
                  <CInputText
                    v-bind="componentField"
                    label="Docente (opcional)"
                    id="lecturer"
                    no-borders
                    prepend-icon="icon-park-twotone:user-business"
                    placeholder="Nombre del docente"
                    :error="errors[0]"
                  />
                </Field>
              </VeeField>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="alternativeContact">
                  <Field :data-invalid="!!errors.length">
                    <CInputText
                      v-bind="componentField"
                      label="Contacto alternativo (opcional)"
                      id="altContact"
                      no-borders
                      prepend-icon="icon-park-twotone:phone"
                      placeholder="Email o teléfono"
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="contactNotes">
                  <Field :data-invalid="!!errors.length">
                    <CInputText
                      v-bind="componentField"
                      label="Notas de contacto (opcional)"
                      id="notes"
                      no-borders
                      prepend-icon="icon-park-twotone:notes"
                      placeholder="Notas adicionales..."
                      :error="errors[0]"
                    />
                  </Field>
                </VeeField>
              </div>
            </div>
          </template>
        </CCardAlt>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="text"
            label="Cancelar"
            @click="$emit('cancel')"
          />
          <Button
            type="submit"
            :loading="loading"
            label="Actualizar grupo"
            icon="icon-park-outline:check"
          />
        </div>
      </FieldGroup>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { Field, FieldGroup } from '~/components/ui/field'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'

interface Props {
  group: CourseGroup
  periods: AcademicPeriod[]
  types: GroupType[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: [data: Partial<CourseGroup>]
  cancel: []
}>()

const loading = ref(false)
const catalogLoading = ref(false)

const platformOptions = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const visibilityOptions = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])

const formSchema = z.object({
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

const { handleSubmit, setValues } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
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

function loadGroupData() {
  setValues({
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
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  
  try {
    const groupData: Partial<CourseGroup> = {
      id: props.group.id,
      courseCode: props.group.courseCode,
      courseNameCache: props.group.courseNameCache,
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
    toast.success('Grupo actualizado exitosamente')
  } catch (error) {
    toast.error('Error al actualizar el grupo', { 
      description: error instanceof Error ? error.message : 'Ocurrió un error inesperado' 
    })
  } finally {
    loading.value = false
  }
})

onMounted(() => {
  loadGroupData()
})
</script>