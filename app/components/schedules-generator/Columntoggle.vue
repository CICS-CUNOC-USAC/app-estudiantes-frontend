<template>
  <div class="relative" ref="containerRef">
    <button
      @click="open = !open"
      class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
    >
      <Icon name="lucide:columns-3" size="16" />
      Columnas
      <Icon name="lucide:chevron-down" size="14" :class="open ? 'rotate-180' : ''" class="transition-transform" />
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-1 z-20 bg-background border border-border rounded-lg shadow-md min-w-40 py-1"
      >
        <label
          v-for="col in columns"
          :key="col.key"
          class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 cursor-pointer select-none"
        >
          <Icon
            name="lucide:check"
            size="14"
            :class="visible[col.key] ? 'opacity-100' : 'opacity-0'"
            class="transition-opacity shrink-0"
          />
          {{ col.label }}
          <input
            type="checkbox"
            class="sr-only"
            :checked="visible[col.key]"
            @change="toggle(col.key)"
          />
        </label>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { ColumnDef } from '~/components/schedules-generator/ColumnToggle.types'

const props = defineProps<{
  columns: ColumnDef[]
  visible: Record<string, boolean>
}>()

const emit = defineEmits<{
  'update:visible': [visible: Record<string, boolean>]
}>()

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onClickOutside(containerRef, () => { open.value = false })

const toggle = (key: string) => {
  emit('update:visible', { ...props.visible, [key]: !props.visible[key] })
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>