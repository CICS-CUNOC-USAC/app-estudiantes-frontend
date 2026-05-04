<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PanelLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    icon?: string
  }>(),
  {
    icon: 'icon-park-twotone:'
  }
)

const { toggleSidebar, state, open } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="link"
    :class="cn(
      'size-auto',
      props.class
    )"
    size="icon"
    @click="toggleSidebar"
  >
    <Icon
      :name="
        open
          ? 'icon-park-twotone:expand-right'
          : 'icon-park-twotone:expand-left'
      "
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
