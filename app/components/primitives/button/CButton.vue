<template>
  <PButton
    v-bind="props"
    :as="props.to ? NuxtLink : 'BUTTON'"
    class="inline-flex select-none items-center justify-center text-sm font-semibold text-white transition duration-75 ease-out focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0 active:translate-y-0 active:shadow-none"
    :pt:label:class="`${props.label ? 'block' : 'hidden'}`"
    :class="{
      'rounded-lg': props.rounded,
      '-translate-x-0.5 -translate-y-0.5 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]':
        props.variant !== 'text' && props.variant !== 'link',
      'px-3.5 py-1.5 gap-x-2': props.variant !== 'link',
      'bg-primary-600 hover:bg-primary-500 focus:bg-opacity-85':
        !props.severity && !props.outlined,
      'bg-red-600 text-red-100 hover:bg-red-500': props.severity === 'danger',
      'bg-green-600 text-green-100 hover:bg-green-500':
        props.severity === 'success',
      'bg-yellow-600 text-yellow-100 hover:bg-yellow-500':
        props.severity === 'warn',
      'bg-blue-600 text-blue-100 hover:bg-blue-500': props.severity === 'info',
      'bg-zinc-600 text-zinc-100 hover:bg-zinc-500':
        props.severity === 'secondary',
      'bg-transparent text-color focus:bg-surface-50/20 dark:focus:bg-surface-600/40':
        props.outlined,
      'flex-row-reverse': props.iconPos === 'right',
      'flex-row': props.iconPos === 'left',
      'flex-col-reverse gap-y-1': props.iconPos === 'bottom',
      'flex-col gap-y-1': props.iconPos === 'top',
      'pointer-events-none opacity-80': props.disabled,
      'pointer-events-none opacity-90': props.loading,
      'bg-opacity-0 !text-current shadow-none hover:bg-opacity-20 hover:outline-black active:translate-x-0.5 active:translate-y-0.5 active:border-black':
        props.variant === 'text',
      '!bg-opacity-0 p-0 shadow-none text-color hover:underline active:translate-x-0.5 active:translate-y-0.5 gap-x-1':
        props.variant === 'link'
    }"
    unstyled
  >
    <template #icon v-if="icon">
      <Icon :name="icon" />
    </template>
    <template #loadingicon>
      <Icon name="svg-spinners:bars-rotate-fade" />
    </template>
  </PButton>
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
