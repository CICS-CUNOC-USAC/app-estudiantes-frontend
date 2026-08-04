<!-- app/pages/dashboard/mis-grupos/[courseId]/editar/index.vue -->
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
import { generateAcademicPeriods } from '~~/server/utils/generate-periods'
import { useCourseGroupsApi } from '../../../../../composables/useGroupsApi';

const route = useRoute()
const router = useRouter()

const courseGroupsApi = useCourseGroupsApi()

const loading = ref(true)
const groupData = ref<CourseGroup | null>(null)

const academicPeriods = ref<AcademicPeriod[]>([])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Laboratorio', slug: 'laboratorio', description: 'Grupo de laboratorio' },
  { id: 2, name: 'Curso', slug: 'curso', description: 'Grupo del curso' },
  { id: 3, name: 'Estudiantado', slug: 'estudiantado', description: 'Grupo de estudiantes del curso' }
])

const groupId = computed(() => String(route.params.courseId))

async function fetchGroupById(id: string) {
  loading.value = true
  try {
    groupData.value = await courseGroupsApi.get(id)
    
    if (!groupData.value) {
      toast.error('Grupo no encontrado')
      router.push('/dashboard/mis-grupos')
    }
  } catch (error) {
    console.error('Error al cargar grupo:', error)
    toast.error('Error al cargar el grupo')
    router.push('/dashboard/mis-grupos')
  } finally {
    loading.value = false
  }
}

async function handleSave(data: Partial<CourseGroup>) {
  try {
    await courseGroupsApi.update(groupId.value, data)
    toast.success('Grupo actualizado exitosamente')
    router.push('/dashboard/mis-grupos')
  } catch (error) {
    console.error('Error al actualizar grupo:', error)
    toast.error('Error al actualizar el grupo')
  }
}

function handleCancel() {
  router.push('/dashboard/mis-grupos')
}

onMounted(() => {
  academicPeriods.value = generateAcademicPeriods()
  fetchGroupById(groupId.value)
})

definePageMeta({
  layout: 'dashboard'
})
</script>