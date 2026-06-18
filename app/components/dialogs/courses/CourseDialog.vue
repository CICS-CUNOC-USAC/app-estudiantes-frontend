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

        <div v-if="prerequisites.length" class="mt-4">
          <h3 class="text-muted-color pb-1.5 text-sm font-semibold">
            Prerequisitos:
          </h3>
          <ul class="space-y-1.5">
            <li
              v-for="prereq in prerequisites"
              :key="prereq.id"
              class="text-sm"
            >
              <template v-if="prereq.is_course">
                <div
                  v-for="entry in prereq.coursePrerequisites"
                  :key="entry.id"
                  class="flex items-center gap-2"
                >
                  <Icon name="icon-park-twotone:book-open" size="14" class="text-primary-500 shrink-0" />
                  <span>
                    <span class="font-medium">{{ entry.course.code }}</span>
                    — {{ entry.course.name }}
                  </span>
                </div>
              </template>
              <template v-else>
                <div
                  v-for="entry in prereq.creditsPrerequisites"
                  :key="entry.id"
                  class="flex items-center gap-2"
                >
                  <Icon name="icon-park-twotone:degree-hat" size="14" class="text-primary-500 shrink-0" />
                  <span>Minimo <span class="font-medium">{{ entry.credits }}</span> creditos aprobados</span>
                </div>
              </template>
            </li>
          </ul>
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

import type { Prerequisite } from '~/lib/api/admin/prerequisites'

const { courseCode, pensumId } = defineProps<{
  field: number
  courseCode: string
  courseName: string
  mandatory: boolean
  pensumId: number
  prerequisites: Prerequisite[]
}>()

const { fetchPensumCourse } = useCoursesStore()
const dialog = ref(false)

const { data, status, refresh } = await useLazyAsyncData(
  `course-dialog-${courseCode}-${pensumId}`,
  () => {
    return fetchPensumCourse(courseCode, pensumId)
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
