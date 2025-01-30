<template>
  <div class="flex">
    <div class="">
      <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
        :hours="selectionHours || []"
        @update:selected-periods="
          (val: number[]) => {
            if (val) selectedSchedules = val as number[]
            changePeriods(val)
          }
        "
        @update:model-value="
          (val) => {
            if (val) scheduleType = val as 'calendar' | 'classroom'
          }
        "
      />
    </div>
    <div class="">
      <div
        class="grid grid-cols-1"
        v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
      >
        <div class="grid grid-cols-5">
          <div class="col-span-3 justify-self-center">
            <ToggleGroupRoot
              :model-value="coursesMode"
              @update:model-value="
                (val) => {
                  if (val) coursesMode = val as 'lectures' | 'laboratories'
                  changeSchedule()
                }
              "
              class="flex gap-1"
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
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'
import { ToggleGroupItem, ToggleGroupRoot } from 'radix-vue'
import DisplayModeSelector from '~/components/schedule/DisplayModeSelector.vue'

const schedules = ref<Array<Course>>([])
const loadingSchedules = ref(false)
const selectedSchedules = ref<number[]>([])
const selectionHours = ref<Hour[]>([])
const hours = ref<Hour[]>([])
const loadingHours = ref<boolean>(true)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

async function fetchSchedules(
  type: 'lectures' | 'laboratories',
  periods?: number[]
) {
  loadingSchedules.value = true
  try {
    const { data } = !periods
      ? await useCustomLazyFetch<Array<Course>>(`schedules/${type}`)
      : await useCustomLazyFetch<Array<Course>>(
          `schedules/${type}?selection=${JSON.stringify(periods)}`
        )
    schedules.value = data.value || []
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
  } finally {
    loadingSchedules.value = false
  }
}

async function fetchHours(periods?: number[]) {
  loadingHours.value = true
  try {
    const { data } = !periods
      ? await useCustomLazyFetch<Array<Hour>>(`hours`)
      : await useCustomLazyFetch<Array<Hour>>(
          `hours?selection=${JSON.stringify(periods)}`
        )
    hours.value = data.value || []
  } catch (error) {
    console.error('Error fetching hours:', error)
  } finally {
    loadingHours.value = false
  }
}

// Change Schedule Type
function changeSchedule() {
  fetchSchedules(coursesMode.value)
}

definePageMeta({
  layout: 'schedule'
})
const search = ref('')

const scheduleType = ref<'calendar' | 'classroom'>('classroom')
const coursesMode = ref<'lectures' | 'laboratories'>('lectures')

function changePeriods(periods: any[]) {
  const scheduleSelectedPeriods = periods
    .map((period) => JSON.parse(JSON.stringify(period)))
    .map((object) => object.id)

  if (scheduleSelectedPeriods.length > 0) {
    fetchHours(scheduleSelectedPeriods).then(() =>
      fetchSchedules(coursesMode.value, scheduleSelectedPeriods)
    )
  } else {
    fetchHours().then(() => fetchSchedules(coursesMode.value))
  }
}

fetchHours().then(() => {
  selectionHours.value = hours.value
  changeSchedule()
})
</script>
<style scoped lang="scss"></style>
