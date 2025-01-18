<template>
    <div class="grid grid-flow-col auto-cols-max">
        <div class="grid grid-flow-row auto-rows-max">
            <div class="min-h-12"></div>
            <div class="min-h-36 max-w-12 mr-2 text-center" v-for="hour in hours" :key="hour.id">
                {{ hour.start_time }} - {{ hour.end_time }}
            </div>
        </div>
        <div class="w-52" v-for="classroom in classrooms" :key="classroom.id">
            <div class="text-left border-r">
                <div class="font-normal">
                    Salón
                </div>
                <div class="text-lg font-medium">
                    {{ classroom.name }}
                </div>
            </div>
            <div class="min-h-36 border-b border-r" v-for="hour in hours" :key="hour.id">
                <template v-for="schedule in schedules" :key="schedule.id">
                    <ScheduleCourseCard v-if="
                        schedule.periods[0].hour.start_time == hour.start_time &&
                        schedule.classroom_id == classroom.id
                    " :career="schedule.career_course.career.name" :curso="schedule.career_course.course.name"
                        :seccion="schedule.section.name" :semester="schedule.career_course.semester"
                        :days="schedule.periods.map(period => period.weekday_id)" />
                </template>
            </div>
        </div>
    </div>
    <!--
    <table class="">
        <thead class=" sticky top-14 z-10">
            <tr class="">
                <th class=""></th>
                <th v-for="classroom in classrooms" :key="classroom.id"
                    class="alternating px-3 py-1 bg-clip-padding bg-white min-w-52">
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
                <td class="alternating border-b border-b-surface-75" v-for="classroom in classrooms"
                    :key="classroom.id" >
                    <div class="ml-[1px] h-full" v-for="schedule in schedules" :key="schedule.id">
                        <ScheduleCourseCard class="h-full" v-if="
                            schedule.periods[0].hour.start_time == hour.start_time &&
                            schedule.classroom_id == classroom.id
                        " :career="schedule.career_course.career.name" :curso="schedule.career_course.course.name"
                            :seccion="schedule.section.name" :semester="schedule.career_course.semester"
                            :days="schedule.periods.map(period => period.weekday_id)" />
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    -->
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