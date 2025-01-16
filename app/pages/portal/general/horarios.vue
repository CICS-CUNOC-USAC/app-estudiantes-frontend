<template>
  <main>
    <h1 class="mb-4">Horario de Clases V1</h1>
    <v-container
      v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
    >
      <ClassScheduleV1
        :hours="hours!"
        :classrooms="classrooms!"
        :schedules="schedules!"
      />
    </v-container>
  </main>
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

const { data: hours, pending: loadingHours } =
  useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

const { data: schedules, pending: loadingSchedules } =
  useCustomLazyFetch<Array<Course>>(`schedules/courses`)

</script>
<style scoped lang="scss"></style>
