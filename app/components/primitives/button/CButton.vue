<template>
  <PButton
    v-bind="props"
    class="rounded-lg inline-flex gap-x-2 border border-black/75 px-3.5 py-1.5 text-sm font-semibold justify-center items-center text-white transition-all -translate-x-0.5 -translate-y-0.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none duration-50 ease-out select-none"
    :class="{
      'bg-primary-600 hover:bg-primary-500 focus:bg-primary-400': !props.severity && !props.outlined,
      'bg-red-600 hover:bg-red-500': props.severity === 'danger',
      'bg-green-600 hover:bg-green-500': props.severity === 'success',
      'bg-yellow-600 hover:bg-yellow-500': props.severity === 'warn',
      'bg-blue-600 hover:bg-blue-500': props.severity === 'info',
      'bg-zinc-600 hover:bg-zinc-500': props.severity === 'secondary',
      'bg-transparent text-color border-surface-900/75 shadow-[3px_3px_0_0_var(--p-surface-900)]': props.outlined,
      'flex-row-reverse': props.iconPos === 'right',
      'flex-row': props.iconPos === 'left',
      'flex-col-reverse gap-y-1': props.iconPos === 'bottom',
      'flex-col gap-y-1': props.iconPos === 'top',
      'cursor-not-allowed opacity-60 pointer-events-none': props.disabled,
      'opacity-80 pointer-events-none': props.loading
    }"
    unstyled
  >
    <template #icon v-if="icon">
      <Icon  :name="icon" />
    </template>
  </PButton>
</template>
<script setup lang="ts">
import { type ButtonProps } from 'primevue'
const props = defineProps<{
  label?: string
  icon?: string
  severity?: ButtonProps['severity']
  outlined?: boolean,
  iconPos?: ButtonProps['iconPos']
  loading?: boolean
  disabled?: boolean
}>()
</script>
<style lang="postcss" scoped></style>
