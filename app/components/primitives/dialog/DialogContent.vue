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

const props = defineProps<
  DialogContentProps & {
    title?: string
    closeButton?: boolean
  }
>()
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
      class="data-[state=open]:animate-contentShow bg-cics-white fixed top-1/2 left-1/2 z-[100]  max-h-[85vh] w-11/12  lg:max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-black/80 dark:border-neutral-700 p-6 shadow-lg shadow-black/15 focus:outline-none dark:bg-neutral-900  pb-12"
    >
      <DialogTitle class="mb-4 flex items-center justify-between">
        <span class="text-xl font-semibold">
          {{ title }}
        </span>
        <DialogClose class="cursor-pointer hover:bg-neutral-200 p-1.5 rounded dark:hover:bg-neutral-800" v-if="props.closeButton">
          <Icon name="lucide:x" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogTitle>
      <!-- <div class="pb-6 "> -->
        <slot />
      <!-- </div> -->
    </DialogContent>
  </DialogPortal>
</template>
