<template>
  <v-sheet rounded="lg" border>
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
      <!-- <template #item="{ item }">
        <tr class="programs-table__row--desktop">
          <td>
            <div class="d-flex flex-column ga-2 py-2">
              <v-tooltip text="Ver programa">
                <template #activator="{ props }">
                  <v-btn
                    class="flex-grow-1 px-6"
                    density="comfortable"
                    size="small"
                    :to="`/portal/general/cursos/programa/${item.id}`"
                    icon="mdi-eye"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>

              <v-tooltip text="Descargar programa">
                <template #activator="{ props }"
                  ><v-btn
                    class="flex-grow-1 px-6"
                    density="comfortable"
                    size="small"
                    :href="item.pdfLink"
                    target="_blank"
                    icon="mdi-download"
                    v-bind="props"
                /></template>
              </v-tooltip>
            </div>
          </td>
          <td>
            <span class="font-weight-medium">{{ item.name }}</span>
          </td>
          <td>{{ item.teacher }}</td>
          <td>{{ item.semester }}</td>
          <td>{{ item.year }}</td>
          <td>{{ item.section }}</td>
        </tr>
      </template> -->
    </v-data-table>
  </v-sheet>
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { ScrapedProgram } from '~/utils/server/types/programs'

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
