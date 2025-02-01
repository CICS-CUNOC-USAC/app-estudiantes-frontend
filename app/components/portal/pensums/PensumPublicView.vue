<template>
  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <template v-if="loading">
      <PSkeleton height="500px" width="100%"></PSkeleton>
      <PSkeleton height="500px" width="100%"></PSkeleton>
      <PSkeleton height="500px" width="100%"></PSkeleton>
      <PSkeleton height="500px" width="100%"></PSkeleton>
    </template>
    <template v-if="careerCourses && !loading">
      <SemesterCoursesCard
        v-for="item in careerCourses"
        :key="item.semester"
        :semester-courses="item"
      />
    </template>
  </div>
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
