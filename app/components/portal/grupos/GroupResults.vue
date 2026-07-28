<template>
  <section class="mt-8">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 class="font-semibold">
        {{ groups.length }} grupo{{ groups.length !== 1 ? 's' : '' }} encontrado{{ groups.length !== 1 ? 's' : '' }}
      </h2>
      <div class="flex items-center gap-2">
        <Button
          variant="text"
          icon="icon-park-outline:refresh"
          label="Actualizar"
          @click="emit('refresh')"
        />
        <CSelect
          :model-value="sortOrder"
          :items="sortOptions"
          label="Ordenar por"
          id="orden"
          no-borders
          class="w-40"
          clearable
          option-label="label"
          option-value="value"
          @value-change="handleSortChange"
        />
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <CCardAlt v-for="n in 6" :key="n" class="animate-pulse">
        <template #content>
          <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </template>
      </CCardAlt>
    </div>

    <div v-else-if="groups.length === 0" class="text-center py-12">
      <CMessage
        :title="emptyTitle"
        :subtitle="emptySubtitle"
        variant="info"
      />
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <GroupCard
        v-for="group in groups"
        :key="group.id"
        :group="group"
        :is-owner="isOwner(group)"
        @edit="(g) => emit('edit', g)"
        @delete="(g) => emit('delete', g)"
        @join="(g) => emit('join', g)"
        @share="(g) => emit('share', g)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CourseGroup } from '~/lib/api/strapi/types'

interface Props {
  groups: CourseGroup[]
  loading?: boolean
  emptyTitle?: string
  emptySubtitle?: string
  userId?: number
  sortOptions?: Array<{ label: string; value: string }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyTitle: 'No se encontraron grupos',
  emptySubtitle: 'Intenta ajustar los filtros o crea un nuevo grupo',
  userId: 0,
  sortOptions: () => [
    { label: 'Más recientes', value: 'recent' },
    { label: 'Más antiguos', value: 'oldest' },
    { label: 'A-Z', value: 'az' },
    { label: 'Z-A', value: 'za' }
  ]
})

const emit = defineEmits<{
  refresh: []
  edit: [group: CourseGroup]
  delete: [group: CourseGroup]
  join: [group: CourseGroup]
  share: [group: CourseGroup]
  sort: [order: string]
}>()


const sortOrder = ref('recent')

const isOwner = (group: CourseGroup): boolean => {
  return group.createdByUserId === props.userId
}

const handleSortChange = (value: string) => {
  sortOrder.value = value
  emit('sort', value)
}
</script>