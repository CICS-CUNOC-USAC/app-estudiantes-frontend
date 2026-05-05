<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { cn } from '@/lib/utils'

type Item = string | number | Record<string, any>

const props = defineProps<{
  items: Item[]
  modelValue?: any
  defaultValue?: any
  message?: string
  error?: string
  disabled?: boolean
  prependIcon?: string
  appendIcon?: string
  noBorders?: boolean
  optionLabel?: string
  optionValue?: string
  clearable?: boolean
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
  valueChange: [value: any]
  'click:prepend': []
  'click:append': []
}>()

const rawAttrs = useAttrs()
const attrClass = computed(() => (rawAttrs.class as string) ?? '')

const hasPrependClick = computed(
  () => !!getCurrentInstance()?.vnode?.props?.['onClick:prepend']
)
const hasAppendClick = computed(
  () => !!getCurrentInstance()?.vnode?.props?.['onClick:append']
)
const hasPrepend = computed(() => !!props.prependIcon || hasPrependClick.value)
const hasAppend = computed(() => !!props.appendIcon || hasAppendClick.value)

function itemValue(item: Item): string {
  if (typeof item === 'object' && props.optionValue)
    return String(item[props.optionValue])
  return String(item)
}

function itemLabel(item: Item): string {
  if (typeof item === 'object' && props.optionLabel)
    return String(item[props.optionLabel])
  return String(item)
}

function handleUpdate(val: AcceptableValue) {
  if (val === '__clear__') {
    emit('update:modelValue', null)
    emit('valueChange', null)
    return
  }
  emit('update:modelValue', val)
  emit('valueChange', val)
}

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col gap-y-1.5">
    <div
      :class="
        cn(
          'group bg-surface-50 focus-within:ring-primary-400/50 dark:border-surface-700 dark:bg-surface-900 relative flex h-12 w-full rounded-lg border border-black transition-all duration-200 focus-within:ring-2',
          disabled ? 'pointer-events-none opacity-60' : '',
          attrClass
        )
      "
    >
      <!-- prepend -->
      <button
        v-if="hasPrepend"
        type="button"
        :class="
          cn(
            'text-muted-foreground inline-flex w-10 shrink-0 items-center justify-center rounded-l-lg transition',
            noBorders
              ? 'border-r-0'
              : 'dark:border-r-surface-700 border-r border-r-black',
            hasPrependClick
              ? 'hover:bg-surface-200/80 dark:hover:bg-surface-800 cursor-pointer'
              : 'cursor-default'
          )
        "
        :tabindex="hasPrependClick ? 0 : -1"
        @click="hasPrependClick && emit('click:prepend')"
      >
        <Icon v-if="prependIcon" :name="prependIcon" class="size-4" />
      </button>

      <!-- select root -->
      <Select
        v-bind="$attrs"
        :model-value="modelValue"
        :default-value="defaultValue"
        :disabled="disabled"
        @update:model-value="handleUpdate"
      >
        <SelectTrigger
          :class="
            cn(
              'relative h-full flex-1 rounded-none border-0 bg-transparent pr-4 pl-0 shadow-none focus-visible:border-0 focus-visible:ring-0',
              label ? 'items-end pb-1' : '',
              hasPrepend ? 'pl-0' : 'pl-4',
              hasAppend ? 'pr-10' : 'pr-4'
            )
          "
        >
          <!-- floating label -->
          <label
            v-if="label"
            class="text-muted-foreground pointer-events-none absolute top-1 left-0 z-10 text-xs select-none"
          >
            {{ label }}
          </label>
          <SelectValue :placeholder="placeholder ?? ''" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem
            v-for="item in items"
            :key="itemValue(item)"
            :value="itemValue(item)"
          >
            {{ itemLabel(item) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <!-- clear button -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="text-muted-foreground absolute top-1/2 right-10 z-20 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm opacity-0 transition duration-100 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        @click.stop="
          () => {
            emit('update:modelValue', null)
            emit('valueChange', null)
          }
        "
      >
        <Icon name="icon-park-outline:close-small" class="size-3.5" />
      </button>

      <!-- append -->
      <button
        v-if="hasAppend"
        type="button"
        :class="
          cn(
            'text-muted-foreground inline-flex w-10 shrink-0 items-center justify-center rounded-r-lg transition',
            noBorders
              ? 'border-l-0'
              : 'dark:border-l-surface-700 border-l border-l-black',
            hasAppendClick
              ? 'hover:bg-surface-200/80 dark:hover:bg-surface-800 cursor-pointer'
              : 'cursor-default'
          )
        "
        :tabindex="hasAppendClick ? 0 : -1"
        @click="hasAppendClick && emit('click:append')"
      >
        <Icon v-if="appendIcon" :name="appendIcon" class="size-4" />
      </button>
    </div>

    <div v-if="message" class="text-muted-foreground/70 text-xs font-medium">
      {{ message }}
    </div>
    <div v-if="error" class="text-xs font-medium text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
