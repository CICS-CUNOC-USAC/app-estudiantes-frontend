<template>
  <div>
    <div class="grid grid-cols-5">
      <div class="col-span-1 justify-self-center">
        <ToggleGroupRoot
          :model-value="scheduleType"
          @update:model-value="
            (val) => {
              if (val) scheduleType = val as string
            }
          "
          type="single"
          class="flex gap-1"
        >
          <ToggleGroupItem
            value="calendar"
            class="rounded-lg transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-transparent px-2.5 py-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
            >Calendario</ToggleGroupItem
          >
          <ToggleGroupItem
            value="classroom"
            class="rounded-lg transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-transparent px-2.5 py-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
            >Salón</ToggleGroupItem
          >
        </ToggleGroupRoot>

        <!-- <CButton class="h-min" label="Calendario" />
        <CButton class="h-min" label="Salon" /> -->
      </div>
      <div class="col-span-4">
        <div
          class="grid grid-cols-1"
          v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
        >
          <div class="grid grid-cols-5">
            <div class="col-span-1">
              <CButton class="h-min" label="Todas las Carreras" />
            </div>
            <div class="col-span-3 justify-self-center">
              <ToggleGroupRoot
                :model-value="coursesMode"
                @update:model-value="
                  (val) => {
                    if (val) coursesMode = val as string
                  }
                "
                type="single"
                class="flex gap-1"
              >
                <ToggleGroupItem
                  value="lectures"
                  class="rounded-lg transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-transparent px-2.5 py-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                  >Clases</ToggleGroupItem
                >
                <ToggleGroupItem
                  value="labs"
                  class="rounded-lg transition active:translate-x-0.5 active:translate-y-0.5 border-2 border-transparent px-2.5 py-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                  >Laboratorios</ToggleGroupItem
                >
              </ToggleGroupRoot>
            </div>
            <div class="col-span-1">
              <CInputText
                v-model="search"
                placeholder="Buscar"
                prepend-icon="lucide:search"
                no-borders
              />
            </div>
          </div>
          <ClassScheduleV1
            :hours="hours!"
            :classrooms="classrooms!"
            :schedules="schedules!"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'

const { data: hours, pending: loadingHours } =
  useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

const { data: schedules, pending: loadingSchedules } =
  useCustomLazyFetch<Array<Course>>(`schedules/courses`)

definePageMeta({
  layout: 'schedule'
})
const search = ref('')

const scheduleType = ref('calendar')
const coursesMode = ref('lectures')

function printThis() {
  console.log(scheduleType)
}
</script>
<style scoped lang="scss"></style>
