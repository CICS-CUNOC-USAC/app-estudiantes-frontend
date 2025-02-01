<template>
  <div class="flex">
    <div class="h-[93vh] bg-cics-silver-pale dark:bg-neutral-900">
      <DisplayModeSelector
        :model-value="scheduleType"
        :classrooms="classrooms"
        :hours="availableHours || []"
        @update:selected-periods="
          (val: Hour[]) => {
            if (val) selectedSchedules = val as Hour[]
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
    <div class="mt-6 ml-6">
      <div class="grid grid-cols-1">
        <div class="mb-4 grid grid-cols-6">
          <div class="col-start-1">
            <ArrowedCombobox
              :options="[
                'Todas las Carreras',
                'Area Comun',
                ...availableCareers.map((value: Career) => value.name)
              ]"
              :default-value="'Todas las Carreras'"
              @update:selected-option="
                (val: string) => {
                  selectedCareer = val
                }
              "
            ></ArrowedCombobox>
          </div>
          <div class="col-span-2 col-start-3">
            <ToggleGroupRoot
              :model-value="coursesMode"
              @update:model-value="
                (val) => {
                  if (val) coursesMode = val as 'lectures' | 'laboratories'
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
              placeholder="Buscar un curso"
              prepend-icon="lucide:search"
              @update:model-value="
                (val: string) => {
                  searchScheduleCourse(val)
                }
              "
              no-borders
            />
          </div>
        </div>

        <ScrollAreaRoot>
          <ScrollAreaViewport class="max-h-[80vh]">
            <ClassScheduleV1
              v-if="classrooms && schedules && hours"
              :key="schedulesKey"
              :hours="hours"
              :classrooms="classrooms"
              :schedules="schedules"
            />
          </ScrollAreaViewport>
          <ScrollAreaScrollbar orientation="horizontal">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaScrollbar orientation="vertical">
            <ScrollAreaThumb />
          </ScrollAreaScrollbar>
          <ScrollAreaCorner />
        </ScrollAreaRoot>
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
import type { Career } from '~/utils/types/career-courses'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

const schedulesKey = computed(() => {
  return `${JSON.stringify(schedules.value)}${JSON.stringify(hours.value)}`
})

const selectedSchedules = ref<Hour[]>([])
const selectionSchedules = computed(() => {
  return selectedSchedules.value.length > 0
    ? JSON.stringify(selectedSchedules.value.map((schedule) => schedule.id))
    : undefined
})
const selectedCareer = ref<string>('Todas las Carreras')
const selectionCareer = computed(() => {
  if (selectedCareer.value === 'Todas las Carreras') {
    return undefined
  } else if (selectedCareer.value === 'Area Comun') {
    return 0
  } else {
    const career = availableCareers.value.find(
      (c) => c.name === selectedCareer.value
    )
    return career ? career.code : undefined
  }
})
const availableHours = ref<Hour[]>([])
const availableCareers = ref<Career[]>([])

const scheduleType = ref<'calendar' | 'classroom'>('classroom')
const coursesMode = ref<'lectures' | 'laboratories'>('lectures')

const { data: classrooms, status: classroomStatus } =
  useCustomLazyFetch<Array<Classroom>>(`/classrooms`)

const { data: schedules, status: scheduleStatus } = useCustomLazyFetch<
  Array<Course>
>(() => `/schedules/${coursesMode.value}`, {
  query: {
    selection: selectionSchedules,
    career: selectionCareer
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

function searchScheduleCourse(courseName: string) {
  const lowerCaseName = courseName.toLowerCase().trim()

  if (!schedules.value) {
    window.scrollTo(0, 0)
    return
  }

  const matchingCourses = schedules.value.filter((schedule) =>
    schedule.career_course.course.name.toLowerCase().includes(lowerCaseName)
  )

  if (!matchingCourses.length) {
    return
  }
  const firstMatch = matchingCourses[0]
  const courseTagId = `S${firstMatch.course_code}${firstMatch.section.name}`
  const element = document.getElementById(courseTagId)
  if (element) {
    console.log('scrolling')
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
    return
  } else {
    return
  }
}

definePageMeta({
  layout: 'schedule'
})
const search = ref('')
await $api<Hour[]>('/hours').then((response) => {
  availableHours.value = response
})
await $api<Career[]>('/careers').then((response) => {
  availableCareers.value = response
})
</script>
<style scoped lang="scss"></style>
