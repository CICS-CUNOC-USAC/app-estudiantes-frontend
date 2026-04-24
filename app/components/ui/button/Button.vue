<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  severity?: ButtonVariants['severity']
  outlined?: ButtonVariants['outlined']
  iconPos?: ButtonVariants['iconPos']
  rounded?: ButtonVariants['rounded']
  fluid?: ButtonVariants['fluid']
  loading?: boolean
  disabled?: boolean
  icon?: string
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'large',
  severity: 'default',
  outlined: false,
  iconPos: 'left',
  rounded: true,
  fluid: false,
  loading: false,
  disabled: false
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-severity="severity"
    :as="as"
    :as-child="asChild"
    :aria-busy="loading"
    :disabled="disabled"
    :class="
      cn(
        buttonVariants({
          variant,
          size,
          severity,
          outlined,
          iconPos,
          rounded,
          fluid,
          loading
        }),
        props.class
      )
    "
  >
    <Icon
      v-if="loading"
      name="svg-spinners:bars-rotate-fade"
      class="shrink-0"
    />
    <Icon v-else-if="icon" :name="icon" class="shrink-0" />
    <span v-if="label" class="block">{{ label }}</span>
    <slot />
  </Primitive>
</template>
