<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="hora"
      items-per-page="100"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Horarios</v-toolbar-title>
        </v-toolbar>
      </template>
      <template #item.s1="{ item }">
        <v-container>
          <v-card :variant="flat" class="mx-auto" max-width="350">
            <template #actions>
              <v-container>
                <v-row justify="center">
                  <v-col class="text-center">
                    <v-row>
                      <v-col class="text-center small-text">
                        {{ item.s1.curso }}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center small-text">
                        {{ item.s1.codigo }}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center small-text">
                        {{ item.s1.docente }}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-center small-text">
                        {{ item.s1.semestre }}
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </template>
          </v-card>
        </v-container>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Horarios',
  data() {
    return {
      headers: [
        { title: 'Hora', value: 'hora' },
        {
          title: 'Salón',
          align: 'center',
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
          hora: '13:00 - 14:40',
          s1: {
            curso: 'Manejo e Implementación de Archivos',
            docente: '',
            codigo: '2812',
            semestre: 'III'
          },
          s5: {
            curso: 'Introducción a la Programación 1',
            docente: '',
            codigo: '2796',
            semestre: ''
          },
          s10: {
            curso: 'Introducción a la Programación 1',
            docente: '',
            codigo: '2796',
            semestre: ''
          }
        },
        {
          hora: '14:40 - 15:20',
          s1: {
            curso: 'Organización de Lenguajes y Compiladores 2',
            docente: '',
            codigo: '2810',
            semestre: ''
          },
          s8: {
            curso: 'Práctica Final',
            docente: '',
            codigo: '2829',
            semestre: ''
          }
        },
        {
          hora: '15:20 - 16:00',
          s1: {
            curso: 'Arquitectura de Computadoras y Ensambladores 1',
            docente: '',
            codigo: '2811',
            semestre: ''
          },
          s7: {
            curso: 'Matemática de Computo 2',
            docente: '',
            codigo: '2799',
            semestre: ''
          },
          s12: {
            curso: 'Matemática de Computo 2',
            docente: '',
            codigo: '2799',
            semestre: ''
          }
        },
        {
          hora: '16:00 - 17:00',
          s1: {
            curso: 'Teoría de Sistemas 1',
            docente: '',
            codigo: '2808',
            semestre: ''
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
          s3: {
            curso: 'Sistemas de Bases de Datos 2',
            docente: '',
            codigo: '2821',
            semestre: ''
          }
        },
        {
          hora: '17:50 - 18:40',
          s1: {
            curso: 'Introducción a la Programación y Computación 2',
            docente: '',
            codigo: '2800',
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
  }
}
</script>

<style scoped lang="scss">
.small-text {
  font-size: 12px;
  /* Ajusta el tamaño según sea necesario */
  margin: 0;
  padding: 0;
  /* Elimina márgenes adicionales */
}
</style>
