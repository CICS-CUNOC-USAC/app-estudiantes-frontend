<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="border border-black rounded-xl  bg-red-50 dark:bg-red-950/30 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
    <p class="text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
      <Icon name="lucide:circle-alert" class="size-4" />
      {{ message }}
    </p>
    <Button
      variant="tonal"
      size="sm"
      icon="lucide:rotate-ccw"
      @click="emit('retry')"
    >
      Reintentar
    </Button>
  </div>
</template>
