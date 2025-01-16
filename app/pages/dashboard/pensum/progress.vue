<template>
  <main>
    <h1 class="pb-3 text-xl font-semibold">
      <Icon name="icon-park-twotone:up-and-down" class="mb-1 mr-1.5 inline-block" />
      Progreso de carrera
    </h1>
    <PensumProgressDetails
      :career-progress="coursesProgress"
      :loading="loading"
    />
    <PensumProgressView
      :career-progress="coursesProgress"
      :loading="loading"
      @update-item="updateItem"
    />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import PensumProgressDetails from '~/components/progress/PensumProgressDetails.vue'
import PensumProgressView from '~/components/progress/PensumProgressView.vue'

definePageMeta({
  layout: 'dashboard'
})
const careerProgressStore = useCareerProgressStoreC()
const { loading, coursesProgress } = storeToRefs(careerProgressStore)
const { fetchProgress, updateItem } = careerProgressStore
await fetchProgress()
</script>
