<template>
  <div>
    <span
      class="text-wrap text-body-2 CourseName"
      @click="openAndFetchCareerCourse(courseCode)"
    >
      {{ courseName }}
    </span>

    <v-dialog v-model="dialog" class="CourseDialog">
      <v-skeleton-loader
        v-if="loading"
        type="list-item-two-line"
      ></v-skeleton-loader>
      <v-card v-else>
        <v-card-title class="headline"
          >{{ careerCourse.course.name }} -
          {{ careerCourse.course_code }}</v-card-title
        >
        <v-card-text>
          {{
            careerCourse.course.description === ''
              ? 'Sin descripción'
              : careerCourse.course.description
          }}
          <p>
            {{ careerCourse }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VSkeletonLoader } from 'vuetify/lib/labs/VSkeletonLoader/index.mjs'
defineProps<{
  field: number
  courseCode: string
  courseName: string
}>()
const { fetchCareerCourse } = useCoursesStore()
const { loading, careerCourse } = storeToRefs(useCoursesStore())
const dialog = ref(false)
const openAndFetchCareerCourse = async (courseCode: string) => {
  dialog.value = true
  await fetchCareerCourse(courseCode)
}
</script>
<style lang="scss" scoped>
.CourseName {
  cursor: pointer;
  font-weight: bold;
}
.CourseName:hover {
  text-decoration: underline;
}

.CourseDialog {
  max-width: 100%;
  @media (min-width: 900px) {
    max-width: 50%;
  }
}
</style>
