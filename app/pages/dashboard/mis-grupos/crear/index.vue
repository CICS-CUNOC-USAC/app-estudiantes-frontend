<template>
  <GroupCreateForm
    :periods="academicPeriods"
    :types="groupTypes"
    @save="handleSave"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import GroupCreateForm from '~/components/portal/grupos/GroupCreateForm.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'
import { generateAcademicPeriods } from '../../../../../server/utils/generate-periods';

const router = useRouter()
const academicPeriods = ref<AcademicPeriod[]>([])


const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Laboratorio', slug: 'laboratorio', description: 'Grupo de laboratorio' },
  { id: 2, name: 'Curso', slug: 'curso', description: 'Grupo del curso' },
  { id: 3, name: 'Estudiantado', slug: 'estudiantado', description: 'Grupo de estudiantes del curso' }
])

function handleSave(groupData: Partial<CourseGroup>) {
  //Lógica de creación (POST a la API)
  toast.success('Grupo creado exitosamente')
  router.push('/dashboard/mis-grupos')
}

function handleCancel() {
  router.push('/dashboard/mis-grupos')
}

onMounted(() => {
  academicPeriods.value = generateAcademicPeriods()
})

definePageMeta({
  layout: 'dashboard'
})
</script>