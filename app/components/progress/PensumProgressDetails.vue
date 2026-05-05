<template>
  <CCardAlt
    class="mb-4 relative overflow-hidden"
    :class="{
      'shadow-lg dark:shadow-xl': hasScrolled
    }"
    title="Resumen de créditos"
  >
    <template #content>
      <section class="relative transition grid grid-cols-2 gap-0 md:grid-cols-3 lg:grid-cols-4"
      :class="{
        'pointer-events-none opacity-50': loading
      }"
      >
        <div>
          <h6 class="pensum-count">Acumulados:</h6>
          <strong class="text-muted-color-emphasis">{{
            careerProgress?.current_credits.total_credits
          }}</strong>
        </div>
        <div>
          <h6 class="pensum-count">
            Obligatorios:
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
            Optativos:
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
            Disponibles:
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
