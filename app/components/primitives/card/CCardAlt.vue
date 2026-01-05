<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to
    unstyled
    class="overflow-hidden rounded-xl border border-surface-950/75 bg-surface-50 text-color duration-300 ease-in-out dark:bg-surface-900"
    :class="{
      'flex flex-col h-full': !unstyled,
      'p-5': !noSpacing,
      'hover:translate-x-0 hover:translate-y-0 hover:bg-surface-100 hover:shadow-none dark:hover:bg-surface-900':
        interactive,
      'cursor-pointer': to,
      'shadow-[2px_2px_0_0_rgba(0,0,0,1)]':
        elevated || interactive,
      'hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5  active:-translate-x-0 active:-translate-y-0':
        interactiveInverse
    }"
  >
    <slot name="title">
      <h3
      v-if="title"
        class="mb-2 text-lg font-semibold font-heading transition-colors duration-300 ease-in-out"
      >
        {{ title }}
      </h3>
    </slot>
    <slot name="content">
      <p class="mb-4 flex-1">
        {{ description }}
      </p>
      <span class="block pb-4 text-sm tracking-tight text-muted-color">
        <Icon v-if="smallIcon" :name="smallIcon" class="mr-1 inline-block text-sm! " />
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
  interactiveInverse?: boolean
  title?: string
  description?: string
  to?: string
  small?: string
  smallIcon?: string
  noSpacing?: boolean
  unstyled?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
