<template>
  <h1 class="mb-4">{{ tittle }}</h1>
  <v-table class="elevation-1 rounded-lg">
    <thead>
      <tr>
        <th class="text-center hour_column">Hora</th>
        <th class="text-center">Lunes/Miercoles/Viernes</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="line in lines_schedule" :key="line.start_time">
        <th class="text-center fixed-column">
          {{ printFormatTime(line.start_time) }} -
          {{ printFormatTime(line.end_time) }}
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
      lines_schedule: [] as Array<LineSchedule>,
      times_key: new Map<string, number>()
    }
  },
  mounted() {
    this.createHourColumn()
    this.fillSchedule()
  },
  methods: {
    fillSchedule() {
      this.courses.forEach((course) => {
        course.periods.forEach((period) => {
          const key = `${period.start_time}-${period.end_time}`
          console.log(key)
          console.log(period)
          const index = this.times_key.get(key)
          console.log('index', index)
          if (index !== undefined) {
            this.lines_schedule[index].courses.push(course)
          }
        })
      })
    },
    createHourColumn() {
      const startTime = new Date()
      startTime.setHours(13, 40, 0, 0) // Establecer hora inicial a 13:40:00
      const endTime = new Date()
      endTime.setHours(21, 10, 0, 0) // Establecer hora final a 21:10:00

      const interval = 50 // Intervalo de 50 minutos
      let currentTime = startTime

      while (currentTime <= endTime) {
        const start: string = currentTime.toTimeString().split(' ')[0]
        currentTime = this.addMinutes(currentTime, interval)
        const end: string = currentTime.toTimeString().split(' ')[0]
        this.times_key.set(`${start}-${end}`, this.lines_schedule.length)
        this.lines_schedule.push({
          start_time: start,
          end_time: end,
          courses: []
        })
      }
    },
    addMinutes(date: Date, minutes: number): Date {
      return new Date(date.getTime() + minutes * 60000)
    },
    printFormatTime(date: string): string {
      // El formato es el siguiente: HH:mmm:ss y se debe retornar HH:mm
      return date.split(':').slice(0, 2).join(':')
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

.hour_column {
  width: 50px;
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
