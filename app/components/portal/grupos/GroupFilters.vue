<template>
  <section class="mt-8">
    <CCardAlt>
      <template #content>
        <div class="space-y-4">
          <div class="flex flex-col gap-3 md:flex-row">
            <CInputText
              :model-value="localFilters.search"
              placeholder="Buscar por código del curso"
              prepend-icon="icon-park-outline:search"
              clearable
              class="flex-1"
              @input="handleSearchInput"
            />
            <div class="flex gap-2">
              <Button
                variant="tonal"
                icon="icon-park-outline:refresh"
                label="Limpiar"
                @click="handleClear"
              />
              <Button
                icon="icon-park-outline:search"
                label="Buscar"
                @click="handleSearch"
              />
            </div>
          </div>

          <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <CSelect
              :model-value="localFilters.periodId"
              :items="periods"
              label="Período académico"
              id="periodo"
              prepend-icon="icon-park-twotone:calendar"
              placeholder="Seleccionar período"
              clearable
              option-label="name"
              option-value="id"
              @value-change="handleFilterChange('periodId', $event)"
            />

            <CSelect
              :model-value="localFilters.typeId"
              :items="types"
              label="Tipo de grupo"
              id="tipo"
              prepend-icon="icon-park-twotone:category-management"
              placeholder="Todos los tipos"
              clearable
              option-label="name"
              option-value="id"
              @value-change="handleFilterChange('typeId', $event)"
            />

            <CSelect
              :model-value="localFilters.platform"
              :items="platforms"
              label="Plataforma"
              id="plataforma"
              prepend-icon="icon-park-twotone:wechat"
              placeholder="Todas las plataformas"
              clearable
              option-label="label"
              option-value="value"
              @value-change="handleFilterChange('platform', $event)"
            />

            <CSelect
              :model-value="localFilters.visibility"
              :items="visibilities"
              label="Visibilidad"
              id="visibilidad"
              prepend-icon="icon-park-twotone:eyes"
              placeholder="Todas"
              clearable
              option-label="label"
              option-value="value"
              @value-change="handleFilterChange('visibility', $event)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-500">Filtros activos:</span>
            <span 
              v-for="filter in activeFilters" 
              :key="filter.key"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700"
            >
              {{ filter.label }}
              <button @click="removeFilter(filter.key)" class="hover:text-primary-900">
                <Icon name="lucide:x" class="w-3 h-3" />
              </button>
            </span>
            <span v-if="!activeFilters.length" class="text-sm text-gray-400">
              Ningún filtro activo
            </span>
          </div>
        </div>
      </template>
    </CCardAlt>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Types
interface Filters {
  search: string
  periodId: number | null
  typeId: number | null
  platform: string | null
  visibility: string | null
}

interface Props {
  filters: Filters
  periods: any[]
  types: any[]
  platforms: any[]
  visibilities: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: Filters]
  search: []
  clear: []
}>()


const localFilters = ref<Filters>({ ...props.filters })


watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

const activeFilters = computed(() => {
  const active: Array<{ key: string; label: string }> = []
  const f = localFilters.value
  
  if (f.search) {
    active.push({ key: 'search', label: `Búsqueda: "${f.search}"` })
  }
  if (f.periodId) {
    const period = props.periods.find(p => p.id === f.periodId)
    if (period) active.push({ key: 'periodId', label: `Período: ${period.name}` })
  }
  if (f.typeId) {
    const type = props.types.find(t => t.id === f.typeId)
    if (type) active.push({ key: 'typeId', label: `Tipo: ${type.name}` })
  }
  if (f.platform) {
    const platform = props.platforms.find(p => p.value === f.platform)
    if (platform) active.push({ key: 'platform', label: `Plataforma: ${platform.label}` })
  }
  if (f.visibility) {
    const visibility = props.visibilities.find(v => v.value === f.visibility)
    if (visibility) active.push({ key: 'visibility', label: `Visibilidad: ${visibility.label}` })
  }
  
  return active
})

const updateFilters = (newFilters: Partial<Filters>) => {
  const updated = { ...localFilters.value, ...newFilters }
  localFilters.value = updated
  emit('update:filters', updated)
}

const handleFilterChange = (key: keyof Filters, value: any) => {
  updateFilters({ [key]: value })
}

const handleSearchInput = (value: string) => {
  updateFilters({ search: value })
  // Auto-search on input (optional)
  // emit('search')
}

const handleSearch = () => {
  emit('search')
}

const handleClear = () => {
  const cleared: Filters = {
    search: '',
    periodId: null,
    typeId: null,
    platform: null,
    visibility: null
  }
  localFilters.value = cleared
  emit('update:filters', cleared)
  emit('clear')
}

const removeFilter = (key: string) => {
  const updates: Partial<Filters> = {}
  if (key === 'search') {
    updates.search = ''
  } else if (key === 'periodId') {
    updates.periodId = null
  } else if (key === 'typeId') {
    updates.typeId = null
  } else if (key === 'platform') {
    updates.platform = null
  } else if (key === 'visibility') {
    updates.visibility = null
  }
  updateFilters(updates)
  emit('search')
}
</script>