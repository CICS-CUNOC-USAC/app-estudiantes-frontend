<template>
  <PChip
    class="flex justify-center border border-surface-950 bg-surface-0 text-sm duration-300 ease-in-out hover:translate-x-0 hover:translate-y-0 hover:bg-surface-300"
    :class="{
      'rounded-full': props.rounded
    }"
    :label="label"
    unstyled
  ></PChip>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components'
import { type ButtonProps } from 'primevue'
const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    severity?: ButtonProps['severity']
    outlined?: boolean
    iconPos?: ButtonProps['iconPos']
    loading?: boolean
    disabled?: boolean
    to?: string
    variant?: ButtonProps['variant']
    rounded?: boolean
  }>(),
  {
    rounded: true
  }
)
</script>
<style lang="postcss" scoped></style>
