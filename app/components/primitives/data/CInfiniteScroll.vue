<template>
  <div ref="scrollContainer" class="scroll-container">
    <div class="size-full">
      <slot></slot>
    </div>
    <div ref="scrollEnd" class="min-h-2"></div>
  </div>
</template>
<script setup>
const emit = defineEmits(['loadMore'])

const scrollContainer = ref(null)
const scrollEnd = ref(null)

onMounted(() => {
  const options = {
    root: document
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      emit('loadMore', () => {
        observer.disconnect()
      })
    }
  }, options)
  observer.observe(scrollEnd.value)
})
</script>
<style lang="postcss" scoped>
.scroll-container {
  @apply flex size-full flex-col overflow-visible;
}
</style>
