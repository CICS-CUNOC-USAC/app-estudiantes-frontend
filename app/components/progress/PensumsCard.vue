<template>
  <v-card border flat>
    <v-card-title class="">
      <v-row no-gutters>
        <v-col class="d-flex align-center">
          <v-icon
            :icon="`mdi-numeric-${semesterProgress.semester}`"
            size="60"
          ></v-icon>
          <h3>Semestre</h3>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider class="mx-4 mb-1"></v-divider>

    <div class="px-4">
      <span class="text-overline"> Filtrar por: </span>
      <v-chip-group v-model="onlyMandatory">
        <v-chip variant="outlined" filter :value="true"
          >Solo obligatorios</v-chip
        >
      </v-chip-group>
    </div>

    <v-container v-for="course in filteredCourses" :key="course.course_code">
      <v-card rounded="lg" max-height="5rem">
        <v-row>
          <v-col
            cols="1"
            :style="{
              backgroundColor: getFieldColor(course.career_course.field)
            }"
          >
          </v-col>
          <v-col cols="2" class="d-flex flex-column align-center">
            <span class="h-50 d-flex align-center">{{
              course.course_code
            }}</span>
            <strong class="h-50 d-flex align-center"
              >{{ course.career_course.course.credits }}
              <span class="text-body-1">Cr</span></strong
            >
          </v-col>
          <v-col class="my-auto" cols="7">
            <CourseDialog
              :field="course.career_course.field"
              :course-code="course.career_course.course_code"
              :mandatory="course.career_course.mandatory"
              :course-name="course.career_course.course.name"
              :career-code="course.career_course.career_code"
            />
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-checkbox
              :model-value="course.approved"
              color="orange"
              @update:model-value="updateItem(course.id, $event)"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-card>
</template>
<script setup lang="ts">
import CourseDialog from '@/components/dialogs/courses/CourseDialog.vue'
const { openAndFetchCareerCourse } = useCoursesStore()
const onlyMandatory = ref()
const props = defineProps<{
  semesterProgress: SemesterProgress
}>()
const filteredCourses = computed(() => {
  if (onlyMandatory.value) {
    return props.semesterProgress.courses_semester_progress.filter(
      (course) => course.career_course.mandatory
    )
  }
  return props.semesterProgress.courses_semester_progress
})
const emits = defineEmits(['updateItem'])
const updateItem = (courseProgressId: number, approved: boolean) => {
  emits('updateItem', {
    courseProgressId,
    careerProgressId: props.semesterProgress.career_progress_id,
    approved
  })
}
</script>
