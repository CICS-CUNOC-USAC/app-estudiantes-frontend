<template>
  <div class="flex pt-14">
    <div
      class="bg-cics-silver-pale dark:bg-surface-800 hidden min-h-screen lg:block"
    >
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
            if (val) scheduleType = val as 'calendar' | 'classroom'
          }
        "
      />
    </div>
    <div class="dark:bg-surface-950/45 px-4 pt-4">
      <div class="grid grid-cols-1">
        <!-- <div class="mb-4 lg:flex lg:flex-row lg:justify-between sm:grid sm:grid-cols-2 flex flex-col items-center content-around"> -->
        <CMessage
          title="Aviso importante"
          subtitle="Esta versión de los horarios es de prueba (work in progress), por lo que puede contener errores. Si encuentras alguno, reportalo a través de la sección de contacto."
          class="mb-4"
          variant="warning"
          back-to-route="/portal/extras/about"
          back-to-label="Más información"
        />
        <div
          class="mb-4 flex flex-col items-center justify-between gap-2.5 lg:flex-row"
        >
          <!-- <div class="md:hidden">
            <HoursDialog
              :schedule-type="scheduleType"
              :classrooms="classrooms"
              :available-hours="availableHours"
              :selected-hours="selectedSchedules"
              @update:selected-periods="
                (val: Hour[]) => {
                  if (val) selectedSchedules = val as Hour[]
                }
              "
              @update:model-value="
                (val: 'calendar' | 'classroom') => {
                  if (val) scheduleType = val as 'calendar' | 'classroom'
                }
              "
            >
            </HoursDialog>
          </div> -->
          <div class="flex gap-2.5">
            <HoursDialog
              :schedule-type="scheduleType"
              :classrooms="classrooms"
              :available-hours="availableHours"
              :selected-hours="selectedSchedules"
              @update:selected-periods="
                (val: Hour[]) => {
                  if (val) selectedSchedules = val as Hour[]
                }
              "
              @update:model-value="
                (val: 'calendar' | 'classroom') => {
                  if (val) scheduleType = val as 'calendar' | 'classroom'
                }
              "
            >
            </HoursDialog>
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
          <div class="">
            <ToggleGroup
              :model-value="coursesMode"
              @update:model-value="
                (val) => {
                  if (val) coursesMode = val as 'lectures' | 'laboratories'
                }
              "
            >
              <ToggleGroupItem value="lectures"> Clases</ToggleGroupItem>
              <ToggleGroupItem value="laboratories">
                Laboratorios</ToggleGroupItem
              >
            </ToggleGroup>
          </div>
          <div class="flex w-full gap-1.5 lg:w-auto">
            <div class="w-full flex-1 lg:w-auto lg:flex-initial">
              <CInputText
                class="h-10!"
                v-model="search"
                placeholder="Buscar un curso"
                prepend-icon="icon-park-twotone:search"
                @update:model-value="
                  (val: string) => {
                    searchScheduleCourse(val)
                  }
                "
                no-borders
                @keypress.enter="focusNextCourse"
                @keyup="(e: any) => keyPressed(e.keyCode)"
                ref="searchInput"
              />
            </div>

            <Button
              class="search-button rounded-l-lg"
              @click="focusPrevCourse"
              variant="text"
            >
              <Icon class="shrink-0" icon="radix-icons:chevron-left" />
            </Button>
            <Button
              class="search-button rounded-r-lg"
              @click="focusNextCourse"
              variant="text"
            >
              <Icon class="shrink-0" icon="radix-icons:chevron-right" />
            </Button>
          </div>
        </div>

        <ScrollArea ref="scrollerSchedules" class="max-h-[80vh]">
          <ClassScheduleV1
            v-if="classrooms && schedules && hours"
            :key="schedulesKey"
            :hours="hours"
            :classrooms="classrooms"
            :schedules="schedules"
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToggleGroupItem, ToggleGroup } from '~/components/ui/toggle-group'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import CInputText from '~/components/primitives/form/CInputText.vue'
import ArrowedCombobox from '~/components/schedule/ArrowedSelector.vue'
import DisplayModeSelector from '~/components/schedule/DisplayModeSelector.vue'
import HoursDialog from '~/components/schedule/HoursDIalog.vue'
import { Icon } from '@iconify/vue'
import CMessage from '~/components/partials/CMessage.vue'
import type { Career } from '~/utils/types/career-courses'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'
import { Button } from '~/components/ui/button'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'

