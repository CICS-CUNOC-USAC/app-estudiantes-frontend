<template>
  <main>
      <div class="grid grid-cols-5">
          <div class="col-span-1">
              Hola mundo
          </div>
    <div
      v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
    >

      <ClassScheduleV1
        :hours="hours!"
        :classrooms="classrooms!"
        :schedules="schedules!"
      />
        </div>
      </div>
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
