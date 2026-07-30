<!-- app/components/portal/grupos/DashboardGroupCard.vue -->
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
        <div class="flex items-center gap-1">
          <Button
            variant="text"
            size="icon-sm"
            icon="icon-park-twotone:edit"
            @click.stop="$emit('edit', group)"
          />
          <Button
            variant="text"
            size="icon-sm"
            severity="danger"
            icon="icon-park-outline:delete"
            @click.stop="$emit('delete', group)"
          />
        </div>
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
  edit: [group: CourseGroup]
  delete: [group: CourseGroup]
  join: [group: CourseGroup]
}>()
</script>