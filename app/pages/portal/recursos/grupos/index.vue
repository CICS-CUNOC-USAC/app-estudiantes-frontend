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

    <GroupFormModal
      ref="groupFormModalRef"
      v-model:open="showFormModal"
      :group="editingGroup"
      :periods="academicPeriods"
      :types="groupTypes"
      @save="saveGroup"
    />

  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import GroupFilters from '~/components/portal/grupos/GroupFilters.vue'
import GroupResults from '~/components/portal/grupos/GroupResults.vue'
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { groupsMock } from '../../../../../server/utils/mocks'



const allGroups = ref<CourseGroup[]>([...groupsMock])
const loading = ref(false)
const currentUserId = ref(100) 

const filters = ref({
  search: '',
  periodId: null as number | null,
  typeId: null as number | null,
  platform: null as string | null,
  visibility: null as string | null
})

const sortOrder = ref('recent')
const filteredGroups = ref<CourseGroup[]>([...allGroups.value])

const showFormModal = ref(false)
const editingGroup = ref<CourseGroup | null>(null)
const groupToDelete = ref<CourseGroup | null>(null)


const academicPeriods = ref<AcademicPeriod[]>([
  { id: 1, name: '2024-2', code: '2024-2', current: true },
  { id: 2, name: '2024-1', code: '2024-1', current: false },
  { id: 3, name: '2023-2', code: '2023-2', current: false }
])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Area Comun', slug: 'comun', description: 'Area comun' },
  { id: 2, name: 'Sistemas', slug: 'sistemas', description: 'Sistemas' },
  { id: 3, name: 'Mecanica', slug: 'mecanica', description: 'mecanica' }
])

const platformOptions = ref([
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' }
])

const visibilityOptions = ref([
  { label: 'Abierto', value: 'abierto' },
  { label: 'Privado', value: 'privado' }
])

function shareGroup(){
  //pending copy to clipboard
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
  switch (order) {
    case 'recent':
      return result.sort((a, b) => b.id - a.id)
    case 'oldest':
      return result.sort((a, b) => a.id - b.id)
    case 'az':
      return result.sort((a, b) => a.courseNameCache.localeCompare(b.courseNameCache))
    case 'za':
      return result.sort((a, b) => b.courseNameCache.localeCompare(a.courseNameCache))
    default:
      return result
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


function openEditModal(group: CourseGroup) {
  editingGroup.value = { ...group }
  showFormModal.value = true
}

function saveGroup(groupData: Partial<CourseGroup>) {
  loading.value = true
  
  setTimeout(() => {
    if (groupData.id) {
      const existingGroup = allGroups.value.find(g => g.id === groupData.id)
      if (existingGroup) {
        const index = allGroups.value.indexOf(existingGroup)
        allGroups.value[index] = updateGroup(existingGroup, groupData)
        toast.success('Grupo actualizado exitosamente')
      } else {
        toast.error('No se encontró el grupo a editar')
      }
    } else {
      const defaultType = groupTypes.value[0] || { id: 1, name: 'Estudio', slug: 'estudio' }
      const defaultPeriod = academicPeriods.value[0] || { id: 1, name: '2024-2', code: '2024-2', current: true }
      
      const newGroup: CourseGroup = {
        id: Math.max(...allGroups.value.map(g => g.id), 0) + 1,
        courseCode: groupData.courseCode || '',
        courseNameCache: groupData.courseNameCache || '',
        section: groupData.section,
        platform: groupData.platform || 'whatsapp',
        link: groupData.link || '',
        type: groupData.type ?? defaultType,
        academicPeriod: groupData.academicPeriod ?? defaultPeriod,
        visibility: groupData.visibility || 'abierto',
        lecturer: groupData.lecturer,
        createdByUserId: currentUserId.value,
        alternativeContact: groupData.alternativeContact,
        contactNotes: groupData.contactNotes,
        active: true
      }
      allGroups.value.push(newGroup)
      toast.success('Grupo creado exitosamente')
    }
    
    showFormModal.value = false
    editingGroup.value = null
    applyFilters()
    loading.value = false
  }, 500)
}

function updateGroup(existing: CourseGroup, data: Partial<CourseGroup>): CourseGroup {
  return {
    ...existing,
    ...(data.courseCode !== undefined && { courseCode: data.courseCode }),
    ...(data.courseNameCache !== undefined && { courseNameCache: data.courseNameCache }),
    ...(data.section !== undefined && { section: data.section }),
    ...(data.platform !== undefined && { platform: data.platform }),
    ...(data.link !== undefined && { link: data.link }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.academicPeriod !== undefined && { academicPeriod: data.academicPeriod }),
    ...(data.visibility !== undefined && { visibility: data.visibility }),
    ...(data.lecturer !== undefined && { lecturer: data.lecturer }),
    ...(data.alternativeContact !== undefined && { alternativeContact: data.alternativeContact }),
    ...(data.contactNotes !== undefined && { contactNotes: data.contactNotes }),
    ...(data.active !== undefined && { active: data.active })
  }
}

function deleteGroup() {
  if (!groupToDelete.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const index = allGroups.value.findIndex(g => g.id === groupToDelete.value!.id)
    if (index !== -1) {
      allGroups.value.splice(index, 1)
      toast.success('Grupo eliminado exitosamente')
    }
    
    groupToDelete.value = null
    applyFilters()
    loading.value = false
  }, 500)
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
  applyFilters()
}


watch([() => filters.value, () => sortOrder.value], () => {
  applyFilters()
}, { deep: true })

onMounted(() => {
  applyFilters()
})


useCustomPageTitle('Grupos de cursos')

definePageMeta({
  title: 'Grupos de cursos',
})

</script>