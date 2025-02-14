<template>
  <div
    class="flex items-center gap-2 rounded-md border bg-amber-50 px-3 py-2 dark:border-neutral-500 dark:bg-neutral-800"
  >
    <Icon
      name="icon-park-twotone:help"
      class="text-amber-600 dark:text-amber-400"
    />
    <div class="">
      <h2 class="font-semibold dark:text-amber-100" v-if="title">
        {{ title }}
      </h2>
      <p class="text-amber-600 dark:text-amber-400" v-if="subtitle">
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
import CButton from '../primitives/button/CButton.vue'

defineProps<{
  title: string
  subtitle?: string
  backToLabel?: string
  backToRoute?: string
}>()
</script>
<style scoped></style>
