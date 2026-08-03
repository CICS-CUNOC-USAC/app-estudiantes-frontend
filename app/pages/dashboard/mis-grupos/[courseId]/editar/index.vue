<template>
  <div v-if="loading" class="flex items-center justify-center h-64">
    <p class="text-gray-500">Cargando grupo...</p>
  </div>
  <GroupEditForm
    v-else-if="groupData"
    :group="groupData"
    :periods="academicPeriods"
    :types="groupTypes"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import GroupEditForm from '~/components/portal/grupos/GroupEditForm.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { groupsMock } from '../../../../../../server/utils/mocks';

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const groupData = ref<CourseGroup | null>(null)

const academicPeriods = ref<AcademicPeriod[]>([
  { id: 1, name: '2024-2', code: '2024-2', current: true },
  { id: 2, name: '2024-1', code: '2024-1', current: false }
])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Area Comun', slug: 'estudio', description: 'Grupo de estudio' },
  { id: 2, name: 'Ayudantía', slug: 'ayudantia', description: 'Ayudantía del curso' }
])

const groupId = computed(() => String(route.params.courseId))

async function fetchGroupById(id: string) {
  loading.value = true
  try {
    // TODO: Reemplazar con llamada real a la API
    // const response = await $api<CourseGroup>(`/grupos/${id}`)
    // groupData.value = response
    
    const found = groupsMock.find(g => g.courseCode === id)
    groupData.value = found || null
    
    if (!groupData.value) {
      toast.error('Grupo no encontrado')
      router.push('/dashboard/mis-grupos')
    }
  } catch (error) {
    toast.error('Error al cargar el grupo')
    router.push('/dashboard/mis-grupos')
  } finally {
    loading.value = false
  }
}

function handleSave(data: Partial<CourseGroup>) {
  toast.success('Grupo actualizado exitosamente')
  router.push('/dashboard/mis-grupos')
}

function handleCancel() {
  router.push('/dashboard/mis-grupos')
}

onMounted(() => {
  fetchGroupById(groupId.value)
})

definePageMeta({
  layout: 'dashboard'
})
</script>