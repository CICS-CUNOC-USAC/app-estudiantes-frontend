<template>
  <v-container v-if="!loading">
    <ClassScheduleV1 :courses="scheduleCourses" />
  </v-container>
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import type { ScheduleResponse } from '~/utils/types/schedule-courses'

const { data: scheduleCourses, pending: loading } =
  useCustomLazyFetch<ScheduleResponse>(`/schedules/courses`)

/*
export default {
  name: 'Horarios',
  components: { ClassScheduleV3, ClassScheduleV2, ClassScheduleV1 },
  data() {
    return {
      data_model_back: {
        id: 1,
        career_code: 58,
        course_code: '2796',
        section_id: 1,
        classroom_id: 1,
        periods: [
          {
            weekday_id: 1,
            start_time: '13:40:00',
            end_time: '14:30:00',
            weekday: {
              name: 'Lunes'
            }
          },
          {
            weekday_id: 3,
            start_time: '13:40:00',
            end_time: '14:30:00',
            weekday: {
              name: 'Miercoles'
            }
          },
          {
            weekday_id: 5,
            start_time: '13:40:00',
            end_time: '14:30:00',
            weekday: {
              name: 'Viernes'
            }
          }
        ],
        career_course: {
          semester: 3,
          field: 3,
          course: {
            name: 'Introducción a la Programación 1'
          }
        },
        section: {
          name: 'A'
        },
        classroom: {
          name: '1'
        }
      },
      data_model_final: [
        {
          id: 1,
          career_code: 58,
          course_code: '2796',
          section_id: 1,
          classroom_id: 1,
          periods: [
            {
              weekday_id: 1,
              start_time: '13:40:00',
              end_time: '14:30:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 3,
              start_time: '13:40:00',
              end_time: '14:30:00',
              weekday: {
                name: 'Miercoles'
              }
            },
            {
              weekday_id: 5,
              start_time: '13:40:00',
              end_time: '14:30:00',
              weekday: {
                name: 'Viernes'
              }
            }
          ],
          career_course: {
            semester: 3,
            field: 3,
            course: {
              name: 'Introduccion a la Programacion y Computacion 1'
            }
          },
          section: {
            name: 'A'
          },
          classroom: {
            name: '1'
          }
        },
        {
          id: 2,
          career_code: 58,
          course_code: '2800',
          section_id: 2,
          classroom_id: 2,
          periods: [
            {
              weekday_id: 1,
              start_time: '14:30:00',
              end_time: '15:20:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 2,
              start_time: '14:30:00',
              end_time: '15:20:00',
              weekday: {
                name: 'Martes'
              }
            },
            {
              weekday_id: 3,
              start_time: '14:30:00',
              end_time: '15:20:00',
              weekday: {
                name: 'Miercoles'
              }
            }
          ],
          career_course: {
            semester: 4,
            field: 4,
            course: {
              name: 'Matemáticas Avanzadas'
            }
          },
          section: {
            name: 'B'
          },
          classroom: {
            name: '2'
          }
        },
        {
          id: 3,
          career_code: 58,
          course_code: '2801',
          section_id: 3,
          classroom_id: 3,
          periods: [
            {
              weekday_id: 1,
              start_time: '15:20:00',
              end_time: '16:10:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 2,
              start_time: '15:20:00',
              end_time: '16:10:00',
              weekday: {
                name: 'Martes'
              }
            }
          ],
          career_course: {
            semester: 5,
            field: 5,
            course: {
              name: 'Introducción a la Ingeniería'
            }
          },
          section: {
            name: 'C'
          },
          classroom: {
            name: '3'
          }
        },
        {
          id: 4,
          career_code: 58,
          course_code: '2802',
          section_id: 4,
          classroom_id: 4,
          periods: [
            {
              weekday_id: 1,
              start_time: '16:10:00',
              end_time: '17:00:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 3,
              start_time: '16:10:00',
              end_time: '17:00:00',
              weekday: {
                name: 'Miercoles'
              }
            }
          ],
          career_course: {
            semester: 6,
            field: 6,
            course: {
              name: 'Física General'
            }
          },
          section: {
            name: 'D'
          },
          classroom: {
            name: '4'
          }
        },
        {
          id: 5,
          career_code: 58,
          course_code: '2803',
          section_id: 5,
          classroom_id: 5,
          periods: [
            {
              weekday_id: 2,
              start_time: '17:40:00',
              end_time: '17:50:00',
              weekday: {
                name: 'Martes'
              }
            },
            {
              weekday_id: 3,
              start_time: '17:00:00',
              end_time: '17:50:00',
              weekday: {
                name: 'Miercoles'
              }
            }
          ],
          career_course: {
            semester: 7,
            field: 7,
            course: {
              name: 'Química Orgánica'
            }
          },
          section: {
            name: 'E'
          },
          classroom: {
            name: '5'
          }
        },
        {
          id: 6,
          career_code: 58,
          course_code: '2804',
          section_id: 6,
          classroom_id: 6,
          periods: [
            {
              weekday_id: 1,
              start_time: '18:40:00',
              end_time: '19:30:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 3,
              start_time: '18:40:00',
              end_time: '19:30:00',
              weekday: {
                name: 'Miercoles'
              }
            }
          ],
          career_course: {
            semester: 8,
            field: 8,
            course: {
              name: 'Termodinámica'
            }
          },
          section: {
            name: 'F'
          },
          classroom: {
            name: '6'
          }
        },
        {
          id: 7,
          career_code: 58,
          course_code: '2805',
          section_id: 7,
          classroom_id: 7,
          periods: [
            {
              weekday_id: 2,
              start_time: '19:30:00',
              end_time: '20:20:00',
              weekday: {
                name: 'Martes'
              }
            },
            {
              weekday_id: 3,
              start_time: '19:30:00',
              end_time: '20:20:00',
              weekday: {
                name: 'Miercoles'
              }
            }
          ],
          career_course: {
            semester: 9,
            field: 9,
            course: {
              name: 'Mecánica de Fluidos'
            }
          },
          section: {
            name: 'G'
          },
          classroom: {
            name: '7'
          }
        },
        {
          id: 8,
          career_code: 58,
          course_code: '2806',
          section_id: 8,
          classroom_id: 8,
          periods: [
            {
              weekday_id: 1,
              start_time: '20:20:00',
              end_time: '21:10:00',
              weekday: {
                name: 'Lunes'
              }
            },
            {
              weekday_id: 2,
              start_time: '20:20:00',
              end_time: '21:10:00',
              weekday: {
                name: 'Martes'
              }
            }
          ],
          career_course: {
            semester: 10,
            field: 10,
            course: {
              name: 'Resistencia de Materiales'
            }
          },
          section: {
            name: 'H'
          },
          classroom: {
            name: '8'
          }
        }
      ]
    }
  }
}
*/
</script>
<style scoped lang="scss"></style>
