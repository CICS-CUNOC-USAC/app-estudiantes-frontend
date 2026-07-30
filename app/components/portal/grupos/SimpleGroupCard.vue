<!-- app/components/portal/grupos/SimpleGroupCard.vue -->
<template>
  <CCardAlt 
    :title="group.courseCode"
    :small="group.section ? `Sección: ${group.section}` : 'Sin sección'"
    interactive
    class="h-full transition-all hover:shadow-lg"
  >
    <template #content>
      <GroupView 
        :group="group" 
        @join="$emit('join', $event)"
      />
    </template>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ group.academicPeriod.name }}
        </span>
        <KebabMenu>
          <template #title>
            <h2 class="mb-2 font-semibold">Opciones</h2>
          </template>
          <div class="flex flex-col gap-1">
            <button class="menu-item" @click="$emit('share', group)">
              Compartir
            </button>
          </div>
        </KebabMenu>
      </div>
    </template>
  </CCardAlt>
</template>

<script setup lang="ts">
import type { CourseGroup } from '~/lib/api/strapi/types'
import GroupView from './GroupView.vue'

interface Props {
  group: CourseGroup
}

defineProps<Props>()

const emit = defineEmits<{
  join: [group: CourseGroup]
  share: [group: CourseGroup]
}>()
</script>