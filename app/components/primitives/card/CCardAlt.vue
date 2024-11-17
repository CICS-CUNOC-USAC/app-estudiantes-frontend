<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to
    unstyled
    class="flex h-full flex-col overflow-hidden rounded-xl border border-surface-950/75 bg-surface-50 p-5 !text-primary duration-300 ease-in-out dark:bg-surface-800"
    :class="{
      'p-0': noSpacing,
      'hover:translate-x-0 hover:translate-y-0 hover:bg-surface-100 hover:shadow-none dark:hover:bg-surface-900':
        interactive,
      'cursor-pointer': to,
      '-translate-x-0.5 -translate-y-0.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)]':
        elevated || interactive
    }"
  >
    <slot name="title">
      <h3
        class="mb-2 text-lg font-semibold transition-colors duration-300 ease-in-out"
      >
        {{ title }}
      </h3>
    </slot>
    <slot name="content">
      <p class="mb-4 flex-1">
        {{ description }}
      </p>
      <span class="block pb-4 text-xs tracking-tight">
        <Icon v-if="smallIcon" :name="smallIcon" class="mr-1 inline-block !text-sm" />
        {{ small }}
      </span>
    </slot>
    <slot name="footer">
    </slot>
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
defineProps<{
  elevated?: boolean
  interactive?: boolean
  title?: string
  description?: string
  to?: string
  small?: string
  smallIcon?: string
  noSpacing?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
