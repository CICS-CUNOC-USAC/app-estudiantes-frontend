<script setup lang="ts">
import type { ToggleEmits, ToggleProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ToggleVariants } from '.'
import { reactiveOmit } from '@vueuse/core'
import { Toggle, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { toggleVariants } from '.'

const props = withDefaults(
  defineProps<
    ToggleProps & {
      class?: HTMLAttributes['class']
      variant?: ToggleVariants['variant']
      size?: ToggleVariants['size']
      withIndicator?: boolean
      indicatorIcon?: string
    }
  >(),
  {
    variant: 'outline',
    size: 'default',
    disabled: false,
    withIndicator: false,
    indicatorIcon: 'icon-park-outline:check'
  }
)

const emits = defineEmits<ToggleEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-slot="toggle"
    v-bind="forwarded"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <span
      v-if="withIndicator"
      class="indicator-wrapper"
      :class="{ 'is-active': slotProps.modelValue }"
    >
      <Icon :name="indicatorIcon" />
    </span>
    <slot v-bind="slotProps" />
  </Toggle>
</template>
<style scoped>
@reference '~/assets/css/main.css';

.indicator-wrapper {
  transition:
    max-width 200ms ease-in-out,
    opacity 200ms ease-in-out,
    margin-right 200ms ease-in-out;
  @apply -mr-2 inline-flex max-w-0 overflow-hidden opacity-0;
}

.indicator-wrapper.is-active {
  @apply mr-0 max-w-4 opacity-100;
}
</style>
