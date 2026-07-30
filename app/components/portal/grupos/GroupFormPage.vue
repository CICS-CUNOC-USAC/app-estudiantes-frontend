<template>
  <main class="pb-10 max-w-4xl mx-auto">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        :label="returnLabel"
        class="text-muted-color-emphasis mb-4"
        @click="goBack"
      />
    </nav>

    <header class="mb-8">
      <h1 class="text-2xl font-semibold">
        <Icon 
          :name="isEditing ? 'icon-park-twotone:edit-two' : 'icon-park-twotone:add-web'" 
          class="mr-2 inline-block" 
        />
        {{ isEditing ? 'Editar grupo' : 'Crear nuevo grupo' }}
      </h1>
      <p class="text-muted-color mt-2">
        {{ isEditing ? 'Actualiza la información del grupo de curso.' : 'Completa los datos para crear un nuevo grupo.' }}
      </p>
    </header>

    <form @submit.prevent="onSubmit">
      <FieldGroup :disabled="loading || catalogLoading" class="space-y-6 disabled:opacity-60">
        <CCardAlt>
          <template #content>
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Icon name="icon-park-twotone:book" class="mr-2" />
                Selecciona el curso
              </h3>
              
              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <VeeField v-slot="{ componentField, errors }" name="careerId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="careerOptions"
                      label="Carrera"
                      id="career"
                      no-borders
                      clearable
                      prepend-icon="icon-park-twotone:school"
                      placeholder="Seleccionar carrera"
                      option-label="label"
                      option-value="value"
                      :loading="catalogLoading && !careers.length"
                      :error="errors[0]"
                      @value-change="onCareerChange"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="pensumId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="pensumOptions"
                      label="Pensum"
                      id="pensum"
                      no-borders
                      clearable
                      prepend-icon="icon-park-twotone:notebook"
                      placeholder="Seleccionar pensum"
                      option-label="label"
                      option-value="value"
                      :disabled="!formValues.careerId || catalogLoading"
                      :loading="catalogLoading && !pensums.length"
                      :error="errors[0]"
                      @value-change="onPensumChange"
                    />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="courseCode">
                  <Field :data-invalid="!!errors.length">
                    <CSelect
                      v-bind="componentField"
                      :items="courseOptions"
                      label="Curso"
                      id="course"
                      no-borders
                      clearable
                      prepend-icon="icon-park-twotone:book-open"
                      placeholder="Seleccionar curso"
                      option-label="label"
                      option-value="value"
                      :disabled="!formValues.pensumId || catalogLoading"
                      :loading="catalogLoading && !allCourses.length"
                      :error="errors[0]"
                      @value-change="onCourseChange"
                    />
                  </Field>
                </VeeField>
              </div>

              <div v-if="selectedCourse" class="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p class="text-sm">
                  <span class="font-semibold">Curso seleccionado:</span>
                  <span class="ml-2">{{ selectedCourse.course_code }} - {{ selectedCourse.course?.name }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Semestre {{ selectedCourse.semester }} · {{ selectedCourse.field_name || 'Sin área' }}
                </p>
              </div>


              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            @click="goBack"
          />
          <Button
            type="submit"
            :loading="loading"
            :label="isEditing ? 'Actualizar grupo' : 'Crear grupo'"
            icon="icon-park-outline:check"
          />
        </div>
      </FieldGroup>
    </form>
  </main>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import Button from '~/components/ui/button/Button.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import CSelect from '~/components/primitives/form/CSelect.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { Field, FieldGroup } from '~/components/ui/field'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { useCatalog } from '~/composables/useCatalog'
import type { PensumSemesterCourse } from '~/utils/types/pensum-courses'

interface Props {
  group?: CourseGroup | null
  periods: AcademicPeriod[]
  types: GroupType[]
  returnTo?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: [data: Partial<CourseGroup>]
}>()

const router = useRouter()
const isEditing = computed(() => !!props.group)

const catalog = useCatalog()
const catalogLoading = computed(() => catalog.loading.value)
const careerOptions = computed(() => catalog.careerOptions.value)
const pensumOptions = computed(() => catalog.pensumOptions.value)
const courseOptions = computed(() => catalog.courseOptions.value)
const careers = computed(() => catalog.careers.value)
const pensums = computed(() => catalog.pensums.value)
const allCourses = computed(() => catalog.allCourses.value)

const loading = ref(false)
const formValues = ref({
  careerId: null as string | null,
  pensumId: null as string | null,
  courseCode: null as string | null
})
const selectedCourse = ref<PensumSemesterCourse | null>(null)

const platformOptions = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const visibilityOptions = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])

