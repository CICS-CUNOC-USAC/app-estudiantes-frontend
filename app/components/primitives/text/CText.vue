<template>
  <div
    class="m-4 border border-4 border-black p-2 pl-4 text-2xl font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform duration-200 ease-in-out"
    :class="[
      containerClass,
      {'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]':hover}
    ]"
  >
    <slot />
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    hover?: boolean
    bgColor?: string | null
  }>(),
  {
    hover: false,
    bgColor: null
  }
)

const containerClass = computed(() => {
  return props.bgColor ? props.bgColor + ' text-white' : 'bg-surface-50 dark:bg-surface-800'
})
</script>
<style lang="postcss" scoped></style>
