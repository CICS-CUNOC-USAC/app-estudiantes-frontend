<template>
  <PButton
    class="inline-flex cursor-pointer items-center rounded-full border border-gray-300 bg-surface-100 dark:border-gray-700 dark:bg-gray-700 dark:text-cics-white pl-4 pr-4 text-sm text-gray-800 transition duration-300 ease-in-out hover:bg-surface-300 dark:hover:bg-gray-500"
    :class="[{ 'chip-active': isActive }]"
    @click="toggleFilter"
    :label="label"
    :icon="icon"
    unstyled
  />
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
import Button from 'primevue/button'

const props = defineProps<{
  label: string // Etiqueta para el chip
  icon?: string // Ícono opcional
  modelValue?: boolean // Estado inicial del filtro
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'toggle', value: boolean): void
}>()

const isActive = ref(false)

watch(
  () => props.modelValue,
  (newValue) => {
    isActive.value = newValue ?? false
  },
  { immediate: true }
)

const toggleFilter = () => {
  isActive.value = !isActive.value
  emit('update:modelValue', isActive.value)
  emit('toggle', isActive.value)
}
</script>

<style scoped lang="postcss">
.chip-active {
  @apply border-primary-500 bg-primary-500 text-white hover:border-primary-700 hover:bg-primary-700;
}
</style>
