<script setup lang="ts">
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        class="hover:bg-surface-200 dark:hover:bg-surface-700 flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-600 transition-colors dark:text-neutral-300"
      >
        <Icon name="icon-park-outline:more" />
      </button>
    </PopoverTrigger>

    <PopoverContent
      side="top"
      :side-offset="8"
      class="data-[state=open]:animate-contentShow bg-cics-white z-[9999] w-72 rounded-xl border border-black/80 p-3.5 shadow-lg shadow-black/10 dark:border-neutral-700 dark:bg-neutral-900"
    >
      <slot name="title" />
      <slot />
    </PopoverContent>
  </Popover>
</template>
