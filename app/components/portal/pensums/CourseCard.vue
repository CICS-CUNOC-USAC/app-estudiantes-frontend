<template>
  <component
    class="flex min-h-20 -translate-x-0.5 -translate-y-0.5 flex-row overflow-hidden rounded-[10px] border border-surface-950/75 bg-surface-50 shadow-[2px_2px_0_0_rgba(0,0,0,1)] duration-300 ease-in-out text-color dark:bg-gray-700"
  >
    <div
      class="mr-2 basis-[7%] rounded-[8px] border border-surface-950/75"
      :style="{
        backgroundColor: getFieldColor(course.field)
      }"
    ></div>
    <div class="mr-2 flex basis-[88%]">
      <div class="flex basis-[16%] flex-col justify-center">
        <span class="">{{ course.course_code }}</span>
        <strong class=""
          >{{ course.course.credits }} <span class="">Cr</span></strong
        >
      </div>
      <!--Divider-->
      <div class="m-1 mr-2 min-h-[1em] w-0.5 bg-gray-950"></div>
      <!--Divider-->
      <div class="basis-[84%] content-center" cols="8">
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
      class="m-1 max-h-4 basis-[5%] rounded-[6px]"
      :style="{
        backgroundColor: 'black'
      }"
    ></div>
  </component>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import { NuxtLink } from '#components'
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
