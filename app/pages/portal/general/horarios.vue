<template>
    <div class="flex">
      <div class="">

        <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
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
                    if (val) coursesMode = val as string
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

const { data: hours, pending: loadingHours } =
  useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

async function fetchCourses() {
  loadingSchedules.value = true
  try {
    const { data } =
      await useCustomLazyFetch<Array<Course>>(`schedules/courses`)
    schedules.value = data.value || []
  } catch (error) {
    console.error('Error fetching courses:', error)
  } finally {
    loadingSchedules.value = false
  }
}

async function fetchLaboratories() {
  loadingSchedules.value = true
  try {
    const { data } = await useCustomLazyFetch<Array<Course>>(
      `schedules/laboratories`
    )
    schedules.value = data.value || []
  } catch (error) {
    console.error('Error fetching laboratories:', error)
  } finally {
    loadingSchedules.value = false
  }
}

// Change Schedule Type
function changeSchedule() {
  console.log('cambio', coursesMode.value)
  if (coursesMode.value === 'lectures') {
    fetchCourses()
  } else if (coursesMode.value === 'laboratories') {
    fetchLaboratories()
  }
}

definePageMeta({
  layout: 'schedule'
})
const search = ref('')

const scheduleType = ref<'calendar' | 'classroom'>('calendar')
const coursesMode = ref('lectures')
changeSchedule()
</script>
<style scoped lang="scss"></style>
