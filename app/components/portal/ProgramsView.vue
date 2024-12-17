<template>
  <PDataTable
    :value="data"
    v-model:filters="filters"
    pt:root:class="max-w-5xl mx-auto"
    :loading
    pt:tableContainer:class="rounded-xl max-w-5xl mx-auto  border border-black "
    pt:mask:class="rounded-xl max-w-5xl mx-auto"
  >

  <!-- <DataTable>
    <template #></template>

  </DataTable> -->
    <PColumn field="" header="Acciones" class="w-min text-center">
      <template #body="slotProps">
        <div class="flex flex-col items-center justify-center gap-y-2">
          <CButton
            :to="`/portal/general/cursos/programa/${slotProps.data.id}`"
            icon="lucide:eye"
            fluid
            size="small"
            variant="tonal"
            label="Ver"
          />

          <CButton
            :href="slotProps.data.pdfLink"
            icon="lucide:download"
            fluid
            size="small"
            variant="tonal"
            label="Descargar"
          />
        </div>
      </template>
    </PColumn>
    <PColumn field="name" header="Nombre" class="text-center"></PColumn>
    <PColumn field="teacher" header="Docente" class="text-center">
      <!-- <template  #filter="{ filterModel, filterCallback }">
        <PInputText v-model="filterModel.value" placeholder="Buscar docente" type="text" @input="filterCallback" />
      </template> -->
    </PColumn>
    <PColumn field="semester" header="Cohorte" class="text-center"></PColumn>
    <PColumn field="year" header="Año" class="text-center"></PColumn>
    <PColumn field="section" header="Sección" class="text-center"></PColumn>

    <template #empty>
      <div class="text-center">
        <span class="text-sm font-semibold text-muted-color-emphasis">
          {{
            data?.length === 0 && !loading
              ? searchEmpty
                ? 'Escribe el nombre del curso para buscar los programas asociados.'
                : 'No hay datos disponibles, intenta con otro término de búsqueda.'
              : 'Cargando...'
          }}
        </span>
      </div>
    </template>
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
import type { ScrapedProgram } from '~/utils/server/types/programs'
import CButton from '../primitives/button/CButton.vue'
import { FilterMatchMode } from '@primevue/core/api'
import { DataTable } from 'primevue';

const { teacherSearch } = defineProps<{
  teacherSearch: string
  data: ScrapedProgram[] | null
  searchEmpty: boolean
  loading: boolean
}>()

const filters = ref({
  teacher: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

</script>
<style lang="scss" scoped></style>
