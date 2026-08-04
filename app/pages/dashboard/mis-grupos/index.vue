<template>
  <main class="pb-10">
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
          @click="navigateTo('/dashboard/mis-grupos/crear')"
        />
      </div>
    </header>

    <GroupResults
      :groups="myGroups"
      :loading="loading"
      :user-id="currentUserId"
      :dashboard-mode="true"
      empty-title="No has creado ningún grupo"
      empty-subtitle="Crea tu primer grupo de estudio para compartir con otros estudiantes"
      @refresh="loadMyGroups"
      @edit="handleEdit"
      @delete="confirmDelete"
      @join="joinGroup"
      @sort="applySort" 
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
import ConfirmDialog from '~/components/dialogs/ConfirmDialog.vue'
import type { CourseGroup } from '~/lib/api/strapi/types'
import { useCourseGroupsApi } from '../../../composables/useGroupsApi';

const courseGroupsApi = useCourseGroupsApi()

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.profile?.id || 0)

const confirmDialogRef = ref<InstanceType<typeof ConfirmDialog>>()

const myGroups = ref<CourseGroup[]>([])
const loading = ref(false)
const sortOrder = ref('recent')
const groupToDelete = ref<CourseGroup | null>(null)


async function loadMyGroups() {
  if (!currentUserId.value) {
    toast.warning('No se pudo identificar al usuario')
    return
  }

  loading.value = true
  try {
    const allGroups = await courseGroupsApi.list()
    
    myGroups.value = allGroups.filter(g => g.createdByUserId === currentUserId.value)
    myGroups.value = applySortToResult(myGroups.value, sortOrder.value)
  } catch (error) {
    console.error('Error al cargar grupos:', error)
    toast.error('Error al cargar tus grupos')
    myGroups.value = []
  } finally {
    loading.value = false
  }
}

function applySortToResult(result: CourseGroup[], order: string): CourseGroup[] {
  switch (order) {
    case 'recent':
      return [...result].sort((a, b) => (b.id || 0) - (a.id || 0))
    case 'oldest':
      return [...result].sort((a, b) => (a.id || 0) - (b.id || 0))
    case 'az':
      return [...result].sort((a, b) => 
        (a.courseNameCache || '').localeCompare(b.courseNameCache || '')
      )
    case 'za':
      return [...result].sort((a, b) => 
        (b.courseNameCache || '').localeCompare(a.courseNameCache || '')
      )
    default:
      return result
  }
}

function applySort(order: string) {
  sortOrder.value = order
  loadMyGroups()
}

function handleEdit(group: CourseGroup) {
  navigateTo(`/dashboard/mis-grupos/${group.id}/editar`)
}

function confirmDelete(group: CourseGroup) {
  groupToDelete.value = group
  confirmDialogRef.value?.show()
}

async function deleteGroup() {
  if (!groupToDelete.value) return
  
  loading.value = true
  
  try {
    await courseGroupsApi.remove(String(groupToDelete.value.id))
    toast.success('Grupo eliminado exitosamente')
    groupToDelete.value = null
    await loadMyGroups()
  } catch (error) {
    console.error('Error al eliminar grupo:', error)
    toast.error('Error al eliminar el grupo')
  } finally {
    loading.value = false
  }
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

definePageMeta({
  layout: 'dashboard'
})
</script>