<template>
  <v-table class="elevation-1 rounded-lg" height="650px">
    <tr>
      <th class="header" rowspan="2" style="width: 150px">Hora</th>
      <th
        :colspan="classrooms!.length === 0 ? 1 : classrooms!.length"
        class="header"
      >
        Salón
      </th>
    </tr>
    <tr>
      <th v-for="classroom in classrooms" :key="classroom.id" class="header">
        {{ classroom.name }}
      </th>
    </tr>
    <tr v-for="hour in hours" :key="hour.id">
      <th class="text-center fixed-column">
        {{ hour.start_time + '-' + hour.end_time }}
      </th>
      <td v-for="classroom in classrooms" :key="classroom.id">
        <v-container
          v-for="schedule in schedules"
          :key="schedule.id"
          style="padding: 0px"
        >
          <CursoHorario
            v-if="
              schedule.periods[0].hour.start_time == hour.start_time &&
              schedule.classroom_id == classroom.id
            "
            :curso="schedule"
          />
        </v-container>
      </td>
    </tr>
  </v-table>
</template>

<script setup lang="ts">
import CursoHorario from '~/components/portal/horarios/CursoHorario.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

defineProps<{
  hours: Array<Hour>
  classrooms: Array<Classroom>
  schedules: Array<Course>
}>()

