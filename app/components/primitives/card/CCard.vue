<template>
  <component
    :is="link ? NuxtLink : 'div'"
    :to="link"
    class="group flex h-full -translate-x-0.5 -translate-y-0.5 cursor-pointer flex-col overflow-hidden rounded-xl border border-surface-950/45 bg-surface-50 p-5 shadow-[2px_3px_0_0_var(--p-surface-800)] duration-300 ease-in-out hover:translate-x-0 hover:translate-y-0 hover:bg-surface-100 hover:shadow-none"
  >
    <h3
      class="mb-2 text-lg font-semibold transition-colors duration-300 ease-in-out group-hover:text-orange-600"
    >
      {{ title }}
    </h3>
    <p class="mb-4 flex-1 text-primary-emphasis-alt">{{ description }}</p>
    <span class="block pb-4 text-xs tracking-tight text-gray-500">
      <Icon name="lucide:calendar-clock" class="mr-1 inline-block !text-sm" />
      {{ small }}
    </span>
    <span
      class="flex items-center gap-x-2 self-end text-sm font-semibold text-orange-500"
      >Ver más
      <Icon
        name="icon-park-outline:arrow-right"
        class="inline-block duration-300 ease-in-out group-hover:translate-x-1"
      />
    </span>
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
defineProps<{
  title: string
  description: string
  link: string
  small?: string
}>()
</script>
<style lang="postcss" scoped></style>
