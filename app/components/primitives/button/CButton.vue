<template>
  <!-- @vue-ignore: Ignore type checking for this component -->
  <PButton
    v-bind="props"
    :as="asProp"
    class="inline-flex select-none items-center justify-center font-semibold  transition duration-75 ease-out focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
    :pt:label:class="`${props.label ? 'block' : 'hidden'}`"
    :class="{
      'w-full': props.fluid,
      'rounded-lg': props.rounded,
      ' border-2 border-black ':
        props.variant !== 'text' && props.variant !== 'link' && props.variant !== 'tonal',
      '  text-white':
        props.variant !== 'text' && props.variant !== 'link' && props.variant !== 'tonal' && !props.outlined,
        'shadow-[3px_3px_0_0_rgba(0,0,0,1)]': !props.outlined,
      'gap-x-2 px-3.5 py-1.5':
        props.variant !== 'link' && props.size === 'large',
      'gap-x-1 px-2.5 py-1': props.variant !== 'link' && props.size === 'small',
      'bg-primary-600 hover:bg-primary-500 focus:bg-opacity-85':
        !props.severity && !props.outlined && props.variant !== 'link' && props.variant !== 'tonal' && props.variant !== 'text',

      // Colors
      'bg-red-600 text-red-100 hover:bg-red-500': props.severity === 'danger',
      'bg-green-600 text-green-100 hover:bg-green-500':
        props.severity === 'success',
      'bg-yellow-600 text-yellow-100 hover:bg-yellow-500':
        props.severity === 'warn',
      'bg-blue-600 text-blue-100 hover:bg-blue-500': props.severity === 'info',
      'bg-zinc-600 text-zinc-100 hover:bg-zinc-500':
        props.severity === 'secondary',
      'bg-transparent text-muted-color-emphasis focus:bg-surface-50/20 dark:focus:bg-surface-600/40 active:translate-x-0.5 active:translate-y-0.5':
        props.outlined,

      // Icon position
      'flex-row-reverse': props.iconPos === 'right',
      'flex-row': props.iconPos === 'left',
      'flex-col-reverse gap-y-1': props.iconPos === 'bottom',
      'flex-col gap-y-1': props.iconPos === 'top',

      // Loading and disabled
      'pointer-events-none opacity-80': props.disabled,
      'pointer-events-none opacity-90': props.loading,

      // Variants
      'bg-primary/30 text-black dark:text-white shadow-none hover:bg-primary/40 active:translate-x-0.5 active:translate-y-0.5 border-none focus:text-white focus:bg-primary/90':
        props.variant === 'tonal',
      'bg-opacity-0 text-current shadow-none hover:bg-opacity-20 active:translate-x-0.5 active:translate-y-0.5 active:border-black':
        props.variant === 'text',
      'gap-x-1 !bg-opacity-0 p-0 shadow-none text-color hover:underline active:translate-x-0.5 active:translate-y-0.5':
        props.variant === 'link',

      // Sizes extra
      'text-sm': props.size === 'large',
      'text-xs': props.size === 'small',
    }"
    unstyled
  >
    <template #icon v-if="icon">
      <Icon :name="icon" class="shrink-0" />
    </template>
    <template #loadingicon>
      <Icon name="svg-spinners:bars-rotate-fade" class="shrink-0" />
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
    href?: string
    variant?: ButtonProps['variant'] | 'tonal'
    rounded?: boolean
    fluid?: boolean
    size?: ButtonProps['size']
  }>(),
  {
    rounded: true,
    fluid: false,
    size: 'large'
  }
)

const asProp = computed(() => {
  if (props.href) return 'A'
  if (props.to) return NuxtLink
  return 'BUTTON'
})
</script>
<style lang="postcss" scoped></style>
