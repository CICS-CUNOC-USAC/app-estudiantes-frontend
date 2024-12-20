<template>
  <PInputGroup
    unstyled
    class="flex h-12 rounded-lg group outline outline-2 outline-offset-1 outline-transparent transition-all duration-75 focus-within:outline-primary-400/50"
    :class="[
      // {
      //   'rounded-lg transition-all duration-75 outline outline-2 outline-transparent focus-within:outline-primary-400/50':
      //     prependUsed || appendUsed
      // },
      classAttr
    ]"
  >
    <component
      v-if="hasPrependClick || prependIcon"
      :is="hasPrependClick ? Button : InputGroupAddon"
      icon
      @click="emit('click:prepend')"
      class="inline-flex w-12 items-center justify-center rounded-bl-lg rounded-tl-lg border border-r-0 border-black bg-surface-50 p-0 transition text-color dark:border-surface-700 dark:bg-surface-900"
      :class="{
        'hover:bg-surface-200/80 dark:hover:bg-surface-800': hasPrependClick,
        'cursor-not-allowed opacity-50': disabled
      }"
      unstyled
      pt:label:class="hidden"
    >
      <template #icon v-if="prependIcon && hasPrependClick">
        <Icon v-if="prependIcon" :name="prependIcon" />
      </template>
      <Icon v-if="prependIcon && !hasPrependClick" :name="prependIcon" />
    </component>
    <div class="relative size-full">
      <PInputText
        v-bind="restAttrs"
        :disabled
        ref="$input"
        v-model="vModel"
        class="placeholder:text-muted-color/70 z-10 flex size-full rounded-lg border border-black bg-surface-50 text-sm transition text-color focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-900"
        :class="{
          'pl-3': !prependUsed || !noBorders,
          'pr-3': !appendUsed || !noBorders || !props.clearable,
          'pr-5': props.clearable,
          'rounded-bl-none rounded-tl-none': hasPrependClick || prependIcon,
          'rounded-br-none rounded-tr-none': hasAppendClick || appendIcon,
          'border-l-0': noBorders && (hasPrependClick || prependIcon),
          'border-r-0': noBorders && (hasAppendClick || appendIcon)
        }"
        fluid
        unstyled
      >
      </PInputText>
      <button
        v-if="props.clearable && vModel"
        @click="vModel = ''"
        class="text-muted-color dark:text-muted-color-emphasis hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-sm absolute z-10 top-1/2 -translate-y-1/2 size-5 lg:size-4 flex items-center justify-center cursor-pointer opacity-0 transition duration-100 group-hover:opacity-100 group-focus-within:opacity-100"
        :class="{
          'right-0': hasAppendClick || appendIcon,
          'right-2': !hasAppendClick || !appendIcon,
        }"
      >
        <Icon name="icon-park-outline:close-small"/>
      </button>
    </div>
    <component
      v-if="hasAppendClick || appendIcon"
      :is="hasAppendClick ? Button : InputGroupAddon"
      @click="emit('click:append')"
      class="inline-flex w-12 items-center justify-center rounded-br-lg rounded-tr-lg border border-l-0 border-black bg-surface-50 p-0 transition text-color dark:border-surface-700 dark:bg-surface-900"
      :class="{
        'cursor-pointer hover:bg-surface-200/80 dark:hover:bg-surface-800':
          hasAppendClick,
        'cursor-not-allowed opacity-50': disabled
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
  disabled?: boolean
  clearable?: boolean
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

defineExpose({ $input })
</script>
<style lang="postcss" scoped></style>
