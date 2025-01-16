<template>
    <table class="elevation-1 rounded-lg" height="650px">
        <!-- <tr>
            <th class="sticky top-0 z-2 bg-surface-100" rowspan="2"></th>
        </tr> -->
        <tr class="sticky top-0 z-10 ">
          <th class=""></th>
            <th v-for="classroom in classrooms" :key="classroom.id" class="alternating-inv min-w-32">
                <div class="grid grid-cols-1 text-left">
                    <div class="font-normal">
                        Salón
                    </div>
                    <div class="text-3xl font-medium">
                        {{ classroom.name }}
                    </div>
                </div>
                </col>
            </th>
        </tr>
        <tr class="border-b border-b-surface-75" v-for="hour in hours" :key="hour.id">
            <th class="text-center fixed-column">
                {{ hour.start_time + '-' + hour.end_time }}
            </th>
            <td class="alternating" v-for="classroom in classrooms" :key="classroom.id">
                <v-container v-for="schedule in schedules" :key="schedule.id" style="padding: 0px">
                    <CursoHorario v-if="
                        schedule.periods[0].hour.start_time == hour.start_time &&
                        schedule.classroom_id == classroom.id
                    " :curso="schedule" />
                </v-container>
            </td>
        </tr>
    </table>
</template>

<script setup lang="ts">
import CursoHorario from '~/components/portal/horarios/CursoHorario.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

defineProps<{
    hours: Array<Hour>
    classrooms: Array<Classroom>
    schedules: Array<Course>
}>()
</script>

<style scoped lang="postcss">
.alternating {
    @apply odd:bg-surface-100 border-r-2 border-r-surface-300;
}

.alternating-inv {
    @apply even:bg-surface-100 border-r-2 border-r-surface-300;
}
</style>