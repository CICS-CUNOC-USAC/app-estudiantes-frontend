<template>
  <!-- <v-row class="mt-6">
    <v-col
      v-for="item in careerProgress?.progress.semester_progress"
      :key="item.id"
      cols="12"
      sm="6"
      lg="4"
    > -->
  <!-- <PensumsCard
        :semester-progress="item"
        @update-item="$emit('updateItem', $event)"
      /> -->
  <section
    class="grid grid-cols-1 gap-4 transition-opacity duration-200 ease-in-out sm:grid-cols-2 lg:grid-cols-3"
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
  <!-- </v-col>
  </v-row> -->
</template>
<script setup lang="ts">
import AltPensumsCard from './AltPensumsCard.vue'
import PensumsCard from './PensumsCard.vue'
const props = defineProps<{
  careerProgress: ProgressResponse | null
  loading: boolean
}>()
const emits = defineEmits(['updateItem'])
</script>
<style lang="scss" scoped></style>
