<template>
  <PButton
    class="inline-flex overflow-hidden items-center rounded-full border border-gray-300 bg-surface-100 py-0.5  gap-1 px-3 text-sm text-gray-800  duration-100 ease-in-out hover:bg-surface-300 dark:border-gray-700 dark:bg-gray-700 dark:text-cics-white dark:hover:bg-gray-500 focus-visible:outline focus-visible:outline-primary-300 focus-visible:outline-offset-1"
    :class="{ 'chip-active': enabled }"
    @click="toggleEnabled"
    :label
    unstyled
  >
    <template #icon>
      <Icon :name="icon" v-if="icon"
      class="icon-chip"
        :class="{
          '-translate-x-6 opacity-0 w-0': !enabled && filter,
        }"
      
      /> 
    </template>
  </PButton>
</template>

<script setup lang="ts">
defineProps<{
  label: string // Etiqueta para el chip
  icon?: string // Ícono opcional
  filter?: boolean // Indica si el chip actúa como filtro
}>()

const enabled = defineModel({
  default: false,
  type: Boolean
})

const emit = defineEmits<{
  (e: 'change', value: boolean): void
}>()

const toggleEnabled = () => {
  enabled.value = !enabled.value
  emit('change', enabled.value)
}
</script>

<style scoped lang="postcss">
.chip-active {
  @apply border-primary-400 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700;
}

.icon-chip {
  /* transition: width 0.2s ease-in-out, transform 0.2s ease-in-out, opacity 0.2s ease-in-out; */
  @apply transition-all duration-200 ease-in-out will-change-[width];
  }
</style>
