<template>
  <section
    class="grid grid-cols-1 gap-4 transition-opacity duration-200 ease-in-out sm:grid-cols-2 xl:grid-cols-3"
    :class="{
      // 'pointer-events-none opacity-65': loading
    }"
  >
    <AltPensumsCard
      v-for="item in careerProgress?.progress.semester_progress"
      :key="item.id"
      :semester-progress="item"
      @update-item="$emit('updateItem', $event)"
    />
  </section>
</template>
<script setup lang="ts">
import type { ProgressResponse } from '~/lib/api/dashboard/career-progress';
import AltPensumsCard from './AltPensumsCard.vue'
const props = defineProps<{
  careerProgress: ProgressResponse
  loading: boolean
}>()
const emits = defineEmits(['updateItem'])
</script>
