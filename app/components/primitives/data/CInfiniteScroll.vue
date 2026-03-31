<template>
  <div class="scroll-container">
    <div class="size-full">
      <slot></slot>
    </div>
    <div ref="scrollEnd" class="min-h-2"></div>
    <div class="flex items-center justify-center flex-col gap-4 pb-6">
      <Icon v-if="props.loading" name="svg-spinners:bars-rotate-fade"/>
      <CButton
        class="w-fit"
        @click="handleLoadMore"
        variant="tonal"
        size="small"
        label="Ver más"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import CButton from '../button/CButton.vue'

const emit = defineEmits(['loadMore'])

const scrollEnd = useTemplateRef<Element | null>('scrollEnd')
const hasTriggeredOnce = ref(false)

const props = withDefaults(
  defineProps<{
    loading?: boolean
    immediate?: boolean
  }>(),
  {
    immediate: true
  }
)

const handleLoadMore = () => {
  hasTriggeredOnce.value = true
  emit('loadMore')
}

onMounted(() => {
  const options = {
    root: document
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries[0] && entries[0].isIntersecting) {
      // If immediate is false and this is the first trigger, skip emitting
      if (!props.immediate && !hasTriggeredOnce.value) {
        hasTriggeredOnce.value = true
        return
      }
      
      emit('loadMore', () => {
        observer.disconnect()
      })
    }
  }, options)
  if (scrollEnd.value) observer.observe(scrollEnd.value)
})
</script>
<style lang="postcss" scoped>
.scroll-container {
  @apply flex size-full flex-col overflow-visible;
}
</style>
