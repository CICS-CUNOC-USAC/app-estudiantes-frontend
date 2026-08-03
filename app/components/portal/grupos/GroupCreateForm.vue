<template>
  <main class="pb-10 max-w-4xl mx-auto">
    <nav>
      <Button icon="icon-park-outline:arrow-left" variant="link" label="Volver a mis grupos"
        class="text-muted-color-emphasis mb-4" @click="$emit('cancel')" />
    </nav>

    <header class="mb-8">
      <h1 class="text-2xl font-semibold">
        <Icon name="icon-park-twotone:add-web" class="mr-2 inline-block" />
        Crear nuevo grupo
      </h1>
      <p class="text-muted-color mt-2">
        Completa los datos para crear un nuevo grupo de curso.
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

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="careerId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="careerOptions" label="Carrera" id="career" no-borders
                      clearable prepend-icon="icon-park-twotone:school" placeholder="Seleccionar carrera"
                      option-label="label" option-value="value" :loading="catalogLoading" :error="errors[0]"
                      @value-change="onCareerChange" />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="pensumId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="pensumOptions" label="Pensum" id="pensum" no-borders
                      clearable prepend-icon="icon-park-twotone:notebook" placeholder="Seleccionar pensum"
                      option-label="label" option-value="value" :disabled="!formValues.careerId || catalogLoading"
                      :loading="catalogLoading" :error="errors[0]" @value-change="onPensumChange" />
                  </Field>
                </VeeField>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="courseCode">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="courseOptions" label="Curso" id="course" no-borders
                      clearable prepend-icon="icon-park-twotone:book-open" placeholder="Seleccionar curso"
                      option-label="label" option-value="value" :disabled="!formValues.pensumId || catalogLoading"
                      :loading="catalogLoading" :error="errors[0]" @value-change="onCourseChange" />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="semesterFilter">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="semesterOptions" label="Filtrar por semestre"
                      id="semesterFilter" no-borders clearable prepend-icon="icon-park-twotone:calendar"
                      placeholder="Todos los semestres" option-label="label" option-value="value"
                      :disabled="!formValues.pensumId || catalogLoading" :error="errors[0]"
                      @value-change="onSemesterFilterChange" />
                  </Field>
                </VeeField>
              </div>

              <div v-if="selectedCourse" class="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p class="text-sm">
                  <span class="font-semibold">Curso seleccionado:</span>
                  <span class="ml-2">{{ selectedCourse.course_code }} - {{ truncateText(selectedCourse.course?.name ||
                    selectedCourse?.name || 'Sin nombre', 50) }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Semestre {{ selectedCourse.semester }} · {{ selectedCourse.field_name || 'Sin área' }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <VeeField v-slot="{ componentField, errors }" name="section">
                  <Field :data-invalid="!!errors.length">
                    <CInputText :model-value="componentField.modelValue" label="Sección" id="section" no-borders
                      prepend-icon="icon-park-twotone:components" placeholder="Ej: A" :error="errors[0]"
                      @update:model-value="onSectionInput" />
                   
                    <p v-if="componentField.modelValue" class="text-xs text-gray-500 mt-1">
                      Normalizado: <span class="font-mono">{{ normalizeSection(componentField.modelValue) }}</span>
                    </p>
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
                    <CSelect v-bind="componentField" :items="platformOptions" label="Plataforma" id="platform"
                      no-borders prepend-icon="icon-park-twotone:wechat" placeholder="Seleccionar plataforma"
                      option-label="label" option-value="value" :error="errors[0]" />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="visibility">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="visibilityOptions" label="Visibilidad" id="visibility"
                      no-borders prepend-icon="icon-park-twotone:eyes" placeholder="Seleccionar visibilidad"
                      option-label="label" option-value="value" :error="errors[0]" />
                  </Field>
                </VeeField>
              </div>

              <VeeField v-slot="{ componentField, errors }" name="link">
                <Field :data-invalid="!!errors.length">
                  <CInputText v-bind="componentField" label="Enlace del grupo" id="link" no-borders
                    prepend-icon="icon-park-twotone:link" placeholder="https://chat.whatsapp.com/..."
                    :error="errors[0]" />
                </Field>
              </VeeField>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="typeId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="props.types" clearable label="Tipo de grupo" id="type" no-borders
                      prepend-icon="icon-park-twotone:category-management" placeholder="Seleccionar tipo"
                      option-label="name" option-value="id" :error="errors[0]" />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="academicPeriodId">
                  <Field :data-invalid="!!errors.length">
                    <CSelect v-bind="componentField" :items="props.periods" label="Período académico" id="period"
                      no-borders prepend-icon="icon-park-twotone:calendar" clearable placeholder="Seleccionar período"
                      option-label="name" option-value="id" :error="errors[0]" />
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
                  <CInputText v-bind="componentField" label="Docente (opcional)" id="lecturer" no-borders
                    prepend-icon="icon-park-twotone:user-business" placeholder="Nombre del docente"
                    :error="errors[0]" />
                </Field>
              </VeeField>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <VeeField v-slot="{ componentField, errors }" name="alternativeContact">
                  <Field :data-invalid="!!errors.length">
                    <CInputText v-bind="componentField" label="Contacto alternativo (opcional)" id="altContact"
                      no-borders prepend-icon="icon-park-twotone:phone" placeholder="Email o teléfono"
                      :error="errors[0]" />
                  </Field>
                </VeeField>

                <VeeField v-slot="{ componentField, errors }" name="contactNotes">
                  <Field :data-invalid="!!errors.length">
                    <CInputText v-bind="componentField" label="Notas de contacto (opcional)" id="notes" no-borders
                      prepend-icon="icon-park-twotone:notes" placeholder="Notas adicionales..." :error="errors[0]" />
                  </Field>
                </VeeField>
              </div>
            </div>
          </template>
        </CCardAlt>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="text" label="Cancelar" @click="$emit('cancel')" />
          <Button type="submit" :loading="loading" label="Crear grupo" icon="icon-park-outline:check" />
        </div>
      </FieldGroup>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
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
import type { Career, Pensum, PensumCoursesResponse, PensumSemesterCourse } from '~/utils/types/pensum-courses'
import { getCareers, getPensumsByCareer, getCoursesByPensum, getCourseBySemester } from '~/lib/api/courses-catalog/pensum-courses'
import { normalizeSection, isValidSection } from '../../../../server/utils/text-similarity'

interface Props {
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

const careers = ref<Career[]>([])
const pensums = ref<Pensum[]>([])
const coursesResponse = ref<PensumCoursesResponse | null>(null)

function truncateText(text: string, maxLength: number = 40): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const careerOptions = computed(() => {
  return careers.value.map((c: Career) => ({
    label: c.name,
    value: String(c.code)
  }))
})

const pensumOptions = computed(() => {
  return pensums.value.map((p: Pensum) => ({
    label: `${p.year} ${p.active ? '(Vigente)' : ''}`,
    value: String(p.id)
  }))
})

const allCourses = computed(() => {
  if (!coursesResponse.value?.courses) return []
  const courses: PensumSemesterCourse[] = []
  coursesResponse.value.courses.forEach((semester) => {
    courses.push(...semester.courses)
  })
  return courses
})

const formValues = ref({
  careerId: null as string | null,
  pensumId: null as string | null,
  courseCode: null as string | null
})

const selectedCourse = ref<PensumSemesterCourse | null>(null)
const semesterFilter = ref<number | null>(null)

const platformOptions = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const visibilityOptions = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])

async function fetchCareers() {
  catalogLoading.value = true
  try {
    careers.value = await getCareers()
  } catch (error) {
    toast.error('Error al cargar carreras')
    throw error
  } finally {
    catalogLoading.value = false
  }
}

async function fetchPensums(careerCode: number) {
  catalogLoading.value = true
  try {
    pensums.value = await getPensumsByCareer(careerCode)
  } catch (error) {
    toast.error('Error al cargar pensums')
    throw error
  } finally {
    catalogLoading.value = false
  }
}

async function fetchCourses(pensumId: number) {
  catalogLoading.value = true
  try {
    coursesResponse.value = await getCoursesByPensum(pensumId)
  } catch (error) {
    toast.error('Error al cargar cursos')
    throw error
  } finally {
    catalogLoading.value = false
  }
}

async function fetchCoursesBySemester(pensumId: number, semester: number) {
  catalogLoading.value = true
  try {
    const courses = await getCourseBySemester(pensumId, semester)

    coursesResponse.value = {
      career_name: '',
      career_code: 0,
      pensum_id: pensumId,
      pensum_year: 0,
      courses: [{
        semester: String(semester),
        courses: courses
      }]
    }

  } catch (error) {
    toast.error('Error al cargar cursos por semestre')
    throw error
  } finally {
    catalogLoading.value = false
  }
}

const courseOptions = computed(() => {
  let courses = allCourses.value

  return courses.map(c => ({
    label: `${c.course_code} - ${truncateText(c.course?.name || c?.name || 'Sin nombre', 40)}`,
    value: c.course_code,
    _data: c
  }))
})

const semesterOptions = computed(() => {
  if (!coursesResponse.value?.courses) return []

  const semesters = coursesResponse.value.courses
    .map(s => Number(s.semester))
    .filter(s => !isNaN(s))

  if (semesters.length === 0) return []

  return [...new Set(semesters)]
    .sort((a, b) => a - b)
    .map(s => ({ label: `Semestre ${s}`, value: s }))
})

function onSectionInput(value: string) {
  const normalized = normalizeSection(value)
  setValues({
    section: normalized
  })
}

async function onSemesterFilterChange(value: number | null) {
  semesterFilter.value = value

  if (formValues.value.pensumId) {
    const pensumId = Number(formValues.value.pensumId)

    formValues.value.courseCode = null
    selectedCourse.value = null
    setValues({
      courseCode: ''
    })

    if (value) {
      await fetchCoursesBySemester(pensumId, value)
    } else {
      await fetchCourses(pensumId)
    }

    await nextTick()
  }
}

async function onCareerChange(careerCode: string) {
  formValues.value.careerId = careerCode
  formValues.value.pensumId = null
  formValues.value.courseCode = null
  selectedCourse.value = null
  coursesResponse.value = null
  semesterFilter.value = null

  setValues({
    pensumId: '',
    courseCode: ''
  })

  if (careerCode) {
    await fetchPensums(Number(careerCode))
  }
}

async function onPensumChange(pensumId: string) {
  formValues.value.pensumId = pensumId
  formValues.value.courseCode = null
  selectedCourse.value = null
  semesterFilter.value = null

  setValues({
    courseCode: ''
  })

  if (pensumId) {
    await fetchCourses(Number(pensumId))
  }
}

function onCourseChange(courseCode: string) {
  formValues.value.courseCode = courseCode

  const pensumCourse = allCourses.value.find(pc => pc.course_code === courseCode)
  if (pensumCourse) {
    selectedCourse.value = pensumCourse
  }
}

const formSchema = z.object({
  careerId: z.string().nonempty('La carrera es requerida'),
  pensumId: z.string().nonempty('El pensum es requerido'),
  courseCode: z.string().nonempty('El curso es requerido'),
  section: z.string()
    .nonempty('La sección del curso es requerida')
    .refine((val) => isValidSection(val), {
      message: 'La sección debe ser una letra (A, B, C, etc.)'
    }),
  platform: z.string().nonempty('La plataforma es requerida'),
  link: z.string().nonempty('El enlace es requerido').url('Debe ser una URL válida'),
  visibility: z.string().nonempty('La visibilidad es requerida'),
  typeId: z.coerce.number().nullable().refine((val) => val !== null, {
    message: 'El tipo de grupo es requerido'
  }),
  academicPeriodId: z.coerce.number().nullable().refine((val) => val !== null, {
    message: 'El período académico es requerido'
  }),
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
    typeId: null, 
    academicPeriodId: null, 
    lecturerName: '',
    alternativeContact: '',
    contactNotes: ''
  },
  validateOnMount: false
})


