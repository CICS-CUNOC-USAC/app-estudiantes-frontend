<template>
  <CCardAlt>
    <template #title>
      <h1 class="mb-2 text-2xl font-bold">
        Semestre {{ semesterCourses.semester }}
      </h1>
    </template>

    <template #content>
      <div class="mb-2">
        <span class="block"> Filtrar por: </span>
        <CChipButton
          label="Solo obligatorios"
          filter
          icon="lucide:check"
          v-model="onlyMandatory"
          class="my-1.5"
        ></CChipButton>
      </div>
      <TransitionGroup
        name="course-transition"
        tag="div"
        class="relative space-y-2"
      >
        <CourseCard
          :course="course"
          v-for="course in filteredCourses"
          :key="course.course_code"
        />
      </TransitionGroup>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import CChipButton from '~/components/primitives/button/CChipButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import type { CareerCourses } from '~/utils/types/career-courses'
import CourseCard from './CourseCard.vue'
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
<style scoped>
@reference '~/assets/css/main.css';
/* Transiciones para la entrada y salida */
.course-transition-move,
.course-transition-enter-active,
.course-transition-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.course-transition-enter-from,
.course-transition-leave-to {
  @apply opacity-0;
}

.course-transition-leave-active {
  @apply absolute w-full;
}
</style>
