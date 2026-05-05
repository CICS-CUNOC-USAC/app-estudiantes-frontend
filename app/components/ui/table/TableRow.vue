<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('hover:bg-card/90 data-[state=selected]:bg-muted border-b transition-colors border-surface-950/75 dark:border-surface-700/50', props.class)"
  >
    <slot />
  </tr>
</template>
