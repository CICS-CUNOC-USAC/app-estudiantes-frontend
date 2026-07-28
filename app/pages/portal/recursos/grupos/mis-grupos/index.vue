
<template>
  <main class="pb-10">
    <nav>
      <Button
        icon="icon-park-outline:arrow-left"
        variant="link"
        label="Volver a grupos"
        class="text-muted-color-emphasis mb-4"
        to="/portal/recursos/grupos"
      />
    </nav>

    <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 class="text-2xl font-semibold">
          <Icon name="icon-park-twotone:right-user" class="mr-2 inline-block" />
          Mis Grupos
        </h1>
        <p class="text-muted-color mt-2 max-w-2xl">
          Gestiona los grupos de curso que has creado
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <Button
          label="Crear grupo"
          icon="icon-park-outline:plus"
          @click="openCreateModal"
        />
        <HelpDialog title="Mis Grupos" content-path="/help/groups" />
      </div>
    </header>

    <GroupResults
      :groups="myGroups"
      :loading="loading"
      :user-id="currentUserId"
      empty-title="No has creado ningún grupo"
      empty-subtitle="Crea tu primer grupo de estudio para compartir con otros estudiantes"
      @refresh="loadMyGroups"
      @edit="openEditModal"
      @delete="confirmDelete"
      @join="joinGroup"
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

    <ConfirmDialog
      ref="confirmDialogRef"
      title="¿Eliminar grupo?"
      :description="`¿Estás seguro de que quieres eliminar el grupo: '(${groupToDelete?.courseCode}) ${groupToDelete?.courseNameCache}'?`"
      confirm-label="Eliminar"
      confirm-severity="danger"
      confirm-icon="icon-park-twotone:delete"
      @confirm="deleteGroup"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import GroupResults from '~/components/portal/grupos/GroupResults.vue'
import GroupFormModal from '~/components/portal/grupos/GroupFormModal.vue'
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import HelpDialog from '~/components/dialogs/help/HelpDialog.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { groupsMock } from '../../../../../../server/utils/mocks';

const groupFormModalRef = ref<InstanceType<typeof GroupFormModal>>()
const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()

const allGroups = ref<CourseGroup[]>([...groupsMock])
const myGroups = ref<CourseGroup[]>([])
const loading = ref(false)
const currentUserId = ref(100) // TODO: Get from auth store
const sortOrder = ref('recent')

const showFormModal = ref(false)
const editingGroup = ref<CourseGroup | null>(null)
const groupToDelete = ref<CourseGroup | null>(null)


const academicPeriods = ref<AcademicPeriod[]>([
  { id: 1, name: '2024-2', code: '2024-2', current: true },
  { id: 2, name: '2024-1', code: '2024-1', current: false }
])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Area Comun', slug: 'estudio', description: 'Grupo de estudio' },
  { id: 2, name: 'Ayudantía', slug: 'ayudantia', description: 'Ayudantía del curso' }
])


function loadMyGroups() {
  loading.value = true
  setTimeout(() => {
    myGroups.value = allGroups.value.filter(
      g => g.createdByUserId === currentUserId.value
    )
    myGroups.value = applySortToResult(myGroups.value, sortOrder.value)
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

function applySort(order: string) {
  sortOrder.value = order
  loadMyGroups()
}

function openCreateModal() {
  editingGroup.value = null
  showFormModal.value = true
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
    loadMyGroups()
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

function confirmDelete(group: CourseGroup) {
  groupToDelete.value = group
  confirmDialogRef.value?.show()
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
    loadMyGroups()
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


onMounted(() => {
  loadMyGroups()
})
/*
definePageMeta({
  middleware: 'auth'
})*/
</script>