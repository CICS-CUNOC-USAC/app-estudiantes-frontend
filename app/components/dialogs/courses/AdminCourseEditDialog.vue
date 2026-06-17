<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogScrollContent class="max-h-[90vh] max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar curso</DialogTitle>
        <DialogDescription>
          Codigo: <span class="font-semibold">{{ courseCode }}</span>
        </DialogDescription>
      </DialogHeader>

      <!-- Course info form -->
      <form @submit="onSubmit">
        <FieldGroup :disabled="asyncStatus === 'loading'" class="!gap-3 disabled:opacity-60">
          <VeeField v-slot="{ componentField, errors }" name="name">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Nombre"
                id="edit-course-name"
                no-borders
                prepend-icon="icon-park-twotone:tag"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <VeeField v-slot="{ componentField, errors }" name="credits">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Creditos"
                id="edit-course-credits"
                type="number"
                no-borders
                prepend-icon="icon-park-twotone:degree-hat"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <VeeField v-slot="{ componentField, errors }" name="description">
            <Field :data-invalid="!!errors.length">
              <CInputText
                v-bind="componentField"
                label="Descripcion"
                id="edit-course-description"
                no-borders
                prepend-icon="icon-park-twotone:file-text"
                :error="errors[0]"
              />
            </Field>
          </VeeField>

          <div class="flex justify-end">
            <Button
              label="Guardar curso"
              icon="icon-park-outline:check"
              type="submit"
              size="small"
              :loading="asyncStatus === 'loading'"
            />
          </div>
        </FieldGroup>
      </form>

      <Separator />

      <!-- Prerequisites section -->
      <div>
        <h3 class="mb-3 text-sm font-semibold">Prerequisitos</h3>

        <div v-if="prereqStatus === 'pending'" class="text-muted-foreground flex items-center gap-2 py-4 text-sm">
          <Icon name="svg-spinners:bars-rotate-fade" />
          Cargando prerequisitos...
        </div>

        <div v-else-if="prerequisites?.length" class="space-y-2">
          <div
            v-for="prereq in prerequisites"
            :key="prereq.id"
            class="border-surface-200 dark:border-surface-700 rounded-lg border px-3 py-2.5"
          >
            <!-- Course prerequisite -->
            <template v-if="prereq.is_course">
              <div
                v-for="entry in prereq.coursePrerequisites"
                :key="entry.id"
                class="flex items-center justify-between gap-2"
              >
                <template v-if="editingId === prereq.id">
                  <div class="flex flex-1 flex-col gap-2">
                    <CourseSearchInput
                      :courses="eligibleCourses"
                      :model-value="editCourseCode"
                      @update:model-value="editCourseCode = $event"
                    />
                    <div class="flex gap-1">
                      <Button
                        label="Guardar"
                        icon="icon-park-outline:check"
                        size="small"
                        @click="saveEdit(prereq)"
                        :loading="editLoading"
                      />
                      <Button
                        label="Cancelar"
                        size="small"
                        severity="secondary"
                        @click="cancelEdit"
                      />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center gap-2">
                    <Icon name="icon-park-twotone:book-open" size="14" class="text-primary-500 shrink-0" />
                    <span class="text-sm">
                      <span class="font-medium">{{ entry.course.code }}</span>
                      — {{ entry.course.name }}
                      <span class="text-muted-foreground">({{ entry.course.credits }} Cr)</span>
                    </span>
                  </div>
                  <div class="flex shrink-0 gap-1">
                    <button
                      type="button"
                      class="hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded p-1 transition"
                      @click="startEdit(prereq)"
                    >
                      <Icon name="icon-park-twotone:edit" size="14" class="text-primary-600 dark:text-primary-300" />
                    </button>
                    <ConfirmDialog
                      title="¿Eliminar prerequisito?"
                      description="El prerequisito sera eliminado permanentemente."
                      @confirm="onDelete(prereq.id)"
                    >
                      <button
                        type="button"
                        class="cursor-pointer rounded p-1 transition hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Icon name="icon-park-outline:delete" size="14" class="text-red-500" />
                      </button>
                    </ConfirmDialog>
                  </div>
                </template>
              </div>
            </template>

            <!-- Credits prerequisite -->
            <template v-else>
              <div
                v-for="entry in prereq.creditsPrerequisites"
                :key="entry.id"
                class="flex items-center justify-between gap-2"
              >
                <template v-if="editingId === prereq.id">
                  <div class="flex flex-1 items-center gap-2">
                    <CInputText
                      v-model="editCredits"
                      placeholder="Creditos"
                      type="number"
                      no-borders
                      class="flex-1"
                      prepend-icon="icon-park-twotone:degree-hat"
                    />
                    <Button
                      icon="icon-park-outline:check"
                      size="small"
                      @click="saveEdit(prereq)"
                      :loading="editLoading"
                    />
                    <Button
                      icon="icon-park-outline:close"
                      size="small"
                      severity="secondary"
                      @click="cancelEdit"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center gap-2">
                    <Icon name="icon-park-twotone:degree-hat" size="14" class="text-primary-500 shrink-0" />
                    <span class="text-sm">
                      Minimo <span class="font-medium">{{ entry.credits }}</span> creditos aprobados
                    </span>
                  </div>
                  <div class="flex shrink-0 gap-1">
                    <button
                      type="button"
                      class="hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded p-1 transition"
                      @click="startEdit(prereq)"
                    >
                      <Icon name="icon-park-twotone:edit" size="14" class="text-primary-600 dark:text-primary-300" />
                    </button>
                    <ConfirmDialog
                      title="¿Eliminar prerequisito?"
                      description="El prerequisito sera eliminado permanentemente."
                      @confirm="onDelete(prereq.id)"
                    >
                      <button
                        type="button"
                        class="cursor-pointer rounded p-1 transition hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Icon name="icon-park-outline:delete" size="14" class="text-red-500" />
                      </button>
                    </ConfirmDialog>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <p v-else-if="prereqStatus === 'success'" class="text-muted-foreground py-3 text-sm">
          Sin prerequisitos registrados.
        </p>

        <!-- Add prerequisite -->
        <div class="mt-3">
          <template v-if="!showAddForm">
            <Button
              label="Agregar prerequisito"
              icon="icon-park-outline:plus"
              size="small"
              variant="tonal"
              @click="showAddForm = true"
            />
          </template>
          <template v-else>
            <div class="border-surface-200 dark:border-surface-700 space-y-3 rounded-lg border p-3">
              <div class="flex gap-2">
                <Button
                  label="Curso"
                  size="small"
                  :severity="newPrereqType === 'course' ? 'default' : 'secondary'"
                  @click="newPrereqType = 'course'"
                />
                <Button
                  label="Creditos"
                  size="small"
                  :severity="newPrereqType === 'credits' ? 'default' : 'secondary'"
                  @click="newPrereqType = 'credits'"
                />
              </div>

              <CourseSearchInput
                v-if="newPrereqType === 'course'"
                :courses="eligibleCourses"
                :model-value="newCourseCode"
                @update:model-value="newCourseCode = $event"
              />
              <CInputText
                v-else
                v-model="newCredits"
                placeholder="Creditos minimos"
                type="number"
                no-borders
                prepend-icon="icon-park-twotone:degree-hat"
              />

              <div class="flex gap-2">
                <Button
                  label="Agregar"
                  icon="icon-park-outline:check"
                  size="small"
                  :loading="addLoading"
                  @click="addPrerequisite"
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
      </div>

      <DialogFooter class="mt-2">
        <DialogClose as-child>
          <Button severity="secondary" label="Cerrar" />
        </DialogClose>
      </DialogFooter>
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
import { Field, FieldGroup } from '~/components/ui/field'
import { Separator } from '~/components/ui/separator'
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
import CourseSearchInput from '~/components/admin/pensums/CourseSearchInput.vue'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import { updateCourse, type UpdateCoursePayload } from '~/lib/api/admin/courses'
import {
  fetchPrerequisites,
  createPrerequisite,
  updatePrerequisite,
  deletePrerequisite,
  type Prerequisite
} from '~/lib/api/admin/prerequisites'
import type { PensumCourseOption } from '~/utils/types/pensum-courses'

