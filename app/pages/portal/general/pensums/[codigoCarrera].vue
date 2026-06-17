<template>
  <main>
    <nav class="space-x-4">
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/general/pensums"
      />
    </nav>
    <h1 class="mt-4 mb-8 text-xl font-semibold">
      <template v-if="pensumStatus === 'pending' || coursesStatus === 'pending'">
        <Skeleton height="1.7rem" width="28rem"></Skeleton>
      </template>
      <template v-if="pensumCourses && coursesStatus === 'success'">
        <Icon
          name="icon-park-twotone:s-turn-left"
          class="mr-1.5 mb-1 inline-block"
        />
        <span class="font-weight-light">Carrera:</span>
        {{ pensumCourses?.career_name }} -
        <span>
          {{ pensumCourses?.career_code }}
        </span>
        <span class="text-muted-color ml-2 text-base font-normal">
          (Pensum {{ pensumCourses?.pensum_year }})
        </span>
      </template>
    </h1>
    <PensumPublicView
      :pensum-semesters="pensumCourses?.courses"
      :loading="coursesStatus === 'pending'"
    />
    <HelpDialog title="Pensum de carrera" content-path="/help/pensums"></HelpDialog>
    <ElementNotFound
      title="Pensum no encontrado"
      subtitle="Parece que el pensum de la carrera que buscas no existe, verifica que el código de carrera sea correcto."
      backToRoute="/portal/general/pensums"
      backToLabel="Regresar a pensums"
      v-if="coursesStatus === 'error' && coursesError?.statusCode === 404"
    />
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
import Button from '~/components/ui/button/Button.vue'
import { Skeleton } from '~/components/ui/skeleton'
import type { Pensum, PensumCoursesResponse } from '~/utils/types/pensum-courses'

const route = useRoute()

const {
  data: pensums,
  status: pensumStatus,
} = await useCustomFetch<Pensum[]>(
  `/pensums?career_code=${route.params.codigoCarrera}`
)

const activePensum = computed(() =>
  pensums.value?.find((p) => p.active) ?? pensums.value?.[0]
)

const {
  data: pensumCourses,
  status: coursesStatus,
  error: coursesError,
} = await useCustomFetch<PensumCoursesResponse>(
  computed(() =>
    activePensum.value
      ? `/pensums/${activePensum.value.id}/courses`
      : ''
  ),
  { watch: [activePensum] }
)

useCustomPageTitle(
  pensumCourses?.value?.career_name
    ? `Pensum - ${pensumCourses?.value?.career_name}`
    : 'Pensum de carrera'
)
definePageMeta({
  title: 'Pensum de carrera'
})
</script>
