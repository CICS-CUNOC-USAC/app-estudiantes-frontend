<template>
  <h1 class="mb-4">{{ tittle }}</h1>
  <v-table class="elevation-1 rounded-lg">
    <thead>
      <tr>
        <th class="text-center">Hora</th>
        <th class="text-center">Lunes/Miercoles/Viernes</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="line in line_schedule" :key="line.start_time">
        <th class="text-center fixed-column">
          {{ line.start_time }} - {{ line.end_time }}
        </th>
        <td class="py-1 px-1">
          <v-container class="d-inline-flex py-0 px-0">
            <CoursePill
              v-for="course in line.courses"
              :key="course.id"
              :curso="course"
            />
          </v-container>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import type { Course, LineSchedule } from '~/utils/types/schedule-courses'
import CoursePill from './CoursePill.vue'
export default {
  name: 'ClassScheduleV3',
  components: { CoursePill },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    courses: {
      type: Array as () => Array<Course>,
      required: false
    },
    tittle: {
      type: String,
      default: 'Horario de Clases V3',
      required: false
    }
  },
  data() {
    return {
      version: 3,
      line_schedule: [] as Array<LineSchedule>
    }
  },
  methods: {}
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
