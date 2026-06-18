<template>
  <main class="pb-8">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/admin/pensums"
      />
    </nav>

    <header>
      <h1 class="mt-4 mb-1 text-xl font-semibold">
        <template v-if="status === 'pending'">
          <Skeleton height="1.7rem" width="28rem" />
        </template>
        <template v-if="pensumData && status === 'success'">
          <Icon
            name="icon-park-twotone:notebook-one"
            class="mr-1.5 mb-1 inline-block"
          />
          <span class="font-normal">Carrera:</span>
          {{ pensumData.career_name }} — {{ pensumData.career_code }}
          <span class="text-muted-color ml-2 text-base font-normal">
            (Pensum {{ pensumData.pensum_year }})
          </span>
        </template>
      </h1>
    </header>

    <div class="mt-4 flex gap-2">
      <AdminAddCourseDialog
        :pensum-id="Number(params.pensumId)"
        @added="refresh()"
      >
        <Button
          label="Agregar curso"
          icon="icon-park-outline:plus"
          class="w-fit"
        />
      </AdminAddCourseDialog>
      <AdminFieldsDialog :pensum-id="Number(params.pensumId)">
        <Button
          label="Areas"
          icon="icon-park-twotone:category-management"
          severity="secondary"
          class="w-fit"
        />
      </AdminFieldsDialog>
    </div>

    <template v-if="status === 'pending'">
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton v-for="i in 4" :key="i" height="500px" width="100%" />
      </div>
    </template>

    <div
      v-else-if="pensumData?.courses?.length"
      class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AdminSemesterCard
        v-for="semester in pensumData.courses"
        :key="semester.semester"
        :semester-courses="semester"
        :pensum-id="Number(params.pensumId)"
        :pensum-courses-list="allCoursesList"
        @updated="refresh()"
      />
    </div>

    <div
      v-else-if="status === 'success'"
      class="text-muted-foreground mt-8 flex flex-col items-center gap-2 py-12 text-center"
    >
      <Icon name="icon-park-twotone:folder-open" size="40" class="opacity-40" />
      <p>No se encontraron cursos para este pensum.</p>
    </div>

    <ElementNotFound
      v-if="status === 'error'"
      element-type="pensum"
      backToLabel="Regresar a la lista de pensums"
      backToRoute="/admin/pensums"
      class="mt-4"
    />
  </main>
</template>
<script setup lang="ts">
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import AdminSemesterCard from '~/components/admin/pensums/AdminSemesterCard.vue'
import AdminAddCourseDialog from '~/components/dialogs/courses/AdminAddCourseDialog.vue'
import AdminFieldsDialog from '~/components/dialogs/courses/AdminFieldsDialog.vue'
import Button from '~/components/ui/button/Button.vue'
import { Skeleton } from '~/components/ui/skeleton'
import { fetchPensumCourses } from '~/lib/api/admin/pensums'

const { params } = useRoute()

const {
  data: response,
  status,
  refresh
} = await useAsyncData(
  `pensum-courses-${params.pensumId}`,
  () => fetchPensumCourses(Number(params.pensumId))
)

const pensumData = computed(() => response.value?.result)

type PensumCourseOption = { code: string; name: string }

const allCoursesList = computed<PensumCourseOption[]>(() => {
  if (!pensumData.value?.courses) return []
  return pensumData.value.courses.flatMap(s =>
    s.courses.map(c => ({ code: c.course_code, name: c.course.name, semester: c.semester }))
  )
})

definePageMeta({
  layout: 'admin',
  subject: ['Pensum', 'all'],
  action: ['manage']
})
</script>
<style scoped></style>
