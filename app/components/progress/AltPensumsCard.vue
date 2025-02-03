<template>
  <CCardAlt>
    <template #title>
      <h1 class="mb-2 text-2xl font-bold">
        Semestre {{ semesterProgress.semester }}
      </h1>
    </template>

    <template #content>
      <div class="mb-2">
        <span class="block text-sm"> Filtrar por: </span>
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
        <CourseCardProgress
          v-for="course in filteredCourses"
          :key="course.course_code"
          :course="course"
          @update-item="($event) => updateItem(course.id, $event)"
        />
        <!-- <CourseCard
          :course="course"
          v-for="course in filteredCourses"
          :key="course.course_code"
        /> -->
      </TransitionGroup>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import CChipButton from '~/components/primitives/button/CChipButton.vue'
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import CourseCardProgress from './CourseCardProgress.vue'
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
