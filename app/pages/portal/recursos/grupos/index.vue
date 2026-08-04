<template>
  <main class="pb-10">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Regresar al inicio"
        class="text-muted-color-emphasis mb-4"
        to="/"
      />
    </nav>

    <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 class="text-2xl font-semibold">
          <Icon name="icon-park-twotone:every-user" class="mr-2 inline-block" />
          Grupos de Cursos
        </h1>
        <p class="text-muted-color mt-2 max-w-2xl">
          Encuentra los grupos de cursos para el semestre actual
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <HelpDialog title="Grupos de Cursos" content-path="/help/groups" />
      </div>
    </header>

    <GroupFilters
      v-model:filters="filters"
      :periods="academicPeriods"
      :types="groupTypes"
      :platforms="platformOptions"
      :visibilities="visibilityOptions"
      @search="applyFilters"
      @clear="clearFilters"
    />

    <GroupResults
      :groups="filteredGroups"
      :loading="loading"
      :dashboard-mode="false"
      @refresh="reloadData"
      @join="joinGroup"
      @share="shareGroup"
      @sort="applySort"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import GroupFilters from '~/components/portal/grupos/GroupFilters.vue'
import GroupResults from '~/components/portal/grupos/GroupResults.vue'
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
//import { copyToClipboard } from '~/utils/clipboard'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { generateAcademicPeriods } from '../../../../../server/utils/generate-periods'
import { useCourseGroupsApi } from '../../../../composables/useGroupsApi';

const courseGroupsApi = useCourseGroupsApi()

const allGroups = ref<CourseGroup[]>([])
const loading = ref(false)
const sortOrder = ref('recent')
const filteredGroups = ref<CourseGroup[]>([])

const filters = ref({
  search: '',
  periodId: null as number | null,
  typeId: null as number | null,
  platform: null as string | null,
  visibility: null as string | null
})

const academicPeriods = ref<AcademicPeriod[]>([])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Laboratorio', slug: 'laboratorio', description: 'Grupo de laboratorio' },
  { id: 2, name: 'Curso', slug: 'curso', description: 'Grupo del curso' },
  { id: 3, name: 'Estudiantado', slug: 'estudiantado', description: 'Grupo de estudiantes del curso' }
])

const platformOptions = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const visibilityOptions = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])

async function loadAllGroups() {
  loading.value = true
  try {
    allGroups.value = await courseGroupsApi.list()
    applyFilters() // Aplicar filtros después de cargar
  } catch (error) {
    console.error('Error al cargar grupos:', error)
    toast.error('Error al cargar los grupos')
    allGroups.value = []
  } finally {
    loading.value = false
  }
}

//Pending
async function shareGroup(group: CourseGroup) {
  //const linkToCopy = group.link || `${window.location.origin}/grupos/${group.id}`
 // const success = await copyToClipboard(linkToCopy)
  
  if (true) {
    toast.success('Enlace copiado al portapapeles', {
      description: `Enlace del grupo ${group.courseCode} copiado`
    })
  } else {
    toast.error('No se pudo copiar el enlace', {
      description: 'Intenta copiar manualmente el enlace'
    })
  }
}

function applyFilters() {
  loading.value = true
  
  setTimeout(() => {
    let result = [...allGroups.value]
    
    if (filters.value.search) {
      const query = filters.value.search.toLowerCase()
      result = result.filter(g => 
        g.courseCode.toLowerCase().includes(query) ||
        g.courseNameCache.toLowerCase().includes(query)
      )
    }
    
    if (filters.value.periodId) {
      result = result.filter(g => g.academicPeriod.id === filters.value.periodId)
    }
    
    if (filters.value.typeId) {
      result = result.filter(g => g.type.id === filters.value.typeId)
    }

    if (filters.value.platform) {
      result = result.filter(g => g.platform === filters.value.platform)
    }
    
    if (filters.value.visibility) {
      result = result.filter(g => g.visibility === filters.value.visibility)
    }
    
    result = applySortToResult(result, sortOrder.value)
    
    filteredGroups.value = result
    loading.value = false
  }, 300)
}

function applySortToResult(result: CourseGroup[], order: string): CourseGroup[] {
  const sorted = [...result]
  switch (order) {
    case 'recent':
      return sorted.sort((a, b) => (b.id || 0) - (a.id || 0))
    case 'oldest':
      return sorted.sort((a, b) => (a.id || 0) - (b.id || 0))
    case 'az':
      return sorted.sort((a, b) => 
        (a.courseNameCache || '').localeCompare(b.courseNameCache || '')
      )
    case 'za':
      return sorted.sort((a, b) => 
        (b.courseNameCache || '').localeCompare(a.courseNameCache || '')
      )
    default:
      return sorted
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    periodId: null,
    typeId: null,
    platform: null,
    visibility: null
  }
  applyFilters()
}

function applySort(order: string) {
  sortOrder.value = order
  applyFilters()
}

function joinGroup(group: CourseGroup) {
  if (group.link) {
    window.open(group.link, '_blank')
    toast.success(`Uniéndote al grupo de ${group.courseNameCache}`)
  } else {
    toast.warning('Este grupo no tiene un enlace disponible')
  }
}

function reloadData() {
  toast.info('Actualizando datos...')
  loadAllGroups()
}

watch([() => filters.value, () => sortOrder.value], () => {
  applyFilters()
}, { deep: true })

onMounted(() => {
  academicPeriods.value = generateAcademicPeriods()
  loadAllGroups()
})

useCustomPageTitle('Grupos de cursos')

definePageMeta({
  title: 'Grupos de cursos',
})
</script>