const props = defineProps<{
  pensumId: number
  courseCode: string
  courseSemester: number
  courseName: string
  courseDescription: string
  courseCredits: number
  pensumCoursesList: PensumCourseOption[]
}>()

const emit = defineEmits<{
  updated: []
}>()

const open = ref(false)

// --- Course edit form ---

const formSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().default(''),
  credits: z.coerce.number({ required_error: 'Los creditos son requeridos', invalid_type_error: 'Debe ser un numero valido' }).int().min(0, 'Debe ser un numero positivo')
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: props.courseName,
    description: props.courseDescription,
    credits: props.courseCredits
  }
})

const onSubmit = handleSubmit((values) => {
  mutate(values as UpdateCoursePayload)
})

const { mutate, asyncStatus } = useMutation({
  mutation: (data: UpdateCoursePayload) => updateCourse(props.courseCode, data),
  onError(error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Ocurrio un error al actualizar el curso', { description: `Detalle: ${parsedMessage}` })
  },
  onSuccess() {
    toast.success('Curso actualizado exitosamente')
    emit('updated')
  }
})

// --- Prerequisites ---

const prerequisites = ref<Prerequisite[]>([])
const prereqStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

async function loadPrerequisites() {
  prereqStatus.value = 'pending'
  try {
    prerequisites.value = await fetchPrerequisites(props.pensumId, props.courseCode)
    prereqStatus.value = 'success'
  } catch {
    prereqStatus.value = 'error'
  }
}

