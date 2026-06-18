<template>
  <div
    class="border-surface-950/75 bg-surface-0 dark:bg-surface-800 text-color flex min-h-16 rounded-[12px] border shadow-[2px_2px_0_0_rgba(0,0,0,1)] ease-in-out"
  >
    <div
      class="border-surface-950/75 mr-3 w-5 shrink-0 rounded-lg border"
      :style="{ backgroundColor: getFieldColor(course.field) }"
    ></div>
    <div class="flex flex-1 items-center gap-4">
      <div class="w-9 shrink-0 text-sm">
        <span class="block">{{ course.course_code }}</span>
        <strong class="block">{{ course.course.credits }} <span>Cr</span></strong>
      </div>
      <div class="bg-gray-950 h-3/4 w-0.5 shrink-0 rounded-lg"></div>
      <div class="min-w-0 flex-1 py-1.5">
        <span class="text-sm">{{ course.course.name }}</span>
        <div v-if="prerequisiteLabels.length" class="mt-0.5 flex flex-wrap gap-1">
          <span
            v-for="prereq in prerequisiteLabels"
            :key="prereq"
            class="text-muted-foreground inline-block max-w-full truncate text-[10px] leading-tight"
          >
            {{ prereq }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="course.mandatory"
      class="bg-surface-950/75 dark:bg-cics-white m-1.5 size-3 rounded-sm"
    ></div>
    <div class="border-surface-950/75 flex shrink-0 border-l">
      <AdminCourseEditDialog
        :pensum-id="pensumId"
        :course-code="course.course_code"
        :course-semester="course.semester"
        :course-name="course.course.name"
        :course-description="courseDescription"
        :course-credits="course.course.credits"
        :pensum-courses-list="pensumCoursesList"
        @updated="emit('updated')"
      >
        <button
          type="button"
          class="hover:bg-surface-100 dark:hover:bg-surface-700 flex h-full cursor-pointer items-center px-2.5 transition"
        >
          <Icon name="icon-park-twotone:edit" size="16" class="text-primary-600 dark:text-primary-300" />
        </button>
      </AdminCourseEditDialog>
      <ConfirmDialog
        :title="`¿Eliminar ${course.course.name}?`"
        :description="`El curso ${course.course_code} sera eliminado de este pensum. Esta accion no es reversible.`"
        @confirm="onDeleteCourse"
      >
        <button
          type="button"
          class="flex cursor-pointer items-center px-2.5 transition hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <Icon name="icon-park-outline:delete" size="16" class="text-red-500" />
        </button>
      </ConfirmDialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import { getFieldColor } from '~/utils/field-color'
import AdminCourseEditDialog from '~/components/dialogs/courses/AdminCourseEditDialog.vue'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import type { PensumSemesterCourse, PensumCourseOption } from '~/utils/types/pensum-courses'
import { removeCourseFromPensum } from '~/lib/api/admin/pensums'
import { fetchPrerequisites, type Prerequisite } from '~/lib/api/admin/prerequisites'

const props = defineProps<{
  course: PensumSemesterCourse
  pensumId: number
  pensumCoursesList: PensumCourseOption[]
}>()

const emit = defineEmits<{
  updated: []
}>()

const courseDescription = computed(() => (props.course.course as any).description ?? '')

const prerequisites = ref<Prerequisite[]>([])

onMounted(async () => {
  try {
    prerequisites.value = await fetchPrerequisites(props.pensumId, props.course.course_code)
  } catch {
  }
})

const prerequisiteLabels = computed(() => {
  const labels: string[] = []
  for (const p of prerequisites.value) {
    if (p.is_course) {
      for (const entry of p.coursePrerequisites) {
        labels.push(entry.course_code)
      }
    } else {
      for (const entry of p.creditsPrerequisites) {
        labels.push(`${entry.credits}Cr`)
      }
    }
  }
  return labels
})

async function onDeleteCourse() {
  try {
    await removeCourseFromPensum(props.pensumId, props.course.course_code)
    toast.success('Curso eliminado del pensum')
    emit('updated')
  } catch (error) {
    const message = (error as FetchError).data?.message
    const parsedMessage = Array.isArray(message) ? message.join(', ') : message
    toast.error('Error al eliminar el curso', { description: `Detalle: ${parsedMessage}` })
  }
}
</script>
