<template>
  <v-container>
    <v-table class="elevation-1">
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Horarios de Clases</v-toolbar-title>
        </v-toolbar>
      </template>
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
          <td class="text-center">{{ item.hora }}</td>
          <td v-for="header in headers[1].children" :key="header.value">
            <CursoHorario
              v-if="item[header.value]"
              :curso="item[header.value]"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts">
import CursoHorario from '~/components/portal/horarios/CursoHorario.vue'

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
            // { title: '6', value: 's4' },
            { title: '7', value: 's5' },
            // { title: '8', value: 's6' },
            { title: '10', value: 's7' },
            { title: 'Salón Proyecciones', value: 's8' },
            // { title: 'Salón TICS', value: 's9' },
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
            semestre: ''
          },
          s2: {
            curso: 'Sistemas de Bases de Datos 2',
            docente: '',
            codigo: '2821',
            semestre: ''
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
            semestre: ''
          }
        },
        {
          hora: '19:30 - 20:20',
          s1: {
            curso: 'Sistemas Operativos 2 - Ing. Otto Soto',
            docente: '',
            codigo: '2819',
            semestre: ''
          },
          s3: {
            curso: 'Sistemas de Bases de Datos 2',
            docente: '',
            codigo: '2821',
            semestre: ''
          }
        },
        {
          hora: '20:20 - 21:10',
          s1: {
            curso: 'Análisis y Diseño de Sistemas 1',
            docente: '',
            codigo: '2822',
            semestre: ''
          },
          s3: {
            curso: 'Seminario de Sistemas 1',
            docente: '',
            codigo: '2823',
            semestre: ''
          }
        }
      ]
    }
  },
  methods: {
    filtrarSalones() {}
  }
}
</script>

<style scoped lang="scss">
.text-center {
  text-align: center;
}
</style>
