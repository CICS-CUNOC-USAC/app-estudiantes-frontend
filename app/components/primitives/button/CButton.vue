<template>
  <PButton
    v-bind="props"
    :as="props.to ? NuxtLink : 'BUTTON'"
    class="rounded-lg inline-flex gap-x-2 text-sm font-semibold justify-center items-center transition-all text-white active:translate-x-0 active:translate-y-0 active:shadow-none duration-50 ease-out select-none"
    :class="{
      'border border-black -translate-x-0.5 -translate-y-0.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)]': props.variant !== 'text' && props.variant !== 'link',
      'px-3.5 py-1.5': props.variant !== 'link',
      'bg-primary-600 hover:bg-primary-500 focus:bg-opacity-85': !props.severity && !props.outlined,
      'bg-red-600 hover:bg-red-500 text-red-100': props.severity === 'danger',
      'bg-green-600 hover:bg-green-500 text-green-100': props.severity === 'success',
      'bg-yellow-600 hover:bg-yellow-500 text-yellow-100': props.severity === 'warn',
      'bg-blue-600 hover:bg-blue-500 text-blue-100': props.severity === 'info',
      'bg-zinc-600 hover:bg-zinc-500 text-zinc-100': props.severity === 'secondary',
      'bg-transparent text-color focus:bg-surface-50/20 dark:focus:bg-surface-600/40': props.outlined,
      'flex-row-reverse': props.iconPos === 'right',
      'flex-row': props.iconPos === 'left',
      'flex-col-reverse gap-y-1': props.iconPos === 'bottom',
      'flex-col gap-y-1': props.iconPos === 'top',
      'opacity-80 pointer-events-none': props.disabled,
      'opacity-90 pointer-events-none': props.loading,
      'hover:outline-black bg-opacity-0 shadow-none !text-current hover:bg-opacity-20 active:translate-x-0.5 active:translate-y-0.5 active:border-black': props.variant === 'text',
      'hover:underline p-0 !bg-opacity-0 shadow-none text-current active:translate-x-0.5 active:translate-y-0.5': props.variant === 'link',
    }"
    unstyled
  >
    <template #icon v-if="icon">
      <Icon  :name="icon" />
    </template>
    <template #loadingicon>
      <Icon name="svg-spinners:bars-rotate-fade"  />
    </template>
  </PButton>
</template>
<script setup lang="ts">
import { NuxtLink } from '#components';
import { type ButtonProps } from 'primevue'
const props = defineProps<{
  label?: string
  icon?: string
  severity?: ButtonProps['severity']
  outlined?: boolean,
  iconPos?: ButtonProps['iconPos']
  loading?: boolean
  disabled?: boolean,
  to?: string,
  variant?: ButtonProps['variant']
}>()
</script>
<style lang="postcss" scoped></style>
