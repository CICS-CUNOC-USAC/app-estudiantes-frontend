<template>
    <table class="elevation-1 rounded-lg" height="650px">
        <tr class="sticky top-0 z-10 align-top">
          <th class=""></th>
            <th v-for="classroom in classrooms" :key="classroom.id" class="alternating border min-w-52">
                <div class="grid grid-cols-1 text-left pl-2">
                    <div class="font-light text-sm">
                        Salón
                    </div>
                    <div class="text-3xl font-medium">
                        {{ classroom.name }}
                    </div>
                </div>
                </col>
            </th>
        </tr>
        <tr v-for="hour in hours" :key="hour.id">
            <th class="font-medium text-sm pr-8">
                {{ hour.start_time }} - {{ hour.end_time }}
            </th>
            <td class="alternating border border-b border-b-surface-75" v-for="classroom in classrooms" :key="classroom.id">
                <div v-for="schedule in schedules" :key="schedule.id">
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
    @apply border-r-[2px] border-r-surface-400;
}
</style>