const formSchema = z.object({
  careerId: z.string().nonempty('La carrera es requerida'),
  pensumId: z.string().nonempty('El pensum es requerido'),
  courseCode: z.string().nonempty('El curso es requerido'),
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
    careerId: '',
    pensumId: '',
    courseCode: '',
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

async function onCareerChange(careerCode: string) {
  formValues.value.careerId = careerCode
  formValues.value.pensumId = null
  formValues.value.courseCode = null
  selectedCourse.value = null
  
  setValues({
    pensumId: '',
    courseCode: ''
  })
  
  try {
    await catalog.fetchPensums(Number(careerCode))
  } catch (error) {
    toast.error('Error al cargar pensums', {
      description: 'No se pudieron cargar los pensums de esta carrera'
    })
  }
}

async function onPensumChange(pensumId: string) {
  formValues.value.pensumId = pensumId
  formValues.value.courseCode = null
  selectedCourse.value = null
  
  setValues({
    courseCode: ''
  })
  
  try {
    await catalog.fetchCourses(Number(pensumId))
  } catch (error) {
    toast.error('Error al cargar cursos', {
      description: 'No se pudieron cargar los cursos de este pensum'
    })
  }
}

function onCourseChange(courseCode: string) {
  formValues.value.courseCode = courseCode
  
  const pensumCourse = allCourses.value.find(pc => pc.course_code === courseCode)
  if (pensumCourse) {
    selectedCourse.value = pensumCourse
  }
}

async function initializeForm() {
  try {
    if (!catalog.careers.value.length) {
      await catalog.fetchCareers()
    }
  } catch (error) {
    toast.error('Error al cargar carreras', {
      description: 'No se pudieron cargar las carreras disponibles'
    })
  }
  
  if (props.group) {
    const group = props.group
    setValues({
      section: group.section || '',
      platform: group.platform,
      link: group.link,
      visibility: group.visibility,
      typeId: group.type.id,
      academicPeriodId: group.academicPeriod.id,
      lecturerName: group.lecturer?.fullName || '',
      alternativeContact: group.alternativeContact || '',
      contactNotes: group.contactNotes || ''
    })
    

  } else {
    const periodoActual = props.periods.find(p => p.current)
    resetForm()
    nextTick(() => {
      setValues({
        platform: 'whatsapp',
        visibility: 'abierto',
        academicPeriodId: periodoActual?.id,
        typeId: props.types[0]?.id
      })
    })
  }
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  
  try {
    const pensumCourse = allCourses.value.find(pc => pc.course_code === values.courseCode)
    
    const groupData: Partial<CourseGroup> = {
      id: props.group?.id,
      courseCode: values.courseCode,
      courseNameCache: pensumCourse?.course?.name || values.courseCode,
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
    toast.success(isEditing.value ? 'Grupo actualizado exitosamente' : 'Grupo creado exitosamente')

    goBack()
  } catch (error) {
    toast.error('Error al guardar el grupo', { 
      description: error instanceof Error ? error.message : 'Ocurrió un error inesperado' 
    })
  } finally {
    loading.value = false
  }
})

// ============ NAVIGATION ============
const returnLabel = computed(() => {
  return props.returnTo === 'explorar' ? 'Volver a explorar' : 'Volver a mis grupos'
})

function goBack() {
  if (props.returnTo === 'explorar') {
    router.push('/dashboard/grupos')
  } else {
    router.push('/dashboard/mis-grupos')
  }
}

onMounted(() => {
  initializeForm()
})
</script>