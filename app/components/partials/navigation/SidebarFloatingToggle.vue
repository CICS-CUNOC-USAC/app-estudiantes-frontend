<script setup lang="ts">
import { useSidebar } from '~/components/ui/sidebar'

const { open, toggleSidebar } = useSidebar()
</script>

<template>
  <button
    type="button"
    class="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 size-6 items-center justify-center rounded-full border-2 border-black bg-card shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-[left] duration-200 ease-linear hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px cursor-pointer select-none pointer-events-auto"
    :style="{ left: open ? 'calc(var(--sidebar-width) - 0.75rem)' : '0.375rem' }"
    :aria-label="open ? 'Colapsar barra lateral' : 'Expandir barra lateral'"
    :title="open ? 'Colapsar barra lateral' : 'Expandir barra lateral'"
    @click="toggleSidebar"
  >
    <Icon
      :name="open ? 'lucide:chevron-left' : 'lucide:chevron-right'"
      class="size-3"
      style="pointer-events: none"
      aria-hidden="true"
    />
  </button>
</template>
