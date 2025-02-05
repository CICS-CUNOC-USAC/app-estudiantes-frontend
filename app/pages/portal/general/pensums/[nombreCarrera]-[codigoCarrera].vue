<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="text-muted-color-emphasis mb-4 lg:mb-2"
        to="/portal/general/pensums"
      />
    </nav>
    <h1 class="mt-4 mb-8 text-xl font-semibold">
      <template v-if="status === 'pending'">
        <PSkeleton height="1.7rem" width="28rem"></PSkeleton>
      </template>
      <template v-if="careerCourses && status === 'success'">
        <Icon
          name="icon-park-twotone:s-turn-left"
          class="mr-1.5 mb-1 inline-block"
        />
        <span class="font-weight-light">Carrera:</span>
        {{ careerCourses?.career_name }} -
        <span>
          {{ careerCourses?.career_code }}
        </span>
      </template>
    </h1>
    <PensumPublicView
      :career-courses="careerCourses?.courses"
      :loading="status === 'pending'"
    />
    <HelpDialog title="Pensum de carrera" content-path="/pensums"></HelpDialog>
    <ElementNotFound
      title="Pensum no encontrado"
      subtitle="Parece que el pensum de la carrera que buscas no existe, verifica que el código de carrera sea correcto."
      backToRoute="/portal/general/pensums"
      backToLabel="Regresar a pensums"
      v-if="status === 'error' && error?.statusCode === 404"
    />
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
import ElementNotFound from '~/components/partials/ElementNotFound.vue'
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import type { CareerCoursesResponse } from '~/utils/types/career-courses'

const route = useRoute()
const {
  data: careerCourses,
  status,
  error
} = await useCustomFetch<CareerCoursesResponse>(
  `/career-courses/${route.params.codigoCarrera}`
)

useCustomPageTitle(
  careerCourses?.value?.career_name
    ? `Pensum - ${careerCourses?.value?.career_name}`
    : 'Pensum de carrera'
)
definePageMeta({
  title: 'Pensum de carrera'
})
</script>
