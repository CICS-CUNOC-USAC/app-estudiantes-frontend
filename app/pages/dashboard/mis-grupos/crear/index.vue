<!-- app/pages/portal/grupos/crear/index.vue -->
<template>
  <GroupFormPage
    :periods="academicPeriods"
    :types="groupTypes"
    return-to="mis-grupos"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GroupFormPage from '~/components/portal/grupos/GroupFormPage.vue'
import type { CourseGroup, GroupType, AcademicPeriod } from '~/lib/api/strapi/types'

const academicPeriods = ref<AcademicPeriod[]>([
  { id: 1, name: '2024-2', code: '2024-2', current: true },
  { id: 2, name: '2024-1', code: '2024-1', current: false }
])

const groupTypes = ref<GroupType[]>([
  { id: 1, name: 'Estudio', slug: 'estudio', description: 'Grupo de estudio' },
  { id: 2, name: 'Ayudantía', slug: 'ayudantia', description: 'Ayudantía del curso' }
])

function handleSave(groupData: Partial<CourseGroup>) {
  console.log('Guardando grupo:', groupData)
}

definePageMeta({
  layout: 'dashboard',
})
</script>