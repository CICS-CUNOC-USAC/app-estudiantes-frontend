<template>
  <v-sheet rounded="lg" border>
    <v-data-table
      :items="data || []"
      :headers="headers"
      :search="teacherSearch"
      :loading="loading"
    >
      <template #item.name="{ item }">
        <span class="font-weight-medium">{{ item.name }}</span>
      </template>
      <template #item.pdfLink="{ item }">
        <v-btn
          density="default"
          size="small"
          :href="item.pdfLink"
          target="_blank"
          icon="mdi-open-in-new "
        />
      </template>
    </v-data-table>
  </v-sheet>
</template>
<script setup lang="ts">
import type { ScrapedProgram } from '~/utils/server/types/programs'
defineProps<{
  teacherSearch: string
  data: ScrapedProgram[] | null
  loading: boolean
}>()
const headers = [
  {
    title: 'Ver',
    key: 'pdfLink',
    sortable: false,
    filterable: false
  },
  {
    title: 'Curso',
    key: 'name',
    sortable: true,
    filterable: false
  },
  {
    title: 'Docente',
    key: 'teacher',
    sortable: true,
    filterable: true
  },
  {
    title: 'Cohorte',
    key: 'semester',
    sortable: true,
    filterable: false
  },
  {
    title: 'Año',
    key: 'year',
    sortable: true,
    filterable: false
  },
  {
    title: 'Sección',
    key: 'section',
    sortable: true,
    filterable: false
  }
]
</script>
<style lang="scss" scoped></style>
