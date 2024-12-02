<template>
  <CCardAlt>
    <template #title>
      <h1 class="mb-2 text-3xl font-bold">
        Semestre {{ semesterCourses.semester }}
      </h1>
    </template>

    <template #content>
      <div class="mb-4">
        <span class="text-overline"> Filtrar por: </span>
        <br>
        <CChipButton label="Solo obligatorios" v-model="onlyMandatory"></CChipButton>
      </div>
      <TransitionGroup
              name="course-transition"
              tag="div"
              class="transition-group"
      >
      <div
        class="mb-2"
        v-for="course in filteredCourses"
        :key="course.course_code"
      >
        <CourseCard :course="course" />
      </div>
      </TransitionGroup>
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
<style scoped>
/* Transiciones para la entrada y salida */
.course-transition-enter-active,
.course-transition-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.course-transition-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.course-transition-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.course-transition-leave-from {
  opacity: 1;
  transform: translateY(0px);
}

.course-transition-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

/* Estilo para mantener la posición al salir */
.transition-item {
  position: relative;
}

.course-transition-leave-active {
  position: absolute;
  max-width: 50%;
  z-index: 1;
}
</style>