<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <thead
    data-slot="table-header"
    :class="cn('[&_tr]:border-b [&_tr]:border-surface-950/75 dark:[&_tr]:border-surface-700/50', props.class)"
  >
    <slot />
  </thead>
</template>
