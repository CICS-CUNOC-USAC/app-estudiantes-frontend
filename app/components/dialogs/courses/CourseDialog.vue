<template>
  <CDialog v-model:open="dialog">
    <CDialogTrigger
      class="text-left text-sm hover:underline hover:underline-offset-2 focus:underline focus:outline-none"
    >
      {{ courseName }}
    </CDialogTrigger>
    <CDialogContent title="Detalles del curso">
      <div class="course-details" v-if="data?.response">
        <header class="course-header">
          <h2 class="text-lg font-bold">{{ courseName }}</h2>
          <p class="">{{ courseCode }}</p>
        </header>
        <div class="course-career">
          <p class="">{{ data.response.career_code }}</p>
        </div>
        <div class="course-description">
          <p class="">
            {{
              data.response?.course.description ||
              'No hay descripción para este curso'
            }}
          </p>
        </div>
        <div class="course-hours">
          <p class="">Horas: 4</p>
        </div>
        <div class="course-room">
          <p class="">Salón: 123</p>
        </div>
        <CButton label="Ver penusm" variant="text" class="course-button" />
        <CButton
          label="Ver en biblioteca"
          variant="text"
          class="course-button-s"
        />
      </div>
    </CDialogContent>
  </CDialog>
</template>
<script setup lang="ts">
import CButton from '~/components/primitives/button/CButton.vue'
import {
  CDialog,
  CDialogContent,
  CDialogTrigger
} from '~/components/primitives/dialog'

const { courseCode, careerCode } = defineProps<{
  field: number
  courseCode: string
  courseName: string
  mandatory: boolean
  careerCode: number
}>()

const { fetchCareerCourse } = useCoursesStore()
const dialog = ref(false)

const { data } = await useLazyAsyncData(
  () => fetchCareerCourse(courseCode, careerCode),
  {
    immediate: false,
    watch: [dialog]
  }
)
</script>
<style lang="postcss" scoped>
.course-details {
  grid-template-areas:
    'name name career'
    'desc desc hours'
    'desc desc hours'
    'desc desc room'
    'btn btn-s room';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  @apply grid h-52 w-full gap-4;
}

.course-header {
  grid-area: name;
}

.course-career {
  grid-area: career;
}

.course-description {
  grid-area: desc;
}

.course-hours {
  grid-area: hours;
}

.course-room {
  grid-area: room;
}

.course-button {
  grid-area: btn;
}
.course-button-s {
  grid-area: btn-s;
}
</style>
