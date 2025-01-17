<template>
  <table class="">
    <thead class=" sticky top-14 z-10">
      <tr class="">
        <th class=""></th>
        <th v-for="classroom in classrooms" :key="classroom.id" class="alternating px-3 py-1 bg-clip-padding bg-white min-w-52">
          <div class="text-left">
            <div class="font-normal">
              Salón
            </div>
            <div class="text-lg font-medium">
              {{ classroom.name }}
            </div>
          </div>
          </col>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="hour in hours" :key="hour.id">
        <th class="font-medium text-sm p-2 sticky left-0 z-10 bg-white">
          {{ hour.start_time }} - {{ hour.end_time }}
        </th>
        <td class="alternating border-b border-b-surface-75" v-for="classroom in classrooms" :key="classroom.id">
          <div class="ml-[1px]" v-for="schedule in schedules" :key="schedule.id">
            <!--
                    <CursoHorario v-if="
                        schedule.periods[0].hour.start_time == hour.start_time &&
                        schedule.classroom_id == classroom.id
                    " :curso="schedule" />
                    -->
            <ScheduleCourseCard v-if="
              schedule.periods[0].hour.start_time == hour.start_time &&
              schedule.classroom_id == classroom.id
            "
            career="Ciencias y Sistemas"
            :curso="schedule.career_course.course.name"
            :seccion="schedule.section.name"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import CursoHorario from '~/components/portal/horarios/CursoHorario.vue'
import ScheduleCourseCard from '~/components/cards/ScheduleCourseCard.vue';
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

defineProps<{
  hours: Array<Hour>
  classrooms: Array<Classroom>
  schedules: Array<Course>
}>()
</script>

<style scoped lang="postcss">
.alternating {
  @apply even:bg-surface-100;
}

.border {
  /* @apply border-r-[2px] border-r-surface-400; */
}
</style>