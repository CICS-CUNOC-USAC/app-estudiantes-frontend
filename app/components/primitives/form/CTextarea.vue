<script setup lang="ts">
import { Textarea } from '~/components/ui/textarea'
import { cn } from '@/lib/utils'

const vModel = defineModel<any>()

const props = defineProps<{
  prependIcon?: string
  appendIcon?: string
  clearButton?: boolean
  noBorders?: boolean
  disabled?: boolean
  message?: string
  error?: string
  label?: string
  rows?: number
  fillHeight?: boolean
  rootClass?: string
}>()

const rawAttrs = useAttrs()
const attrs = computed(() => {
  const { class: _, ...rest } = rawAttrs
  return rest
})
const attrClass = computed(() => (rawAttrs.class as string) ?? '')

const emit = defineEmits(['click:prepend', 'click:append', 'clear'])

const hasPrependClick = computed(
  () => !!getCurrentInstance()?.vnode?.props?.['onClick:prepend']
)
const hasAppendClick = computed(
  () => !!getCurrentInstance()?.vnode?.props?.['onClick:append']
)

const hasPrepend = computed(() => !!props.prependIcon || hasPrependClick.value)
const hasAppend = computed(() => !!props.appendIcon || hasAppendClick.value)

const showClear = computed(() => props.clearButton && !!vModel.value)

function handleClear() {
  vModel.value = ''
  emit('clear')
}

const $textarea = ref<ComponentPublicInstance | null>(null)

function focus() {
  ($textarea.value?.$el as HTMLTextAreaElement)?.focus()
}

defineOptions({ inheritAttrs: false })
defineExpose({ focus })
</script>

<template>
  <div
    :class="cn(
      'flex flex-col gap-y-1.5',
      fillHeight ? 'h-full' : '',
      disabled ? 'pointer-events-none opacity-60' : '',
      rootClass,
    )"
  >
    <!-- textarea row -->
    <div
      class="group relative flex w-full items-stretch rounded-lg border border-black bg-surface-50 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-400/50 dark:border-surface-700 dark:bg-surface-900"
      :class="fillHeight ? 'h-full' : ''"
    >
      <!-- prepend addon / button -->
      <button
        v-if="hasPrepend"
        type="button"
        :class="cn(
          'inline-flex w-10 shrink-0 items-start justify-center pt-3 rounded-l-lg border-r text-muted-foreground transition',
          noBorders ? 'border-r-0' : 'border-r-black dark:border-r-surface-700',
          hasPrependClick ? 'cursor-pointer' : 'cursor-default',
        )"
        :tabindex="hasPrependClick ? 0 : -1"
        @click="hasPrependClick && emit('click:prepend')"
      >
        <Icon v-if="prependIcon" :name="prependIcon" class="size-4" />
      </button>

      <!-- label + textarea wrapper -->
      <div class="relative flex min-w-0 flex-1 flex-col">
        <label
          v-if="label"
          class="pointer-events-none absolute top-1 left-0 z-10 text-xs text-muted-foreground group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400"
        >
          {{ label }}
        </label>

        <Textarea
          ref="$textarea"
          v-bind="attrs"
          v-model="vModel"
          :rows="rows"
          :disabled="disabled"
          :class="cn(
            'rounded-none border-0 bg-transparent! shadow-none resize-none focus-visible:ring-0 field-sizing-fixed min-h-0 text-sm',
            label ? 'pt-5' : 'pt-2',
            showClear ? 'pr-7' : '',
            !hasPrepend ? 'rounded-l-lg' : 'pl-2',
            !hasAppend ? 'rounded-r-lg' : 'pr-2',
            fillHeight ? 'h-full' : '',
            attrClass,
          )"
        />
      </div>

      <!-- clear button -->
      <button
        v-if="showClear"
        type="button"
        class="absolute right-2 top-2 z-10 flex size-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground opacity-0 transition duration-100 hover:bg-neutral-200 group-focus-within:opacity-100 group-hover:opacity-100 dark:hover:bg-neutral-600"
        :class="{ 'right-10': hasAppend }"
        @click="handleClear"
      >
        <Icon name="icon-park-outline:close-small" class="size-3.5" />
      </button>

      <!-- append addon / button -->
      <button
        v-if="hasAppend"
        type="button"
        :class="cn(
          'inline-flex w-10 shrink-0 items-start justify-center pt-3 rounded-r-lg border-l text-muted-foreground transition',
          noBorders ? 'border-l-0' : 'border-l-black dark:border-l-surface-700',
          hasAppendClick ? 'cursor-pointer' : 'cursor-default',
        )"
        :tabindex="hasAppendClick ? 0 : -1"
        @click="hasAppendClick && emit('click:append')"
      >
        <Icon v-if="appendIcon" :name="appendIcon" class="size-4" />
      </button>
    </div>

    <div v-if="message" class="text-xs font-medium text-muted-foreground/70">
      {{ message }}
    </div>
    <div v-if="error" class="text-xs font-medium text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
