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
                      :model-value="componentField.modelValue"
                      label="Sección"
                      id="section"
                      no-borders
                      prepend-icon="icon-park-twotone:components"
                      placeholder="Ej: A"
                      :error="errors[0]"
                      @update:model-value="onSectionInput"
                    />
                    <p v-if="componentField.modelValue" class="text-xs text-gray-500 mt-1">
                      Normalizado: <span class="font-mono">{{ normalizeSection(componentField.modelValue) }}</span>
                    </p>
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

              <!-- ✅ Advertencia de duplicados -->
              <div v-if="duplicateWarning" class="mt-2 p-3 rounded-lg"
                :class="isDuplicateBlocked ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'">
                <p class="text-sm"
                  :class="isDuplicateBlocked ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'">
                  <Icon :name="isDuplicateBlocked ? 'lucide:alert-circle' : 'lucide:alert-triangle'" class="mr-2 inline-block" />
                  {{ duplicateWarning }}
                </p>
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
import { ref, onMounted, watch } from 'vue'
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
import { normalizeSection, isValidSection } from '../../../../server/utils/text-similarity'

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

const courseGroupsApi = useCourseGroupsApi()

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

// ✅ Duplicados
const duplicateWarning = ref<string | null>(null)
const isDuplicateBlocked = ref(false)
let duplicateTimeout: any = null

function onSectionInput(value: string) {
  const normalized = normalizeSection(value)
  setValues({
    section: normalized
  })
}

async function checkDuplicates() {
  const section = values.section
  const periodId = values.academicPeriodId

  if (!section || !periodId) {
    duplicateWarning.value = null
    isDuplicateBlocked.value = false
    return
  }

  try {
    const result = await courseGroupsApi.duplicates({
      courseCode: props.group.courseCode,
      section: section,
      period: periodId
    })

    const filtered = result.filter((item: any) => item.id !== props.group.id)
    
    const highMatch = filtered.find((item: any) => item.similarity >= 0.92)
    
    if (highMatch) {
      isDuplicateBlocked.value = true
      duplicateWarning.value = `Ya existe otro grupo con sección similar: "${highMatch.attributes.section}" (${Math.round(highMatch.similarity * 100)}% coincidencia). Por favor, usa otra sección.`
    } else {
      const suggestions = filtered.filter((item: any) => item.similarity >= 0.6)
      if (suggestions.length > 0) {
        const suggestionText = suggestions.map((s: any) => 
          `"${s.attributes.section}" (${Math.round(s.similarity * 100)}%)`
        ).join(', ')
        duplicateWarning.value = `Se encontraron secciones similares en otros grupos: ${suggestionText}. Considera usar otra sección.`
        isDuplicateBlocked.value = false
      } else {
        duplicateWarning.value = null
        isDuplicateBlocked.value = false
      }
    }
  } catch (error) {
    console.error('Error al verificar duplicados:', error)
    isDuplicateBlocked.value = false
  }
}

const formSchema = z.object({
  section: z.string()
    .nonempty('La sección del curso es requerida')
    .refine((val) => isValidSection(val), {
      message: 'La sección debe ser una letra (A, B, C, etc.)'
    }),
  platform: z.string().nonempty('La plataforma es requerida'),
  link: z.string().nonempty('El enlace es requerido').url('Debe ser una URL válida'),
  visibility: z.string().nonempty('La visibilidad es requerida'),
  typeId: z.coerce.number({ required_error: 'El tipo de grupo es requerido' }),
  academicPeriodId: z.coerce.number({ required_error: 'El período académico es requerido' }),
  lecturerName: z.string().optional(),
  alternativeContact: z.string().optional(),
  contactNotes: z.string().optional()
})

const { handleSubmit, setValues, values } = useForm({
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

watch([
  () => values.section,
  () => values.academicPeriodId
], () => {
  clearTimeout(duplicateTimeout)
  duplicateTimeout = setTimeout(checkDuplicates, 500)
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
  if (isDuplicateBlocked.value) {
    toast.error('No se puede actualizar el grupo', {
      description: duplicateWarning.value || 'Ya existe otro grupo con una sección muy similar.'
    })
    return
  }

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
        fullName: values.lecturerName,
        email: '',
        school: ''
      } : undefined
    }
    
    emit('save', groupData)
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