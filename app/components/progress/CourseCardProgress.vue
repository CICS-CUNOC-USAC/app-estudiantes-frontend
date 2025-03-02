<template>
  <div
    class="flex min-h-16 relative rounded-[10px] border border-surface-950/75 bg-surface-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)] ease-in-out text-color dark:bg-surface-800"
  >
    <div
      class="mr-3 w-5 shrink-0 rounded-lg border border-surface-950/75"
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
      <PCheckbox
        :model-value="course.approved"
        @update:modelValue="updateItem($event)"
        binary
        size="small"
        class="mr-4"
      />
    </div>
    <div
      v-if="course.career_course.mandatory"
      class="absolute size-2.5 rounded-sm bg-surface-950/75 dark:bg-cics-white top-1 right-1"
    ></div>
  </div>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
const props = defineProps<{
  course: CoursesSemesterProgress
}>()
const emits = defineEmits(['updateItem'])
const updateItem = (approved: boolean) => {
  emits('updateItem', approved)
}
</script>
<style lang="postcss" scoped></style>
