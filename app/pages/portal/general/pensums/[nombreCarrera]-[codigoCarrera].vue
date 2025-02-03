<template>
  <main>
    <nav class="space-x-4">
      <CButton
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar a pensums"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/portal/general/pensums"
      />
    </nav>
    <h1 class="mb-8 mt-4 text-xl font-semibold">
      <template v-if="status === 'pending'">
        <PSkeleton height="1.7rem"  width="28rem"></PSkeleton>
      </template>
      <template v-if="careerCourses && status === 'success'">
        <Icon
          name="icon-park-twotone:s-turn-left"
          class="mb-1 mr-1.5 inline-block"
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
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue';
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import type { CareerCoursesResponse } from '~/utils/types/career-courses'

const route = useRoute()
const { data: careerCourses, pending: loading, status } =
  useCustomFetch<CareerCoursesResponse>(
    `/career-courses/${route.params.codigoCarrera}`
  )
</script>


