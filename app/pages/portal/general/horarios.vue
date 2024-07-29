<template>
  <v-container>
    <h1 class="mb-4">Horario de Clases V1</h1>
    <v-table class="elevation-1 rounded-lg" height="650px">
      <thead>
        <tr>
          <th rowspan="2" style="width: 150px">Hora</th>
          <th colspan="12" class="text-center">Salón</th>
        </tr>
        <tr>
          <th
            v-for="header in headers[1].children"
            :key="header.value"
            class="text-center"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.hora">
          <td class="text-center fixed-column">{{ item.hora }}</td>
          <td v-for="header in headers[1].children" :key="header.value">
            <CursoHorario
              v-if="item[header.value]"
              :curso="item[header.value]"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <h1 class="mb-4">Horario de Clases V2</h1>
    <v-table class="elevation-1 rounded-lg">
      <thead>
        <tr>
          <th rowspan="2" style="width: 150px" class="text-center">Hora</th>
          <th colspan="12" class="text-center">Lunes/Miercoles/Viernes</th>
          <!-- <th colspan="12" class="text-center">Miercoles</th>
          <th colspan="12" class="text-center">Viernes</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in response_items" :key="item.hora">
          <td class="text-center fixed-column">
            {{ item.hora }}
          </td>
          <td class="py-2 px-1">
            <v-select
              class="h-auto course-select"
              variant="outlined"
              :item-props="itemPromp"
              :items="item.cursos"
              label="Seleccione"
            ></v-select>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import CursoHorario from '~/components/portal/horarios/CursoHorario.vue'
import type { ScheduleCourse } from '~/utils/types/schedule-courses'

export default {
  name: 'Horarios',
  components: { CursoHorario },
  data() {
    return {
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
      items: [
        {
          hora: '13:40 - 14:30',
          s1: {
            curso: 'Manejo e Implementación de Archivos',
            docente: '',
            codigo: '2812',
            semestre: 'VI'
          }
        },
        {
          hora: '14:30 - 15:20',
          s1: {
            curso: 'Organización de Lenguajes y Compiladores 2',
            docente: '',
            codigo: '2810',
            semestre: 'VI'
          },
          s10: {
            curso: 'Introducción a la Programación 1',
            docente: '',
            codigo: '2796',
            semestre: 'III'
          }
        },
        {
          hora: '15:20 - 16:10',
          s1: {
            curso: 'Arquitectura de Computadoras y Ensambladores 1',
            docente: '',
            codigo: '2811',
            semestre: 'VI'
          }
        },
        {
          hora: '16:10 - 17:00',
          s1: {
            curso: 'Teoría de Sistemas 1',
            docente: '',
            codigo: '2808',
            semestre: 'VI'
          },
          s10: {
            curso: 'Práctica Final',
            docente: '',
            codigo: '2829',
            semestre: 'X'
          },
          s11: {
            curso: 'Lenguajes Formales y de Programación',
            docente: '',
            codigo: '2798',
            semestre: 'IV'
          }
        },
        {
          hora: '17:00 - 17:50',
          s1: {
            curso: 'Análisis y Diseño de Sistemas 1',
            docente: '',
            codigo: '2822',
            semestre: 'VIII'
          },
          s2: {
            curso: 'Sistemas de Bases de Datos 2',
            docente: '',
            codigo: '2821',
            semestre: 'VIII'
          },
          s12: {
            curso: 'Matemática de Computo 2',
            docente: '',
            codigo: '2799',
            semestre: 'IV'
          }
        },
        {
          hora: '17:50 - 18:40',
          s1: {
            curso: 'Introducción a la Programación y Computación 2',
            docente: '',
            codigo: '2800',
            semestre: 'IV'
          },
          s4: {
            curso: 'Redes de Computadoras 2',
            docente: '',
            codigo: '2820',
            semestre: 'VIII'
          },
          s8: {
            curso: 'Economía',
            docente: '',
            codigo: '2809',
            semestre: 'VI'
          },
          s10: {
            curso: 'Seminario de Investigación',
            docente: '',
            codigo: '2837',
            semestre: 'X'
          }
        },
        {
          hora: '18:40 - 19:30',
          s1: {
            curso: 'Software Avanzado',
            docente: '',
            codigo: '2836',
            semestre: 'X'
          },
          s4: {
            curso: 'Investigación de Operaciones 1',
            docente: '',
            codigo: '685',
            semestre: 'VI'
          },
          s10: {
            curso: 'Seminario de Sistemas 1',
            docente: '',
            codigo: '2823',
            semestre: 'VIII'
          }
        },
        {
          hora: '19:30 - 20:20',
          s1: {
            curso: 'Sistemas Operativos 2',
            docente: 'Ing. Otto Soto',
            codigo: '2819',
            semestre: 'VIII'
          }
        },
        {
          hora: '20:20 - 21:10',
          s1: {
            curso: 'Sistemas de Bases de Datos 2',
            docente: '',
            codigo: '2821',
            semestre: 'VIII'
          },
          s2: {
            curso: 'Análisis y Diseño de Sistemas 1',
            docente: '',
            codigo: '2822',
            semestre: 'VIII'
          },
          s10: {
            curso: 'Sistemas Organizacionales y Gerenciales 2',
            docente: 'Ing. Otto Soto',
            codigo: '2834',
            semestre: 'X'
          }
        }
      ],
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
  methods: {
    filtroItems(items: Array<ScheduleCourse>) {
      const result: Array<object> = []
      for (const item of items) {
        result.push({
          title: item.curso,
          subtitle: `Semestre: ${item.semestre}, Salon: ${item.nombre_salon}`
        })
      }
      return result
    },
    itemPromp(item: ScheduleCourse) {
      return {
        title: item.curso,
        subtitle: `Semestre: ${item.semestre}, Salon: ${item.nombre_salon}`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.course-select {
  :deep(.v-input__details){
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
  --v-theme-overlay-multiplier: var(--v-theme-heading-overlay-multiplier);
  background-color: rgb(var(--v-theme-heading)) !important;
  color: rgb(var(--v-theme-on-heading)) !important;
}

thead tr th {
  position: sticky;
  top: 0;
  z-index: 2;
  --v-theme-overlay-multiplier: var(--v-theme-heading-overlay-multiplier);
  background-color: rgb(var(--v-theme-heading)) !important;
  color: rgb(var(--v-theme-on-heading)) !important;
}
</style>
