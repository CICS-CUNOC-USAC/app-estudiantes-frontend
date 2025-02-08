<template>
  <DialogRoot v-model:open="dialog">
    <DialogTrigger
      class="cursor-pointer text-left text-sm hover:underline hover:underline-offset-2 focus:underline focus:outline-none"
    >
      {{ courseName }}
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-gray-950/50 transition-all duration-500"
      />
      <DialogContent
        class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100] h-full max-h-[85vh] w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 p-6 pb-46 shadow-lg shadow-black/15 focus:outline-none lg:max-w-xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <DialogTitle class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">Información del curso</h2>
          <DialogClose
            class="dark:focus:outline-surface-600 focus:outline-surface-200 cursor-pointer rounded p-1.5 outline-offset-2 hover:bg-neutral-200 focus:outline dark:hover:bg-neutral-800"
          >
            <Icon name="lucide:x" />
            <span class="sr-only">Close</span>
          </DialogClose>
        </DialogTitle>

        <div class="mb-4 h-full pb-6" v-if="data?.response">
          <header class="pb-2">
            <h2 class=" ">
              <span class="text-muted-color  font-semibold text-sm"
                >Nombre del curso:</span
              >
              <strong class="block text-primary-600 dark:text-primary-200">{{ courseName }}</strong>
            </h2>
            <p class="">
              <span class="text-muted-color font-semibold text-sm"
                >Código del curso:</span
              >
              <strong class="block">{{ courseCode }}</strong>
            </p>
          </header>
          <h3 class="text-muted-color font-semibold pb-1.5 text-sm">Descripción:</h3>
          <div class="h-full overflow-scroll text-sm prose dark:prose-invert">
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
    </DialogPortal>
  </DialogRoot>
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

const { data, status } = await useLazyAsyncData(
  () => fetchCareerCourse(courseCode, careerCode),
  {
    immediate: false,
    watch: [dialog]
  }
)
</script>
