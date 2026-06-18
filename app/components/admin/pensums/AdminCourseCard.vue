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
      <div class="min-w-0 flex-1">
        <span class="text-sm">{{ course.course.name }}</span>
      </div>
    </div>
    <div
      v-if="course.mandatory"
      class="bg-surface-950/75 dark:bg-cics-white m-1.5 size-3 rounded-sm"
    ></div>
    <div class="border-surface-950/75 flex shrink-0 border-l px-1">
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
        <Button
          icon="icon-park-twotone:edit"
          variant="text"
          size="icon-sm"
          class="my-auto text-muted-foreground-emphasis"
        />
      </AdminCourseEditDialog>
      <ConfirmDialog
        :title="`¿Eliminar ${course.course.name}?`"
        :description="`El curso ${course.course_code} sera eliminado de este pensum. Esta accion no es reversible.`"
        @confirm="onDeleteCourse"
      >
        <Button
          icon="icon-park-outline:delete"
          variant="text"
          size="icon-sm"
          severity="danger"
          class="my-auto"
        />
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
import { Button } from '~/components/ui/button'

const props = defineProps<{
  course: PensumSemesterCourse
  pensumId: number
  pensumCoursesList: PensumCourseOption[]
}>()

const emit = defineEmits<{
  updated: []
}>()

const courseDescription = computed(() => (props.course.course as any).description ?? '')

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
