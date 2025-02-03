<template>
  <div class="flex items-center gap-2 rounded-md border bg-amber-50 px-3 py-2">
    <Icon name="icon-park-twotone:help" class="text-amber-600"/>
    <div class="">
      <h2 class="font-semibold" v-if="title">{{ title }}</h2>
      <p class="text-amber-600" v-if="subtitle">
        {{ subtitle }}
      </p>
      <CButton
      v-if="backToLabel && backToRoute"
        class="mt-2"
        :label="backToLabel"
        variant="link"
        icon="icon-park-outline:arrow-left"
        :to="backToRoute"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from '../primitives/button/CButton.vue';

defineProps<{
  title: string
  subtitle?: string
  backToLabel?: string
  backToRoute?: string
}>()
</script>
<style scoped>
</style>