/*
export default {
  name: 'ClassScheduleV1',
  components: { CursoHorario },
  props: {
    courses: {
      type: Array as () => Array<Course>,
      required: false,
      default: new Array([])
    },
    tittle: {
      type: String,
      default: 'Horario de Clases V1',
      required: false
    }
  },
  data() {
    return {
      classroms: [] as Array<string>,
      headers: [
        { title: 'Hora', value: 'hora' },
        {
          title: 'Salón',
          children: [
            { title: '1', value: 's1' },
            { title: '3', value: 's2' },
            { title: '5', value: 's3' },
            { title: '6', value: 's4' },
            { title: '7', value: 's5' },
            { title: '8', value: 's6' },
            { title: '10', value: 's7' },
            { title: 'Salón Proyecciones', value: 's8' },
            { title: 'Salón TICS', value: 's9' },
            { title: 'Hugo Pineda', value: 's10' },
            { title: 'Salón Dibujo', value: 's11' },
            { title: 'Laboratorio de Aguas', value: 's12' }
          ]
        }
      ],
      items: [],
      response_items: [
        {
          hora: '13:40 - 14:30',
          cursos: [
            {
              curso: 'Manejo e Implementación de Archivos',
              docente: '',
              codigo: '2812',
              semestre: 'VI',
              codigo_salon: 's1',
              nombre_salon: '1'
            }
          ]
        },
        {
          hora: '14:30 - 15:20',
          cursos: [
            {
              curso: 'Organización de Lenguajes y Compiladores 2',
              docente: '',
              codigo: '2810',
              semestre: 'VI',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Introducción a la Programación 1',
              docente: '',
              codigo: '2796',
              semestre: 'III',
              codigo_salon: 's10',
              nombre_salon: 'Hugo Pineda'
            }
          ]
        },
        {
          hora: '15:20 - 16:10',
          cursos: [
            {
              curso: 'Arquitectura de Computadoras y Ensambladores 1',
              docente: '',
              codigo: '2811',
              semestre: 'VI',
              codigo_salon: 's1',
              nombre_salon: '1'
            }
          ]
        },
        {
          hora: '16:10 - 17:00',
          cursos: [
            {
              curso: 'Teoría de Sistemas 1',
              docente: '',
              codigo: '2808',
              semestre: 'VI',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Práctica Final',
              docente: '',
              codigo: '2829',
              semestre: 'X',
              codigo_salon: 's10',
              nombre_salon: 'Hugo Pineda'
            },
            {
              curso: 'Lenguajes Formales y de Programación',
              docente: '',
              codigo: '2798',
              semestre: 'IV',
              codigo_salon: 's11',
              nombre_salon: 'Salón Dibujo'
            }
          ]
        },
        {
          hora: '17:00 - 17:50',
          cursos: [
            {
              curso: 'Análisis y Diseño de Sistemas 1',
              docente: '',
              codigo: '2822',
              semestre: 'VIII',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Sistemas de Bases de Datos 2',
              docente: '',
              codigo: '2821',
              semestre: 'VIII',
              codigo_salon: 's2',
              nombre_salon: '3'
            },
            {
              curso: 'Matemática de Computo 2',
              docente: '',
              codigo: '2799',
              semestre: 'IV',
              codigo_salon: 's12',
              nombre_salon: 'Laboratorio de Aguas'
            }
          ]
        },
        {
          hora: '17:50 - 18:40',
          cursos: [
            {
              curso: 'Introducción a la Programación y Computación 2',
              docente: '',
              codigo: '2800',
              semestre: 'IV',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Redes de Computadoras 2',
              docente: '',
              codigo: '2820',
              semestre: 'VIII',
              codigo_salon: 's4',
              nombre_salon: '6'
            },
            {
              curso: 'Economía',
              docente: '',
              codigo: '2809',
              semestre: 'VI',
              codigo_salon: 's8',
              nombre_salon: 'Salón Proyecciones'
            },
            {
              curso: 'Seminario de Investigación',
              docente: '',
              codigo: '2837',
              semestre: 'X',
              codigo_salon: 's10',
              nombre_salon: 'Hugo Pineda'
            }
          ]
        },
        {
          hora: '18:40 - 19:30',
          cursos: [
            {
              curso: 'Software Avanzado',
              docente: '',
              codigo: '2836',
              semestre: 'X',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Investigación de Operaciones 1',
              docente: '',
              codigo: '685',
              semestre: 'VI',
              codigo_salon: 's4',
              nombre_salon: '6'
            },
            {
              curso: 'Seminario de Sistemas 1',
              docente: '',
              codigo: '2823',
              semestre: 'VIII',
              codigo_salon: 's10',
              nombre_salon: 'Hugo Pineda'
            }
          ]
        },
        {
          hora: '19:30 - 20:20',
          cursos: [
            {
              curso: 'Sistemas Operativos 2',
              docente: 'Ing. Otto Soto',
              codigo: '2819',
              semestre: 'VIII',
              codigo_salon: 's1',
              nombre_salon: '1'
            }
          ]
        },
        {
          hora: '20:20 - 21:10',
          cursos: [
            {
              curso: 'Sistemas de Bases de Datos 2',
              docente: '',
              codigo: '2821',
              semestre: 'VIII',
              codigo_salon: 's1',
              nombre_salon: '1'
            },
            {
              curso: 'Análisis y Diseño de Sistemas 1',
              docente: '',
              codigo: '2822',
              semestre: 'VIII',
              codigo_salon: 's2',
              nombre_salon: '3'
            },
            {
              curso: 'Sistemas Organizacionales y Gerenciales 2',
              docente: 'Ing. Otto Soto',
              codigo: '2834',
              semestre: 'X',
              codigo_salon: 's10',
              nombre_salon: 'Hugo Pineda'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    this.genClassroom()
  },
  methods: {
    genClassroom() {
      const headers: Map<string, string> = new Map()
      if (this.courses) {
        for (const course of this.courses) {
          const classroom = course.classroom.name
          const value = headers.get(classroom)
          if (!value) {
            headers.set(classroom, classroom)
          }
        }
      }
      this.classroms = Array.from(headers.keys())
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
      }
    },
    addMinutes(date: Date, minutes: number): Date {
      return new Date(date.getTime() + minutes * 60000)
    },
    printFormatTime(date: string): string {
      // El formato es el siguiente: HH:mmm:ss y se debe retornar HH:mm
      return date.split(':').slice(0, 2).join(':')
    },
    itemPromp(item: LineSchedule) {
      return {
        title: item.courses[0].career_course.course.name,
        subtitle: `Semestre: ${item.courses[0].career_course.semester}, Salon: ${item.courses[0].classroom.name}`
      }
    }
  }
}
*/
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

.header {
  position: sticky;
  top: 0;
  z-index: 2;
  // --v-theme-overlay-multiplier: var(--v-theme-accent-3-overlay-multiplier);
  background-color: rgb(var(--v-theme-accent-3)) !important;
  color: rgb(var(--v-theme-on-accent-3)) !important;
}
</style>
