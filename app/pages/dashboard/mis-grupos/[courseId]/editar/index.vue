<!-- app/pages/portal/grupos/[id]/editar/index.vue -->
<template>
  <GroupFormPage
    :group="editingGroup"
    :periods="academicPeriods"
    :types="groupTypes"
    return-to="mis-grupos"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GroupFormPage from '~/components/portal/grupos/GroupFormPage.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'

const route = useRoute()
const router = useRouter()

// Estado
const editingGroup = ref<CourseGroup | null>(null)
const loading = ref(true)

// Datos de catálogo (mock)
const academicPeriods = ref<AcademicPeriod[]>([
  { id: 1, name: '2024-2', code: '2024-2', current: true },
  { id: 2, name: '2024-1', code: '2024-1', current: false }
])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Estudio', slug: 'estudio', description: 'Grupo de estudio' },
  { id: 2, name: 'Ayudantía', slug: 'ayudantia', description: 'Ayudantía del curso' }
])

// Cargar datos del grupo a editar
async function loadGroup() {
  const id = Number(route.params.id)
  
  // Mock: buscar en los datos mock
  const allGroups = [...groupsMock]
  const found = allGroups.find(g => g.id === id)
  
  if (found) {
    editingGroup.value = found
  } else {
    // Si no se encuentra, redirigir
    //toast.error('Grupo no encontrado')
    router.push('/portal/grupos/mis-grupos')
  }
  
  loading.value = false
}

function handleSave(groupData: Partial<CourseGroup>) {

  console.log('Actualizando grupo:', groupData)
}

onMounted(() => {
  loadGroup()
})

definePageMeta({
  layout: 'dashboard',
})
</script>