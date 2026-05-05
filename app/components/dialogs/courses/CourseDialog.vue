<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger
      class="cursor-pointer text-left text-sm hover:underline hover:underline-offset-2 focus:underline focus:outline-none"
    >
      {{ courseName }}
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle> Información del curso </DialogTitle>
      </DialogHeader>

      <div class="" v-if="data?.response">
        <header class="pb-2">
          <h2 class=" ">
            <span class="text-muted-color text-sm font-semibold"
              >Nombre del curso:</span
            >
            <strong class="text-primary-600 dark:text-primary-200 block">{{
              courseName
            }}</strong>
          </h2>
          <p class="">
            <span class="text-muted-color text-sm font-semibold"
              >Código del curso:</span
            >
            <strong class="block">{{ courseCode }}</strong>
          </p>
        </header>
        <h3 class="text-muted-color pb-1.5 text-sm font-semibold">
          Descripción:
        </h3>
        <div class="leading-snug font-light">
          <p class="">
            {{
              data.response?.course.description ||
              'No hay descripción para este curso'
            }}
          </p>
        </div>
      </div>
      <div class="text-center" v-else-if="status === 'pending'">
        <Icon name="svg-spinners:bars-rotate-fade" class="mx-auto mb-2" />
        <p>Cargando información...</p>
      </div>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'

const { courseCode, careerCode } = defineProps<{
  field: number
  courseCode: string
  courseName: string
  mandatory: boolean
  careerCode: number
}>()

const { fetchCareerCourse } = useCoursesStore()
const dialog = ref(false)

const { data, status, refresh } = await useLazyAsyncData(
  `course-dialog-${courseCode}-${careerCode}`,
  () => {
    return fetchCareerCourse(courseCode, careerCode)
  },
  {
    immediate: false
  }
)
watch(dialog, (newVal) => {
  if (newVal) {
    refresh()
  }
})
</script>
