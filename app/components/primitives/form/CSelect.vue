<template>
  <div class="flex flex-col gap-y-1.5">
    <PInputGroup
      unstyled
      class="group flex h-12 rounded-lg outline outline-2 outline-offset-1 outline-transparent transition-all duration-75 focus-within:outline-primary-400/50"
      :class="[inhAttrs.classAttr]"
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
      <PSelect
        v-bind="inhAttrs.restAttrs"
        :modelValue="modelValue"
        class="z-10 flex size-full items-center gap-x-2 rounded-lg border border-black bg-surface-50 text-sm transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-900"
        :class="{
          'pl-3': !prependUsed || !noBorders,
          'pr-3': !appendUsed || !noBorders,
          'rounded-bl-none rounded-tl-none': hasPrependClick || prependIcon,
          'rounded-br-none rounded-tr-none': hasAppendClick || appendIcon,
          'border-l-0': noBorders && (hasPrependClick || prependIcon),
          'border-r-0': noBorders && (hasAppendClick || appendIcon)
        }"
        unstyled
        :option-label
        :option-value
        :show-clear="clearable"
        :options="items"
        :pt="{
          clearIcon: 'cursor-pointer text-muted-color hover:text-color',
          option: 'flex gap-2 items-center cursor-pointer hover:bg-surface-200/80  dark:hover:bg-surface-800 px-3 py-1.5 rounded-lg data-[p-focused=true]:bg-surface-200/80 dark:data-[p-focused=true]:bg-surface-800',
          listContainer: 'py-2 px-1.5 overflow-y-scroll',
          overlay: 'bg-surface-50 dark:bg-surface-900 shadow-lg rounded-xl border border-black dark:border-surface-700 ',
          label: ({ instance, props }) => ({
            class: [
              'flex-1 cursor-pointer focus:outline-none',
              instance.label === props.placeholder
                ? 'text-muted-color'
                : 'text-color'
            ]
          }),
          dropdown: {
            class: 'flex items-center cursor-pointer text-muted-color hover:text-color h-full',
          }
        }"
        no-borders
      />

      <!-- pt:label:class="flex-1 placeholder:text-muted-color/70"
        pt:dropdown:class="flex items-center " -->
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
    <div v-if="message" class="text-muted-color/70 text-xs font-medium">
      {{ message }}
    </div>
    <div v-if="error" class="text-xs font-medium text-red-500">
      {{ error }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button, InputGroupAddon } from 'primevue'
const vModel = defineModel({ type: String, required: false })
const props = defineProps<{
  items: any[]
  message?: string
  error?: string
  disabled?: boolean
  prependIcon?: string
  appendIcon?: string
  noBorders?: boolean
  optionLabel?: string
  optionValue?: string
  clearable?: boolean
  modelValue?: any
}>()

const rawAttrs = useAttrs()
const inhAttrs = computed(() => {
  const { class: classAttr, ...restAttrs } = rawAttrs
  return { classAttr, restAttrs }
})

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
</script>
<style lang="postcss" scoped></style>
