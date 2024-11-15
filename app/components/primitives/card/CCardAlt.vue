<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to
    unstyled
    class="flex h-full flex-col overflow-hidden rounded-xl border border-surface-950/45 bg-surface-50 p-5 duration-300 ease-in-out"
    :class="{
      'p-0': noSpacing,
      'hover:translate-x-0 hover:translate-y-0 hover:bg-surface-100 hover:shadow-none':
        interactive,
      'cursor-pointer': to,
      '-translate-x-0.5 -translate-y-0.5 shadow-[2px_3px_0_0_var(--p-surface-800)]':
        elevated || interactive
    }"
  >
    <!-- <template #title> -->
    <slot name="title">
      <h3
        class="mb-2 text-lg font-semibold transition-colors duration-300 ease-in-out"
      >
        {{ title }}
      </h3>
    </slot>
    <!-- </template> -->
    <!-- <template #content> -->
    <slot name="content">
      <p class="mb-4 flex-1 text-primary-emphasis-alt">
        {{ description }}
      </p>
      <span class="block pb-4 text-xs tracking-tight text-gray-500">
        <Icon name="lucide:calendar-clock" class="mr-1 inline-block !text-sm" />
        {{ small }}
      </span>
    </slot>
    <!-- </template> -->
    <!-- <template #footer> -->
    <slot name="footer">
      <span
        class="flex items-center gap-x-2 self-end text-sm font-semibold text-orange-500"
        >Ver más
        <Icon
          name="lucide:arrow-right"
          class="inline-block duration-300 ease-in-out"
        />
      </span>
    </slot>
    <!-- </template> -->
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
import { Card } from 'primevue'
defineProps<{
  elevated?: boolean
  interactive?: boolean
  title?: string
  description?: string
  to?: string
  small?: string
  noSpacing?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