const schedulesKey = computed(() => {
  return `${JSON.stringify(schedules.value)}${JSON.stringify(hours.value)}`
})

const scrollerSchedules = ref()
const searchInput = ref()

const foundCourses = ref<Course[]>([])
const focusedCourseIndex = ref<number | undefined>(0)

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
  resetClassesSchedule()
  const lowerCaseName = courseName.toLowerCase().trim()

  if (courseName === '') {
    focusedCourseIndex.value = undefined
    scrollerSchedules.value.scrollTopLeft()
    return
  }

  if (!schedules.value) {
    focusedCourseIndex.value = undefined
    scrollerSchedules.value.scrollTopLeft()
    return
  }

  foundCourses.value = schedules.value.filter((schedule) =>
    schedule.career_course.course.name.toLowerCase().includes(lowerCaseName)
  )

  if (!foundCourses.value.length) {
    focusedCourseIndex.value = undefined
    scrollerSchedules.value.scrollTopLeft()
    return
  }

  highlightFoundCourses()

  const firstMatch = foundCourses.value[0]
  const courseTagId = `S${firstMatch.course_code}${firstMatch.section.name}`
  const element = document.getElementById(courseTagId)
  if (element) {
    focusedCourseIndex.value = 0
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
    return
  } else {
    focusedCourseIndex.value = undefined
    return
  }
}

function focusNextCourse() {
  if (focusedCourseIndex.value === undefined) {
    return
  }

  if (focusedCourseIndex.value === foundCourses.value.length - 1) {
    focusedCourseIndex.value = 0

    const match = foundCourses.value[0]
    const courseTagId = `S${match.course_code}${match.section.name}`
    const element = document.getElementById(courseTagId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  } else {
    focusedCourseIndex.value++

    const match = foundCourses.value[focusedCourseIndex.value]
    const courseTagId = `S${match.course_code}${match.section.name}`
    const element = document.getElementById(courseTagId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }
}

function focusPrevCourse() {
  if (focusedCourseIndex.value === undefined) {
    return
  }

  if (focusedCourseIndex.value === 0) {
    focusedCourseIndex.value = foundCourses.value.length - 1

    const match = foundCourses.value[focusedCourseIndex.value]
    const courseTagId = `S${match.course_code}${match.section.name}`
    const element = document.getElementById(courseTagId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  } else {
    focusedCourseIndex.value--

    const match = foundCourses.value[focusedCourseIndex.value]
    const courseTagId = `S${match.course_code}${match.section.name}`
    const element = document.getElementById(courseTagId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }
}

function keyPressed(keyCode: number) {
  switch (keyCode) {
    case 27: //Escape
      cancelSearch()
      break
    default:
      break
  }
}

function cancelSearch() {
  foundCourses.value = []
  focusedCourseIndex.value = undefined
  scrollerSchedules.value.scrollTopLeft()
  search.value = ''
  resetClassesSchedule()
  searchInput.value.$el.querySelector('input').blur()
}

function resetClassesSchedule() {
  const layoutParent = document.getElementById('ScheduleLayoutMain')
  const gridItems = layoutParent?.querySelectorAll('.ScheduleCourseCard')
  gridItems!.forEach((item) => {
    item.classList.remove('ring-4', 'ring-secondary-400')
  })
}

function highlightFoundCourses() {
  foundCourses.value.forEach((course) => {
    const courseTagId = `S${course.course_code}${course.section.name}`
    const element = document.getElementById(courseTagId)
    if (element) {
      element.classList.add('ring-4', 'ring-primary-400')
    }
  })
}

definePageMeta({
  layout: 'default',
  extendScreen: true,
  menuClass: 'bg-cics-silver-pale dark:bg-transparent',
  title: 'Horarios'
})
const search = ref('')
await $api<Hour[]>('/hours').then((response) => {
  availableHours.value = response
})
await $api<Career[]>('/careers').then((response) => {
  availableCareers.value = response
})
</script>
<style scoped>
@reference '~/assets/css/main.css';

.highlighted-course {
  @apply ring-primary-400 ring-4;
}

.search-button {
  @apply focus-visible:ring-primary-500 text-muted-foreground focus:bg-surface-50/20 dark:focus:bg-surface-600/40 dark:bg-surface-800 inline-flex min-w-6 cursor-pointer items-center justify-center border border-black bg-transparent text-sm font-semibold transition duration-75 ease-out select-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0.5 active:translate-y-0.5 active:shadow-none;
}
</style>
