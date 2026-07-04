<template>
  <CCardAlt :title="`Semestre ${semesterCourses.semester}`" class="gap-3">
    <template #content>
      <div class="mb-2 space-y-2">
        <span class="block text-sm"> Filtrar por: </span>
        <Toggle v-model="onlyMandatory" size="sm" with-indicator>
          Solo obligatorios
        </Toggle>
      </div>
      <TransitionGroup
        name="course-transition"
        tag="div"
        class="relative space-y-2"
      >
        <AdminCourseCard
          v-for="course in filteredCourses"
          :key="course.course_code"
          :course="course"
          :pensum-id="pensumId"
          :pensum-courses-list="pensumCoursesList"
          @updated="emit('updated')"
        />
      </TransitionGroup>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import CCardAlt from '~/components/primitives/card/CCardAlt.vue'
import { Toggle } from '~/components/ui/toggle'
import AdminCourseCard from './AdminCourseCard.vue'
import type { PensumSemester } from '~/utils/types/pensum-courses'

const onlyMandatory = ref()

import type { PensumCourseOption } from '~/utils/types/pensum-courses'

const props = defineProps<{
  semesterCourses: PensumSemester
  pensumId: number
  pensumCoursesList: PensumCourseOption[]
}>()

const emit = defineEmits<{
  updated: []
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
