<template>
  <div
    class="border-surface-950/75 bg-surface-0 text-color dark:bg-surface-800 relative flex min-h-16 rounded-[10px] border shadow-[2px_2px_0_0_rgba(0,0,0,1)] ease-in-out"
  >
    <div
      class="border-surface-950/75 mr-3 w-5 shrink-0 rounded-lg border"
      :style="{
        backgroundColor: getFieldColor(course.career_course.field)
      }"
    ></div>
    <div class="flex flex-1 items-center gap-4">
      <div class="w-9 shrink-0 text-sm">
        <span class="block">{{ course.course_code }}</span>
        <strong class="block"
          >{{ course.career_course.course.credits }}
          <span class="">Cr</span></strong
        >
      </div>
      <!--Divider-->
      <div class="h-3/4 w-0.5 shrink-0 rounded-lg bg-gray-950"></div>
      <!--Divider-->
      <div class="w-auto flex-1" cols="8">
        <CourseDialog
          :field="course.career_course.field"
          :course-code="course.course_code"
          :mandatory="false"
          :course-name="course.career_course.course.name"
          :career-code="course.career_course.career_code"
        />
      </div>
      <Checkbox
        :model-value="course.approved"
        @update:modelValue="updateItem($event as boolean)"
        binary
        size="small"
        class="mr-4"
      />
    </div>
    <div
      v-if="course.career_course.mandatory"
      class="bg-surface-950/75 dark:bg-cics-white absolute top-1 right-1 size-2.5 rounded-sm"
    ></div>
  </div>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import { Checkbox } from '~/components/ui/checkbox'
import type { CoursesSemesterProgress } from '~/lib/api/dashboard/career-progress';
const props = defineProps<{
  course: CoursesSemesterProgress
}>()
const emits = defineEmits(['updateItem'])
const updateItem = (approved: boolean) => {
  emits('updateItem', approved)
}
</script>
<style lang="postcss" scoped></style>
