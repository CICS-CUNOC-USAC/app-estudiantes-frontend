<template>
  <v-row class="mt-6">
    <v-col
      v-for="item in careerCourses"
      :key="item.semester"
      cols="12"
      sm="6"
      lg="4"
    >
      <SemesterCoursesCard :semester-courses="item" />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import SemesterCoursesCard from './SemesterCoursesCard.vue'
import type { CareerCourses } from '~/utils/types/career-courses'

defineProps<{
  careerCourses: CareerCourses[] | undefined
  loading: boolean
}>()
</script>
<style lang="scss" scoped></style>
