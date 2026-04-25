<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { NuxtLink } from "#components"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  to?: string
}>()
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    data-slot="card"
    :class="
      cn(
        'border  border-surface-950/75 dark:border-surface-700/50 bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </component>
</template>
