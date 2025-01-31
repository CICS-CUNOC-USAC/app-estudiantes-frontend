<template>
  <div class="flex">
    <div class="bg-cics-silver-pale dark:bg-neutral-900 min-h-screen">
      <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
        :hours="availableHours || []"
        @update:selected-periods="
          (val: Hour[]) => {
            if (val) selectedSchedules = val as Hour[]
            // changePeriods(val)
          }
        "
        @update:model-value="
          (val) => {
            console.log(val)
            if (val) scheduleType = val as 'calendar' | 'classroom'
          }
        "
      />
    </div>
    <div class="mt-6">
      <div class="grid grid-cols-1">
        <div class="mb-4 grid grid-cols-6">
          <div class="col-start-2">
            <ArrowedCombobox
              :options="['Todas las Carreras', 'Sistemas']"
            ></ArrowedCombobox>
          </div>
          <div class="col-span-2 col-start-3">
            <ToggleGroupRoot
              :model-value="coursesMode"
              @update:model-value="
                (val) => {
                  if (val) coursesMode = val as 'lectures' | 'laboratories'
                  // changeSchedule()
                }
              "
              class="flex justify-center gap-1"
            >
              <ToggleGroupItem
                value="lectures"
                class="rounded-lg border-2 border-transparent px-2.5 py-0.5 transition active:translate-x-0.5 active:translate-y-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                >Clases</ToggleGroupItem
              >
              <ToggleGroupItem
                value="laboratories"
                class="rounded-lg border-2 border-transparent px-2.5 py-0.5 transition active:translate-x-0.5 active:translate-y-0.5 data-[state=on]:border-black data-[state=on]:bg-primary-500 data-[state=on]:font-medium data-[state=on]:text-white data-[state=on]:shadow-[1px_1px_0_0_rgba(0,0,0,1)]"
                >Laboratorios</ToggleGroupItem
              >
            </ToggleGroupRoot>
          </div>
          <div class="col-span-2 col-start-5">
            <CInputText
              v-model="search"
              placeholder="Buscar"
              prepend-icon="lucide:search"
              no-borders
            />
          </div>
        </div>

        <ClassScheduleV1
          v-if="classrooms && schedules && hours"
          :key="`${schedules}-${hours}`"
          :hours="hours"
          :classrooms="classrooms"
          :schedules="schedules"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import ArrowedCombobox from '~/components/schedule/ArrowedSelector.vue'
import DisplayModeSelector from '~/components/schedule/DisplayModeSelector.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

const selectedSchedules = ref<Hour[]>([])
const selectionSchedules = computed(() => {
  return selectedSchedules.value.length > 0
    ? JSON.stringify(selectedSchedules.value.map((schedule) => schedule.id))
    : undefined
})
const availableHours = ref<Hour[]>([])

const scheduleType = ref<'calendar' | 'classroom'>('classroom')
const coursesMode = ref<'lectures' | 'laboratories'>('lectures')

const { data: classrooms, status: classroomStatus } =
  useCustomLazyFetch<Array<Classroom>>(`/classrooms`)

const { data: schedules, status: scheduleStatus } = useCustomLazyFetch<
  Array<Course>
>(() => `/schedules/${coursesMode.value}`, {
  query: {
    selection: selectionSchedules
  }
})

const { data: hours, status: hourStatus } = useCustomLazyFetch<Array<Hour>>(
  () => `/hours`,
  {
    query: {
      selection: selectionSchedules
    }
  }
)

definePageMeta({
  layout: 'schedule'
})
const search = ref('')
await $api<Hour[]>('/hours').then((response) => {
  availableHours.value = response
})
</script>
<style scoped lang="scss"></style>
