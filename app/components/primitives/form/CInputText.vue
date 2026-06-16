<script setup lang="ts">
import { Input } from '~/components/ui/input'
import { cn } from '@/lib/utils'

const vModel = defineModel<any>()

const props = withDefaults(defineProps<{
  prependIcon?: string
  appendIcon?: string
  clearable?: boolean
  clearButton?: boolean
  noBorders?: boolean
  disabled?: boolean
  message?: string
  error?: string
  type?: string
  label?: string
  fillHeight?: boolean
  rootClass?: string
}>(), {
  noBorders: true,
})

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

const nativeValue = ref('')
const isControlled = computed(() => vModel.value !== undefined)
const showClear = computed(() => {
  if (!(props.clearable || props.clearButton)) return false
  return isControlled.value ? !!vModel.value : !!nativeValue.value
})

const $input = ref<ComponentPublicInstance | null>(null)

function focus() {
  ;($input.value?.$el as HTMLInputElement)?.focus()
}

function handleClear() {
  vModel.value = undefined
  nativeValue.value = ''
  const el = $input.value?.$el as HTMLInputElement | undefined
  if (el) {
    el.value = ''
    el.dispatchEvent(new Event('input'))
  }
  emit('clear')
}

defineOptions({ inheritAttrs: false })
defineExpose({ focus })
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col gap-y-1.5',
        fillHeight ? 'h-full' : '',
        disabled ? 'pointer-events-none opacity-60' : '',
        rootClass
      )
    "
  >
    <!-- input row -->
    <div
      class="group bg-surface-50 focus-within:ring-primary-400/50 dark:border-surface-700 dark:bg-surface-900 relative flex w-full items-stretch rounded-lg border border-black transition-all duration-200 focus-within:ring-2"
      :class="{
        'h-full': fillHeight,
        'h-12': !fillHeight
      }"
    >
      <!-- prepend addon / button -->
      <button
        v-if="hasPrepend"
        type="button"
        :class="
          cn(
            'text-muted-foreground inline-flex w-10 shrink-0 items-center justify-center rounded-l-lg border-r transition',
            noBorders
              ? 'border-r-0'
              : 'dark:border-r-surface-700 border-r-black',
            hasPrependClick ? 'cursor-pointer' : 'cursor-default'
          )
        "
        :tabindex="hasPrependClick ? 0 : -1"
        @click="hasPrependClick && emit('click:prepend')"
      >
        <Icon v-if="prependIcon" :name="prependIcon" class="size-4" />
      </button>

      <!-- label + input wrapper -->
      <div
        class="relative flex min-w-0 flex-1 flex-col justify-center"
        :class="
          cn(
            !hasPrepend ? 'rounded-l-lg pl-2' : '',
            !hasAppend ? 'rounded-r-lg pr-2' : ''
          )
        "
      >
        <label
          v-if="label"
          class="text-muted-foreground group-focus-within:text-primary-500 dark:group-focus-within:text-primary-400 pointer-events-none absolute top-1 z-10 text-xs"
        >
          {{ label }}
        </label>

        <Input
          ref="$input"
          v-bind="attrs"
          v-model="vModel"
          :type="type"
          :disabled="disabled"
          @input="
            (e: Event) => (nativeValue = (e.target as HTMLInputElement).value)
          "
          :class="
            cn(
              'h-full rounded-none border-0 bg-transparent shadow-none placeholder:text-sm focus-visible:ring-0 px-0',
              label ? 'pt-4' : '',
              showClear ? 'pr-7' : '',
              attrClass
            )
          "
        />
      </div>

      <!-- clear button -->
      <button
        v-if="showClear"
        type="button"
        class="text-muted-foreground absolute top-1/2 right-2 z-10 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm opacity-0 transition duration-100 group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        :class="{ 'right-10': hasAppend }"
        @click="handleClear"
      >
        <Icon name="icon-park-outline:close-small" class="size-3.5" />
      </button>

      <!-- append addon / button -->
      <button
        v-if="hasAppend"
        type="button"
        :class="
          cn(
            'text-muted-foreground inline-flex w-10 shrink-0 items-center justify-center rounded-r-lg border-l transition',
            noBorders
              ? 'border-l-0'
              : 'dark:border-l-surface-700 border-l-black',
            hasAppendClick ? 'cursor-pointer' : 'cursor-default'
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
