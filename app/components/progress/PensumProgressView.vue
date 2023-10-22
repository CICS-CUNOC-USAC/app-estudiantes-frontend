<template>
  <v-row class="mt-6">
    <v-col
      v-for="item in careerProgress?.progress.semester_progress"
      :key="item.id"
      cols="12"
      sm="6"
      lg="4"
    >
      <PensumsCard
        :semester-progress="item"
        @update-item="$emit('updateItem', $event)"
      />
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import PensumsCard from './PensumsCard.vue'
const props = defineProps<{
  careerProgress: ProgressResponse | null
  loading: boolean
}>()
const emits = defineEmits(['updateItem'])
</script>
<style lang="scss" scoped></style>
