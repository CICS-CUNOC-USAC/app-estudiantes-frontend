<template>
  <main style="position: relative">
    <v-btn
      icon="mdi-help"
      variant="elevated"
      position="fixed"
      location="bottom right"
      class="ma-10"
      style="z-index: 10"
    >
    </v-btn>
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
