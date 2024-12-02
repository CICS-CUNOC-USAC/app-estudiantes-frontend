<template>
  <CCardAlt>
    <template #title>
      <h1 class="mb-2 text-3xl font-bold">
        Semestre {{ semesterCourses.semester }}
      </h1>
    </template>

    <template #content>
      <div class="mb-2">
        <span class="text-overline"> Filtrar por: </span>
        <v-chip-group v-model="onlyMandatory">
          <v-chip variant="outlined" filter :value="true"
            >Solo obligatorios</v-chip
          >
        </v-chip-group>
        <CChipButton label="Solo obligatorios"></CChipButton>
      </div>
      <div
        class="mb-2"
        v-for="course in filteredCourses"
        :key="course.course_code"
      >
        <CourseCard :course="course" />
      </div>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CChipButton from '~/components/primitives/button/CChipButton.vue'
import CourseCard from './CourseCard.vue'
import CText from '~/components/primitives/text/CText.vue'
import type { CareerCourses } from '~/utils/types/career-courses'
const onlyMandatory = ref()
const props = defineProps<{
  semesterCourses: CareerCourses
}>()
const filteredCourses = computed(() => {
  if (onlyMandatory.value) {
    return props.semesterCourses.courses.filter((course) => course.mandatory)
  }
  return props.semesterCourses.courses
})
</script>
