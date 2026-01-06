<template>
  <CCardAlt
    unstyled
    no-spacing
    class="sticky top-16 z-20 mb-4 text-center lg:top-4"
    :class="{
      'shadow-lg dark:shadow-xl': hasScrolled
    }"
  >
    <template #content>
      <div
        class="absolute bottom-0 left-0 right-0 text-sm top-0 z-10 flex items-center justify-center bg-black/50 text-white"
        v-if="loading"
      >
        Guardando...
      </div>
      <section class="relative flex justify-center py-4 sm:gap-x-4 lg:gap-x-10">
        <div>
          <h6 class="pensum-count">Créditos acumulados:</h6>
          <strong class="text-muted-color-emphasis">{{
            careerProgress?.current_credits.total_credits
          }}</strong>
        </div>
        <div>
          <h6 class="pensum-count">
            Créditos obligatorios:
          </h6>
          <strong class="text-muted-color-emphasis">{{
            careerProgress?.current_credits.mandatory_credits
          }}</strong>
          /
          <span class="text-muted-color-emphasis">
            {{ careerProgress?.mandatory_credits }}</span
          >
        </div>
        <div>
          <h6 class="pensum-count">
            Créditos optativos:
          </h6>
          <strong class="text-muted-color-emphasis">{{
            careerProgress?.current_credits.not_mandatory_credits
          }}</strong>
          /
          <span class="text-muted-color-emphasis">
            {{ careerProgress?.not_mandatory_credits }}</span
          >
        </div>
        <div>
          <h6 class="pensum-count">
            Créditos disponibles:
          </h6>
          <strong class="text-muted-color-emphasis">{{
            careerProgress?.current_credits.total_credits
          }}</strong>
          /
          <span class="text-muted-color-emphasis">
            {{ careerProgress?.available_credits }}
          </span>
        </div>
      </section>
    </template>
  </CCardAlt>
</template>
<script setup lang="ts">
import type { ProgressResponse } from '~/lib/api/dashboard/career-progress';
import CCardAlt from '../primitives/card/CCardAlt.vue'

defineProps<{
  careerProgress: ProgressResponse
  loading: boolean
}>()

const hasScrolled = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 50
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {
    hasScrolled.value = window.scrollY > 50
  })
})
</script>
<style>
@reference '~/assets/css/main.css';
.pensum-count {
  @apply font-normal text-sm lg:text-base;
}
</style>