watch(open, (val) => {
  if (val) {
    resetForm({
      values: {
        name: props.courseName,
        description: props.courseDescription,
        credits: props.courseCredits
      }
    })
    loadPrerequisites()
    editingId.value = null
    showAddForm.value = false
  }
})

// --- Eligible courses (earlier semesters, not self) ---

const eligibleCourses = computed(() =>
  props.pensumCoursesList.filter(c =>
    c.code !== props.courseCode && c.semester < props.courseSemester
  )
)

// --- Validation ---

function validateCoursePrereq(code: string, excludePrereqId?: number): string | null {
  if (!code.trim()) return 'Debes seleccionar un curso'

  if (code === props.courseCode) return 'Un curso no puede ser prerequisito de si mismo'

  const courseInPensum = props.pensumCoursesList.find(c => c.code === code)
  if (!courseInPensum) return 'El curso no pertenece a este pensum'

  if (courseInPensum.semester >= props.courseSemester)
    return `El prerequisito debe ser de un semestre anterior (semestre ${courseInPensum.semester} no es anterior al semestre ${props.courseSemester})`

  const duplicate = prerequisites.value.some(p =>
    p.id !== excludePrereqId &&
    p.is_course &&
    p.coursePrerequisites.some(e => e.course.code === code)
  )
  if (duplicate) return 'Este curso ya es un prerequisito'

  return null
}

function validateCreditsPrereq(credits: string, excludePrereqId?: number): string | null {
  const num = Number(credits)
  if (!credits.trim() || isNaN(num)) return 'Debes ingresar un numero de creditos'
  if (num <= 0) return 'Los creditos deben ser mayores a 0'

  const duplicate = prerequisites.value.some(p =>
    p.id !== excludePrereqId &&
    !p.is_course &&
    p.creditsPrerequisites.some(e => e.credits === num)
  )
  if (duplicate) return 'Ya existe un prerequisito con esa cantidad de creditos'

  return null
}

// --- Edit prerequisite ---

const editingId = ref<number | null>(null)
const editCourseCode = ref('')
const editCredits = ref('')
const editLoading = ref(false)

function startEdit(prereq: Prerequisite) {
  editingId.value = prereq.id
  if (prereq.is_course && prereq.coursePrerequisites.length) {
    editCourseCode.value = prereq.coursePrerequisites[0].course.code
  } else if (!prereq.is_course && prereq.creditsPrerequisites.length) {
    editCredits.value = String(prereq.creditsPrerequisites[0].credits)
  }
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(prereq: Prerequisite) {
  if (prereq.is_course) {
    const error = validateCoursePrereq(editCourseCode.value, prereq.id)
    if (error) { toast.warning(error); return }
  } else {
    const error = validateCreditsPrereq(editCredits.value, prereq.id)
    if (error) { toast.warning(error); return }
  }

  editLoading.value = true
  try {
    const payload = prereq.is_course
      ? { prerequisiteCourseCode: editCourseCode.value }
      : { credits: Number(editCredits.value) }
    await updatePrerequisite(props.pensumId, props.courseCode, prereq.id, payload)
    toast.success('Prerequisito actualizado')
    await loadPrerequisites()
    editingId.value = null
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al actualizar prerequisito', { description: `Detalle: ${parsedMessage}` })
  } finally {
    editLoading.value = false
  }
}

// --- Delete prerequisite ---

async function onDelete(id: number) {
  try {
    await deletePrerequisite(props.pensumId, props.courseCode, id)
    toast.success('Prerequisito eliminado')
    await loadPrerequisites()
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al eliminar prerequisito', { description: `Detalle: ${parsedMessage}` })
  }
}

// --- Add prerequisite ---

const showAddForm = ref(false)
const newPrereqType = ref<'course' | 'credits'>('course')
const newCourseCode = ref('')
const newCredits = ref('')
const addLoading = ref(false)

async function addPrerequisite() {
  if (newPrereqType.value === 'course') {
    const error = validateCoursePrereq(newCourseCode.value)
    if (error) { toast.warning(error); return }
  } else {
    const error = validateCreditsPrereq(newCredits.value)
    if (error) { toast.warning(error); return }
  }

  addLoading.value = true
  try {
    const payload = newPrereqType.value === 'course'
      ? { isCourse: true as const, prerequisiteCourseCode: newCourseCode.value }
      : { isCourse: false as const, credits: Number(newCredits.value) }
    await createPrerequisite(props.pensumId, props.courseCode, payload)
    toast.success('Prerequisito agregado')
    newCourseCode.value = ''
    newCredits.value = ''
    showAddForm.value = false
    await loadPrerequisites()
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al agregar prerequisito', { description: `Detalle: ${parsedMessage}` })
  } finally {
    addLoading.value = false
  }
}
</script>
