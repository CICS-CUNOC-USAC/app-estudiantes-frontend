<template>
  <div
    class="flex min-h-16 rounded-[12px] border border-surface-950/75 bg-surface-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)] ease-in-out text-color dark:bg-surface-800"
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
      <div class="w-auto flex-1 min-w-0 py-1.5">
        <CourseDialog
          :field="course.field"
          :course-code="course.course_code"
          :mandatory="false"
          :course-name="course.course.name"
          :pensum-id="course.pensum_id"
          :prerequisites="prerequisites"
        />
        <div v-if="prerequisites.length" class="mt-0.5 flex flex-wrap gap-1">
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
      class="m-1.5 size-3 rounded-sm bg-surface-950/75 dark:bg-cics-white"
    ></div>
  </div>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import type { PensumSemesterCourse } from '~/utils/types/pensum-courses'
import { fetchPrerequisites, type Prerequisite } from '~/lib/api/admin/prerequisites'

const props = defineProps<{
  course: PensumSemesterCourse
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

const prerequisites = ref<Prerequisite[]>([])

onMounted(async () => {
  try {
    prerequisites.value = await fetchPrerequisites(props.course.pensum_id, props.course.course_code)
  } catch {
    // silently fail — prerequisites are supplementary info
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
</script>
<style lang="postcss" scoped></style>
