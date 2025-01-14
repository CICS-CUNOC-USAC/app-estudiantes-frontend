<template>
  <div
    class="flex min-h-16 rounded-[10px] border border-surface-950/75 bg-surface-50 shadow-[2px_2px_0_0_rgba(0,0,0,1)] ease-in-out text-color dark:bg-gray-700"
  >
    <div
      class="mr-3 w-5 shrink-0 rounded-lg border border-surface-950/75"
      :style="{
        backgroundColor: getFieldColor(course.field)
      }"
    ></div>
    <div class="flex flex-1 gap-4 items-center">
      <div class="w-9 text-sm shrink-0">
        <span class="block">{{ course.course_code }}</span>
        <strong class="block"
          >{{ course.course.credits }} <span class="">Cr</span></strong
        >
      </div>
      <!--Divider-->
      <div class="h-3/4 w-0.5 shrink-0 rounded-lg bg-gray-950"></div>
      <!--Divider-->
      <div class="w-auto" cols="8">
        <CourseDialog 
          :field="course.field"
          :course-code="course.course_code"
          :mandatory="false"
          :course-name="course.course.name"
          :career-code="course.career_code"
        />
      </div>
    </div>
    <div
      v-if="course.mandatory"
      class="m-1.5 size-3.5 rounded-md bg-surface-950/75 dark:bg-cics-white"
    ></div>
  </div>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import type { SemesterCourses } from '~/utils/types/career-courses'
defineProps<{
  course: SemesterCourses
  elevated?: boolean
  interactive?: boolean
  interactiveInverse?: boolean
  title?: string
  description?: string
  to?: string
  small?: string
  smallIcon?: string
  noSpacing?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
