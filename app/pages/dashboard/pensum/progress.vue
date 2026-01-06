<template>
  <main>
    <h1 class="pb-3 text-xl font-semibold">
      <Icon
        name="icon-park-twotone:up-and-down"
        class="mr-1.5 mb-1 inline-block"
      />
      Progreso de carrera
    </h1>
    <PensumProgressDetails
      v-if="data"
      :career-progress="data"
      :loading="pending"
    />
    <PensumProgressView
      v-if="data"
      :career-progress="data"
      :loading="pending"
      @update-item="handleUpdateItem($event)"
    />
  </main>
</template>

<script setup lang="ts">
import { type FetchError } from 'ofetch'
import { toast } from 'vue-sonner'
import PensumProgressDetails from '~/components/progress/PensumProgressDetails.vue'
import PensumProgressView from '~/components/progress/PensumProgressView.vue'
import {
  careerProgressApi,
  type UpdateCareerItemPayload
} from '~/lib/api/dashboard/career-progress'

definePageMeta({
  layout: 'dashboard'
})

const { data, pending, refresh } = await useAsyncData(
  'fetchCareerProgress',
  () => careerProgressApi.fetchProgress()
)

const { mutate: handleUpdateItem } = useMutation({
  mutation: (payload: UpdateCareerItemPayload) =>
    careerProgressApi.updateCareerItem(payload),
  onSuccess: () => {
    refresh()
  },
  onError: (error: FetchError) => {
    toast.error(
      `Error al actualizar el curso: ${error.data.message ?? 'Error desconocido'}`
    )
  }
})
</script>
