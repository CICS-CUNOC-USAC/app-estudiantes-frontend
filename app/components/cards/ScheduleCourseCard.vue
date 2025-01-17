<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to
    unstyled
    class="flex h-full flex-col overflow-hidden rounded-xl border border-surface-950/75 bg-surface-50 text-color duration-300 ease-in-out dark:bg-surface-800
      -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]
    "
    :class="{
      'p-5': !noSpacing,
      'cursor-pointer': to,
    }"
  >
    <slot name="career">
      <h3
      v-if="career"
        class="mb-2 text-sm font-semibold transition-colors duration-300 ease-in-out"
      >
        {{ career }}
      </h3>
    </slot>
    <slot name="content">
      <p class="mb-4 flex-1 leading-tight">
        {{ curso }}
      </p>
      <span class="block pb-4 text-xs tracking-tight">
        <Icon v-if="smallIcon" :name="smallIcon" class="mr-1 inline-block !text-sm" />
        Seccion: {{ seccion }}
      </span>
    </slot>
    <slot name="footer">
    </slot>
  </component>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
defineProps<{
  career?: string
  curso?: string
  to?: string
  seccion?: string
  smallIcon?: string
  noSpacing?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
