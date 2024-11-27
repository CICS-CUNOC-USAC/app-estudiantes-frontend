<template>
  <CCardAlt
    elevated
  >
    <template #title>
      <h1 class="text-4xl mb-4 ml-4 font-bold pb-5 pt-3">Semestre {{ semesterCourses.semester }}</h1>
    </template>

    <template #content>
      <div class="px-4">
        <span class="text-overline"> Filtrar por: </span>
        <v-chip-group v-model="onlyMandatory">
          <v-chip variant="outlined" filter :value="true"
            >Solo obligatorios</v-chip
          >
        </v-chip-group>
      </div>
      <v-container v-for="course in filteredCourses" :key="course.course_code">
        <v-card rounded="lg" class="py-3">
          <v-row>
            <v-col
              cols="1"
              :style="{
                backgroundColor: getFieldColor(course.field)
              }"
            >
            </v-col>
            <v-col cols="2" class="d-flex flex-column align-center">
              <span class="h-50 d-flex align-center">{{
                course.course_code
              }}</span>
              <strong class="h-50 d-flex align-center"
                >{{ course.course.credits }}
                <span class="text-body-1">Cr</span></strong
              >
            </v-col>
            <v-col class="my-auto" cols="8">
              <CourseDialog
                :field="course.field"
                :course-code="course.course_code"
                :mandatory="course.mandatory"
                :course-name="course.course.name"
                :career-code="course.career_code"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
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
