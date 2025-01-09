<!-- DialogContent.vue -->
<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useEmitAsProps
} from 'radix-vue'

const props = defineProps<DialogContentProps & {
  title?: string
}>()
const emits = defineEmits<DialogContentEmits>()

const emitsAsProps = useEmitAsProps(emits)

</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="data-[state=open]:animate-overlayShow fixed inset-0 z-30 bg-gray-950/50 transition-all duration-500"
    />
    <DialogContent
      v-bind="{ ...props, ...emitsAsProps, ...$attrs }"
      class="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-[100] max-h-[85vh] w-[90vw] max-w-xl -translate-x-1/2 -translate-y-1/2 border rounded-xl border-black/80 bg-cics-white p-6 shadow-lg shadow-black/15 focus:outline-none dark:bg-neutral-900"
    >
    <DialogTitle class="flex items-center justify-between mb-4">
      <span class="text-xl font-bold">
        {{ title }}
      </span>
      <DialogClose>
        <Icon name="lucide:x" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogTitle>
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