const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    const pensumCourse = allCourses.value.find(pc => pc.course_code === values.courseCode)

    const groupData = {
      courseCode: values.courseCode,
      courseNameCache: pensumCourse?.course?.name || values.courseCode,
      section: values.section || undefined,
      platform: values.platform as 'whatsapp' | 'telegram',
      link: values.link,
      visibility: values.visibility as 'abierto' | 'privado',
      type: props.types.find(t => t.id === values.typeId!)!,
      academicPeriod: props.periods.find(p => p.id === values.academicPeriodId!)!,
      alternativeContact: values.alternativeContact || undefined,
      contactNotes: values.contactNotes || undefined,
      lecturer: values.lecturerName ? {
        fullName: values.lecturerName,
        email: '',
        school: ''
      } : undefined
    }

    const result = await courseGroupsApi.create(groupData)
    emit('save', result)
    toast.success('Grupo creado exitosamente')
    
  } catch (error) {
    toast.error('Error al crear el grupo', {
      description: error instanceof Error ? error.message : 'Ocurrió un error inesperado'
    })
  } finally {
    loading.value = false
  }
})

onMounted(async () => {
  await fetchCareers()
  const periodoActual = props.periods.find(p => p.current)
  resetForm()
  nextTick(() => {
    setValues({
      platform: '',
      visibility: '',
      academicPeriodId: null,
      typeId: null
    })
  })
})
</script>