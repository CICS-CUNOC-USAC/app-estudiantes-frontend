<template>
  <div class="flex  flex-col gap-y-1.5"
    :class="{
      'h-full': props.fillHeight,
      'opacity-60 pointer-events-none': props.disabled
    }">
    <PInputGroup
      unstyled
      class="group flex  rounded-lg  transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-400/50  focus-within:ring-offset-transparent"
      :class="[test.classAttr, {
        'h-12': !props.fillHeight,
        'h-full': props.fillHeight
      }]"
    >
      <component
        v-if="hasPrependClick || prependIcon"
        :is="hasPrependClick ? Button : InputGroupAddon"
        icon
        @click="emit('click:prepend')"
        class="inline-flex w-12 items-center justify-center rounded-bl-lg rounded-tl-lg border border-r-0 border-black bg-surface-50 p-0 transition text-color dark:border-surface-700 dark:bg-surface-900 
        "
        :class="{
          'hover:bg-surface-200/80 dark:hover:bg-surface-800': hasPrependClick,
          // 'cursor-not-allowed opacity-50': disabled
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
        <PIftaLabel class="relative size-full" unstyled>
          <label
            v-if="props.label"
            :for="test.restAttrs.id as string"
            class="absolute left-0 z-10 w-max pt-1.5 text-xs text-muted-color group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400"
          >
            {{ props.label }}
          </label>
          <PInputText
            v-bind="test.restAttrs"
            :type="props.type"
            :disabled
            ref="$input"
            v-model="vModel"
            class="z-10 flex size-full rounded-lg border border-black bg-surface-50 text-sm transition text-color placeholder:text-muted-color focus:outline-none  dark:border-surface-700 dark:bg-surface-900"
            :class="{
              'pt-4': props.label,
              'pl-3': !prependUsed || !noBorders,
              'pr-3': !appendUsed || !noBorders || !props.clearButton,
              'pr-5': props.clearButton,
              'rounded-bl-none rounded-tl-none': hasPrependClick || prependIcon,
              'rounded-br-none rounded-tr-none': hasAppendClick || appendIcon,
              'border-l-0': noBorders && (hasPrependClick || prependIcon),
              'border-r-0': noBorders && (hasAppendClick || appendIcon)
            }"
            fluid
            unstyled
          >
          </PInputText>
        </PIftaLabel>
        <!-- () => {
          vModel = '';
          $input?.$el?.value = ''
        } -->
        <button
          v-if="props.clearButton && vModel"
          @click="()=>{
            vModel = '';
            $emit('clear')
          }"
          type="button"
          class="absolute top-1/2 z-10 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm opacity-0 transition duration-100 text-muted-color hover:bg-neutral-200 group-focus-within:opacity-100 group-hover:opacity-100 lg:size-4 dark:text-muted-color-emphasis dark:hover:bg-neutral-600"
          :class="{
            'right-0': hasAppendClick || appendIcon,
            'right-2': !hasAppendClick || !appendIcon
          }"
        >
          <Icon name="icon-park-outline:close-small" />
        </button>
      </div>
      <component
        v-if="hasAppendClick || appendIcon"
        :is="hasAppendClick ? Button : InputGroupAddon"
        @click="emit('click:append')"
        class="inline-flex w-12 items-center justify-center rounded-br-lg rounded-tr-lg border border-l-0 border-black bg-surface-50 p-0 transition text-color dark:border-surface-700 dark:bg-surface-900
        disabled:opacity-50
        "
        :class="{
          'cursor-pointer hover:bg-surface-200/80 dark:hover:bg-surface-800':
            hasAppendClick,
          // 'cursor-not-allowed opacity-50': disabled
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
    <div v-if="props.message" class="text-muted-color/70 text-xs font-medium">
      {{ props.message }}
    </div>
    <div v-if="props.error" class="text-xs font-medium text-red-500">
      {{ props.error }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { Button, InputGroupAddon } from 'primevue'

// const vModel = defineModel({ type: [String, Number], required: false })
const vModel = defineModel<any>()
const $input = ref<{
  $el: HTMLInputElement | null
}>()

const props = defineProps<{
  prependIcon?: string
  appendIcon?: string
  clearButton?: boolean
  noBorders?: boolean
  disabled?: boolean
  message?: string
  error?: string
  type?: string
  label?: string
  fillHeight?: boolean
}>()
const rawAttrs = useAttrs()
const test = computed(() => {
  const { class: classAttr, ...restAttrs } = rawAttrs
  return { classAttr, restAttrs }
})

const emit = defineEmits(['click:prepend', 'click:append', 'clear'])

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

