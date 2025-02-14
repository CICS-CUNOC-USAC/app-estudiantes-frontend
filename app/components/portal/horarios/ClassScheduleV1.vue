<template>
    <!--VERSION GRID PLUGIN-->
    <ClientOnly>
        <GridLayout id="ScheduleLayoutMain" class="lg:w-[350vw] sm:w-[600vw] w-[1000vw]" v-model:layout="gridState.layout" :col-num="classrooms.length + 2"
            :row-height="120" :margin="[2, 2]">
            <template class="border" v-for="(item, index) in gridState.layout" :key="index">
                <template v-if="item.i === '0'">
                    <GridItem class="" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
                        :i="item.i">
                    </GridItem>
                </template>
                <template v-else-if="item.type === 'classroom'">
                    <GridItem class="text-left border-r border-gray-200 pl-2" :static="item.static" :x="item.x" :y="item.y" :w="item.w"
                        :h="item.h" :i="item.i">
                        <div class="text-sm">
                            Salón
                        </div>
                        <div class="text-lg font-bold">
                            {{ item.content.name }}
                        </div>
                    </GridItem>
                </template>
                <template v-else-if="item.type === 'hour'">
                    <GridItem class="text-center justify-end flex pr-12 pl-12" :static="item.static" :x="item.x"
                        :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                        {{ item.content.start_time }} - {{ item.content.end_time }}
                    </GridItem>
                </template>
                <template v-else-if="item.type === 'schedule'">
                    <template v-if="item.content !== undefined">
                        <GridItem class="border-b border-r border-gray-200 p-0.5 z-10" :static="item.static" :x="item.x" :y="item.y" :w="item.w"
                            :h="item.h" :i="item.i">
                            <ScheduleCourseCard :id="`S${item.content.course_code}${item.content.section.name}`"
                                class="z-20 ScheduleCourseCard" :career="isCommonField(item.content) ? 'Area Comun' : item.content.career_course.career.name"
                                :career_id="isCommonField(item.content) ? 0 : item.content.career_code as number"
                                :curso="item.content.career_course.course.name" :seccion="item.content.section.name"
                                :semester="item.content.career_course.semester"
                                :days="(item.content as Course).periods.map(period => period.weekday_id)" />
                        </GridItem>
                    </template>
                    <template v-else>
                        <GridItem class="border-b border-r border-gray-200" :static="item.static" :x="item.x" :y="item.y" :w="item.w"
                            :h="item.h" :i="item.i">
                        </GridItem>
                    </template>
                </template>
            </template>
        </GridLayout>
    </ClientOnly>
    <!--VERSION GRID-->
    <!--
    <div class="grid grid-cols-schedule grid-rows-hours w-[300vw]">
        <div class="bg-black-200 col-span-1 col-start-1 row-start-1">
        </div>
        <div class="bg-surface-300 row-start-1 col-span-1" v-for="classroom in classrooms" :key="classroom.id">
            Salon
            {{ classroom.name }}
        </div>
        <div class="bg-surface-100 col-start-1 col-end-23 row-start-2 row-end-11 grid grid-cols-subgrid">
            <div class="bg-surface-700 border-b row-span-1 col-start-1 col-end-23 grid grid-cols-subgrid"
                v-for="hour in hours" :key="hour.id"
                :style="`grid-row-start: ${hour.id + 1}; grid-row-end: ${hour.id + 2}`">
                <div class="bg-surface-600 border-b col-start-1 col-span-1">
                    {{ hour.start_time }} - {{ hour.end_time }}
                </div>
                <template v-for="classroom in classrooms" :key="classroom.id">
                    <template v-if="hasSchedule(classroom.id, hour, schedules)">
                        <div class="bg-surface-700 border-b border-r col-span-1 h-32"
                            :class="{ 'row-span-2': getPeriodsSchedule(lastSchedule!.periods) > 1 }" :style="`
                            grid-column-start: ${classroom.id + 1};
                            `">
                            <div class="h-full" v-if="typeof lastSchedule !== 'undefined'">
                                <ScheduleCourseCard :career="lastSchedule.career_course.career.name"
                                    :curso="lastSchedule.career_course.course.name" :seccion="lastSchedule.section.name"
                                    :semester="lastSchedule.career_course.semester"
                                    :days="lastSchedule.periods.map(period => period.weekday_id)" />
                            </div>
                        </div>
                    </template>
<div class="bg-surface-700 h-32 border-b border-r col-span-1 " :style="`
                            grid-column-start: ${classroom.id + 1};
                            `" v-else>
</div>
</template>
</div>
</div>
</div>
-->
    <!--VERSION TAILWIND-->
    <!--
    <div :class="`grid grid-flow-col grid-rows-${hours.length + 1}`">
        <div>
            <div class="min-h-12"></div>
            <div class="min-h-36 max-w-12 mr-2 text-center" v-for="hour in hours" :key="hour.id">
                {{ hour.start_time }} - {{ hour.end_time }}
            </div>
        </div>
        <div class="grid grid-cols-subgrid" v-for="classroom in classrooms" :key="classroom.id">
            <div class="text-left border-r min-h-32">
                <div class="font-normal">
                    Salón
                </div>
                <div class="text-lg font-medium">
                    {{ classroom.name }}
                </div>
            </div>
            <template v-for="hour in hours" :key="hour.id">
                <template v-if="hasSchedule(classroom.id, hour, schedules)">
                    <div class="w-52 h-32 border-b border-r" :class="{'row-span-1' : getPeriodsSchedule(lastSchedule.periods) > 1}" v-if="typeof lastSchedule !== 'undefined'">
                        <ScheduleCourseCard :career="lastSchedule.career_course.career.name" :career_id="lastSchedule.career_code as number"
                            :curso="lastSchedule.career_course.course.name" :seccion="lastSchedule.section.name"
                            :semester="lastSchedule.career_course.semester"
                            :days="lastSchedule.periods.map(period => period.weekday_id)" />
                    </div>
                </template>
                <div class="w-52 h-32 border-b border-r" v-else>
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
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import { isTemplateExpression } from 'typescript';

const props = defineProps<{
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

const currentSchedule = ref<Course | undefined>()
const lastSchedule = computed({
    get() {
        return currentSchedule.value
    },
    set(newSchedule: Course) {
        currentSchedule.value = newSchedule
    }
})

type Cell = {
    x: number,
    y: number,
    w: number,
    h: number,
    i: string,
    static: boolean,
    content: any,
    type: string
}

function createLayout() {
    const width = 1
    const height = 1
    const offset = 0.5
    let layout: Array<Cell> = []

    layout.push(
        { x: 0.5 - offset, y: 0, w: width / 2, h: height, i: '0', static: true, content: undefined, type: 'undefined' }
    )

    //Se llenan los headers de classrooms
    layout = layout.concat(
        props.classrooms.map((classroom, index) => ({
            x: (index + 1) - offset,
            y: 0,
            w: width,
            h: height,
            i: classroom.id.toString() + 'HC',
            static: true,
            content: classroom,
            type: 'classroom'
        }))
    )

    //Se llenan los headers laterales de hora
    layout = layout.concat(
        props.hours.map((hour, index) => ({
            x: 0.5 - offset,
            y: index + 1,
            w: width / 2,
            h: height,
            i: hour.id.toString() + 'HH',
            static: true,
            content: hour,
            type: 'hour'
        }))
    )

    //Se llenan las casillas
    layout = layout.concat(
        props.hours.flatMap((hour, rowIndex) =>
            props.classrooms.map((classroom, colIndex) => {
                const prevRow = rowIndex - 1;
                const prevCell =
                    prevRow >= 0
                        ? layout.find(
                            (cell) =>
                                cell.x === colIndex + 1 &&
                                cell.y === prevRow + 1 &&
                                cell.type === 'schedule'
                        )
                        : undefined;

                const canInsert =
                    !prevCell ||
                    !prevCell.content ||
                    (prevCell.content.periods &&
                        prevCell.content.periods.length === 1);

                const currentSchedule = getSchedule(classroom.id, hour, props.schedules)
                return canInsert
                    ? {
                        x: (colIndex + 1) - offset,
                        y: rowIndex + 1,
                        w: width,
                        h: currentSchedule ? height * getPeriodsSchedule(currentSchedule.periods) : height,
                        i: `${hour.id}-${classroom.id}`,
                        static: true,
                        content: currentSchedule,
                        type: 'schedule',
                    }
                    : {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0,
                        i: `0`,
                        static: true,
                        content: undefined,
                        type: 'delete',
                    }; // Skip creating this cell
            })
        ).filter(cell => cell.type !== 'delete') // Remove null cells from the layout
    )
    return layout
}

const gridState = reactive({
    layout: createLayout()
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
    return undefined;
}

function isCommonField(course: Course) {
    return course.career_course.career_field.common_field
}

function getPeriodsSchedule(periods: Array<Period>) {
    const hours = periods[0].hours
    return hours.length
}
</script>

<style scoped>
@reference '~/assets/css/main.css';

.alternating {
    @apply even:bg-surface-100;
}

.border {
    /* @apply border-r-[2px] border-r-surface-400; */
}
</style>