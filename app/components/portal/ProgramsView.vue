<template>
  <PDataTable :value="mocks" unstyled
    class="w-full"
  >
    <PColumn field="code" header="Code"
    class="text-center"
    ></PColumn>
    <PColumn field="name" header="Name"
    class="text-center"
    ></PColumn>
    <PColumn field="category" header="Category"
    class="text-center"
    ></PColumn>
    <PColumn field="quantity" header="Quantity"
    class="text-center"
    ></PColumn>
  </PDataTable>
  <!-- <v-sheet rounded="lg" border>
    <v-data-table
      :items="data || []"
      :headers="headers"
      :search="teacherSearch"
      :loading="loading"
      :mobile="smAndDown"
      class="programs-table"
    >
      <template #item.pdfLink="{ item }">
        <div class="d-flex flex-lg-column ga-2 py-2">
          <v-btn
            size="small"
            :to="`/portal/general/cursos/programa/${item.id}`"
            prepend-icon="mdi-eye-outline"
            variant="tonal"
            text="Ver"
          />

          <v-btn
            size="small"
            :href="item.pdfLink"
            target="_blank"
            prepend-icon="mdi-download-outline"
            variant="tonal"
            text="Descargar"
          />
        </div>
      </template>
      <template #item.name="{ item }">
        <span class="font-weight-medium">{{ item.name }}</span>
      </template>
    </v-data-table>
  </v-sheet> -->
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { ScrapedProgram } from '~/utils/server/types/programs'

const mocks = [
  { code: '1', name: 'Name 1', category: 'Category 1', quantity: 1 },
  { code: '2', name: 'Name 2', category: 'Category 2', quantity: 2 },
  { code: '3', name: 'Name 3', category: 'Category 3', quantity: 3 },
  { code: '4', name: 'Name 4', category: 'Category 4', quantity: 4 },
  { code: '5', name: 'Name 5', category: 'Category 5', quantity: 5 }
]

const display = useDisplay()

const { smAndDown } = display

defineProps<{
  teacherSearch: string
  data: ScrapedProgram[] | null
  loading: boolean
}>()
const headers = [
  {
    title: 'Acciones',
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
<style lang="scss" scoped>
.programs-table {
  // @media (max-width: 500px) {
  //   // &__row--desktop {
  //   //   display: none;
  //   // }
  //   :deep() {
  //     .v-table__wrapper thead {
  //       display: none;
  //     }
  //   }
  // }
}
</style>
