<template>
    <div class="grid grid-cols-schedule grid-rows-hours">
        <div class="bg-black-200 col-span-1 col-start-1 row-start-1">
        </div>
        <div class="bg-surface-300 row-start-1 col-span-1" v-for="classroom in classrooms" :key="classroom.id">
            Salon
            {{ classroom.name }}
        </div>
        <div class="bg-surface-100 col-start-1 col-end-23 row-start-2 row-end-11 grid grid-cols-subgrid">
            <div class="bg-surface-700 border-b row-span-1 col-start-1" v-for="hour in hours" :key="hour.id" >
                <div class="bg-surface-600 border-b col-end-1">
                    {{ hour.start_time }} - {{ hour.end_time }}
                </div>
                <div class="bg-surface-700 border-b col-span-1" v-for="classroom in classrooms" :key="classroom.id">
                    OO
                </div>
            </div>
        </div>
        <!--
        <div class="bg-surface-500 col-start-2 col-end-23 row-start-2 row-end-11 grid grid-cols-subgrid gap-4">
            <div class="bg-surface-400 col-span-1 row-start-1 gap-2" v-for="classroom in classrooms" :key="classroom.id">
                <div class="bg-black border-b" v-for="hour in hours" :key="hour.id">
                    O
                </div>
            </div>
        </div>
        -->
    </div>
    <!--
    <div :class="`grid grid-flow-col grid-rows-${hours.length + 1}`">
        <div>
            <div class="min-h-12"></div>
            <div class="min-h-36 max-w-12 mr-2 text-center" v-for="hour in hours" :key="hour.id">
                {{ hour.start_time }} - {{ hour.end_time }}
            </div>
        </div>
        <div class="grid grid-cols-subgrid w-52 max-h-32" :class="`grid-en`" v-for="classroom in classrooms" :key="classroom.id">
            <div class="text-left border-r">
                <div class="font-normal">
                    Salón
                </div>
                <div class="text-lg font-medium">
                    {{ classroom.name }}
                </div>
            </div>
            <template v-for="hour in hours" :key="hour.id">
                <template v-if="hasSchedule(classroom.id, hour, schedules)">
                    <div class="h-32 border-b border-r" :class="{'row-span-1' : getPeriodsSchedule(lastSchedule.value.periods) > 1}" v-if="typeof lastSchedule.value !== 'undefined'">
                        <ScheduleCourseCard :career="lastSchedule.value.career_course.career.name"
                            :curso="lastSchedule.value.career_course.course.name" :seccion="lastSchedule.value.section.name"
                            :semester="lastSchedule.value.career_course.semester"
                            :days="lastSchedule.value.periods.map(period => period.weekday_id)" />
                    </div>
                </template>
                <div class="h-32 border-b border-r" v-else>
                </div>
            </template>
        </div>
    </div>
    -->
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
import type { Classroom, Course, Hour, Period, ScheduleCourse } from '~/utils/types/schedule-courses'

defineProps<{
    hours: Array<Hour>
    classrooms: Array<Classroom>
    schedules: Array<Course>
}>()

function hasSchedule(classroom_id: number, hour: Hour, schedules: Array<Course>) {
    const schedule = getSchedule(classroom_id, hour, schedules)
    if (schedule) {
        return true;
    }
    return false;
}

const currentSchedule: Ref<Course | undefined> = ref()
const lastSchedule = computed({
    get() {
        return currentSchedule
    },
    set(newSchedule: Course) {
        currentSchedule.value = newSchedule
    }
})

function getSchedule(classroom_id: number, hour: Hour, schedules: Array<Course>) {
    for (const schedule of schedules) {
        if (
            schedule.periods[0].hours[0].start_time == hour.start_time &&
            schedule.classroom_id == classroom_id
        ) {
            lastSchedule.value = schedule
            return schedule as Course;
        }
    };
    return null;
}

function getPeriodsSchedule(periods: Array<Period>) {
    const hours = periods[0].hours
    return hours.length
}
</script>

<style scoped lang="postcss">
.alternating {
    @apply even:bg-surface-100;
}

.border {
    /* @apply border-r-[2px] border-r-surface-400; */
}
</style>