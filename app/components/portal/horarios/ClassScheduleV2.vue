<template>
  <h1 class="mb-4">{{ tittle }}</h1>
  <v-table class="elevation-1 rounded-lg">
    <thead>
      <tr>
        <th style="width: 150px" class="text-center">Hora</th>
        <th class="text-center">Lunes/Miercoles/Viernes</th>
        <!-- <th colspan="12" class="text-center">Miercoles</th>
          <th colspan="12" class="text-center">Viernes</th> -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in line_schedule" :key="item.start_time">
        <td class="text-center fixed-column">
          {{ item.start_time }} - {{ item.end_time }}
        </td>
        <td class="py-2 px-1">
          <v-select
            class="h-auto course-select"
            variant="outlined"
            :item-props="itemPromp"
            :items="item.courses"
            label="Seleccione"
          ></v-select>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import type { Course, LineSchedule } from '~/utils/types/schedule-courses'

export default {
  name: 'ClassScheduleV2',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    courses: {
      type: Array as () => Array<Course>,
      required: false
    },
    tittle: {
      type: String,
      default: 'Horario de Clases V2',
      required: false
    }
  },
  data() {
    return {
      version: 3,
      line_schedule: [] as Array<LineSchedule>
    }
  },
  methods: {
    itemPromp(item: LineSchedule) {
      return {
        title: item.courses[0].career_course.course.name,
        subtitle: `Semestre: ${item.courses[0].career_course.semester}, Salon: ${item.courses[0].classroom.name}`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.course-select {
  :deep(.v-input__details) {
    display: none;
  }
}

.combo_line {
  padding: 0px;
}

.text-center {
  text-align: center;
}

.fixed-column {
  position: sticky;
  left: 0;
  z-index: 1;
  // --v-theme-overlay-multiplier: var(--v-theme-accent-3-overlay-multiplier);
  background-color: rgb(var(--v-theme-accent-3)) !important;
  color: rgb(var(--v-theme-on-accent-3)) !important;
}

thead tr th {
  position: sticky;
  top: 0;
  z-index: 2;
  // --v-theme-overlay-multiplier: var(--v-theme-accent-3-overlay-multiplier);
  background-color: rgb(var(--v-theme-accent-3)) !important;
  color: rgb(var(--v-theme-on-accent-3)) !important;
}
</style>
