<template>
  <div class="space-y-3">
    <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
      {{ group.courseNameCache }}
    </h3>

    <div class="flex flex-wrap gap-1.5">
      <span 
        class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
        :class="platformColor"
      >
        <Icon :name="platformIcon" class="w-3 h-3" />
        {{ group.platform }}
      </span>
      
      <span 
        class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full"
        :class="visibilityColor"
      >
        <Icon :name="visibilityIcon" class="w-3 h-3" />
        {{ group.visibility }}
      </span>
      
      <span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        {{ group.type.name }}
      </span>

      <span v-if="group.academicPeriod.current" 
        class="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
        <Icon name="lucide:check-circle" class="w-3 h-3" />
        Actual
      </span>
    </div>

    <div v-if="group.lecturer" class="text-sm">
      <span class="text-gray-500">Docente: </span>
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ group.lecturer.fullName }}</span>
    </div>
    
    <div v-else-if="group.alternativeContact" class="text-sm">
      <span class="text-gray-500">Contacto:</span>
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ group.alternativeContact }}</span>
    </div>

    <p v-if="group.contactNotes" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
      {{ group.contactNotes }}
    </p>

    <Button
      label="Unirse al grupo"
      icon="icon-park-outline:link"
      icon-pos="right"
      size="sm"
      class="w-full mt-2"
      @click="$emit('join', group)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CourseGroup } from '~/lib/api/strapi/types'

interface Props {
  group: CourseGroup
}

const props = defineProps<Props>()

const emit = defineEmits<{
  join: [group: CourseGroup]
}>()

const platformColor = computed(() => {
  return props.group.platform === 'whatsapp' 
    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
})

const platformIcon = computed(() => {
  return props.group.platform === 'whatsapp' 
    ? 'icon-park-twotone:messages-one'
    : 'icon-park-twotone:messages'
})

const visibilityColor = computed(() => {
  return props.group.visibility === 'abierto'
    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
})

const visibilityIcon = computed(() => {
  return props.group.visibility === 'abierto'
    ? 'lucide:unlock'
    : 'lucide:lock'
})
</script>