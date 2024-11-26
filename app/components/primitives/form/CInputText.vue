<template>
  <PInputGroup
    unstyled
    class="flex h-12"
    :class="[
      {
        'rounded-lg transition focus-within:ring-2 focus-within:ring-primary-400/30':
          prependUsed || appendUsed
      },
      classAttr
    ]"
  >
    <component
      v-if="hasPrependClick || prependIcon"
      :is="hasPrependClick ? Button : InputGroupAddon"
      icon
      @click="emit('click:prepend')"
      class="dark:border-surface-7002 inline-flex w-12 items-center justify-center rounded-bl-lg rounded-tl-lg border border-r-0 border-black bg-surface-50 p-0 transition text-color dark:bg-surface-900"
      :class="{
        'hover:bg-surface-200/80 dark:hover:bg-surface-800': hasPrependClick
      }"
      unstyled
      pt:label:class="hidden"
    >
      <template #icon v-if="prependIcon && hasPrependClick">
        <Icon v-if="prependIcon" :name="prependIcon" />
      </template>
      <Icon v-if="prependIcon && !hasPrependClick" :name="prependIcon" />
    </component>
    <PInputText
      v-bind="restAttrs"
      ref="$input"
      v-model="vModel"
      class="placeholder:text-muted-color/70 dark:border-surface-7002 z-10 flex rounded-lg border border-black bg-surface-50 w-full text-sm transition text-color disabled:cursor-not-allowed disabled:opacity-50 dark:bg-surface-900"
      :class="{
        'pl-3': !prependUsed,
        'pr-3': !appendUsed,
        'rounded-bl-none rounded-tl-none': hasPrependClick || prependIcon,
        'rounded-br-none rounded-tr-none': hasAppendClick || appendIcon,
        //remove default focus styles when prepend or append is used
        'focus:outline-none': prependUsed || appendUsed,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/30':
          !prependUsed && !appendUsed,
        'border-l-0': noBorders && (hasPrependClick || prependIcon),
        'border-r-0': noBorders && (hasAppendClick || appendIcon)
      }"
      fluid
      unstyled
    >
    </PInputText>
    <component
      v-if="hasAppendClick || appendIcon"
      :is="hasAppendClick ? Button : InputGroupAddon"
      @click="emit('click:append')"
      class="dark:border-surface-7002 inline-flex w-12 items-center justify-center rounded-br-lg rounded-tr-lg border border-l-0 border-black bg-surface-50 p-0 transition text-color dark:bg-surface-900"
      :class="{
        'hover:bg-surface-200/80 dark:hover:bg-surface-800': hasAppendClick
      }"
      unstyled
      pt:label:class="hidden"
    >
      <template #icon v-if="appendIcon">
        <Icon v-if="appendIcon" :name="appendIcon" />
      </template>
      <Icon v-if="appendIcon && !hasAppendClick" :name="appendIcon" />
    </component>
  </PInputGroup>
</template>
<script setup lang="ts">
import { Button, InputGroupAddon } from 'primevue'

const vModel = defineModel({ type: String, required: true })

const $input = ref<{
  $el: HTMLInputElement | null
}>()

const props = defineProps<{
  prependIcon?: string
  appendIcon?: string
  noBorders?: boolean
}>()

const attrs = useAttrs()
const { class: classAttr, ...restAttrs } = attrs

const emit = defineEmits(['click:prepend', 'click:append'])

const hasPrependClick = computed(
  () => !!getCurrentInstance()?.vnode?.props['onClick:prepend']
)
const hasAppendClick = computed(
  () => !!getCurrentInstance()?.vnode?.props['onClick:append']
)

const prependUsed = computed(() => !!props.prependIcon || hasPrependClick.value)
const appendUsed = computed(() => !!props.appendIcon || hasAppendClick.value)

defineOptions({
  inheritAttrs: false
})

defineExpose({$input})
</script>
<style lang="postcss" scoped></style>
