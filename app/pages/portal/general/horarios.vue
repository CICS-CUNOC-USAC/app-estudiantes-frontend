<template>
  <main>
    <h1 class="mb-4">Horario de Clases V1</h1>
    <!-- <v-container
      v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
    >
      <ClassScheduleV1
        :hours="hours!"
        :classrooms="classrooms!"
        :schedules="schedules!"
      />
    </v-container> -->

    <v-container>
      <ClassScheduleV1
        :hours="tmp_hours!"
        :classrooms="tmp_classrooms!"
        :schedules="tmp_schedules!"
      />
    </v-container>
  </main>
</template>

<script setup lang="ts">
import ClassScheduleV3 from '~/components/portal/horarios/ClassScheduleV3.vue'
import ClassScheduleV2 from '~/components/portal/horarios/ClassScheduleV2.vue'
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

const tmp_hours: Array<Hour> = [
  { id: 1, start_time: '13:40', end_time: '14:30' },
  { id: 2, start_time: '14:30', end_time: '15:20' },
  { id: 3, start_time: '15:20', end_time: '16:10' },
  { id: 4, start_time: '16:10', end_time: '17:00' },
  { id: 5, start_time: '17:00', end_time: '17:50' },
  { id: 6, start_time: '17:50', end_time: '18:40' },
  { id: 7, start_time: '18:40', end_time: '19:30' },
  { id: 8, start_time: '19:30', end_time: '20:20' },
  { id: 9, start_time: '20:20', end_time: '21:10' }
]

const tmp_classrooms: Array<Classroom> = [
  { id: 1, name: '1' },
  { id: 2, name: '3' },
  { id: 3, name: '5' },
  { id: 4, name: '6' },
  { id: 5, name: '7' },
  { id: 6, name: '8' },
  { id: 7, name: '10' },
  { id: 8, name: 'Salon Proyecciones' },
  { id: 9, name: 'Salon TICS' },
  { id: 10, name: 'Hugo Pineda' },
  { id: 11, name: 'Salon Dibujo' },
  { id: 12, name: 'Laboratorio de Aguas' }
]

const tmp_schedules: Array<Course> = [
  {
    id: 1,
    career_code: 58,
    course_code: '2812',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '13:40',
        end_time: '14:30',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '13:40',
        end_time: '14:30',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '13:40',
        end_time: '14:30',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Manejo e Implementación de Archivos'
      }
    },
    profesor: {
      name: 'Ing. Christian'
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
    course_code: '2810',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '14:30',
        end_time: '15:20',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '14:30',
        end_time: '15:20',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '14:30',
        end_time: '15:20',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Organización de Lenguajes y Compiladores 2'
      }
    },
    profesor: {
      name: 'Ing. Moises'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 3,
    career_code: 58,
    course_code: '2811',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '15:20',
        end_time: '16:10',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '15:20',
        end_time: '16:10',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '15:20',
        end_time: '16:10',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Arquitectura de Computadoras y Ensambladores 1'
      }
    },
    profesor: {
      name: 'Ing. Mauricio'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 4,
    career_code: 58,
    course_code: '2808',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Teoría de Sistemas 1'
      }
    },
    profesor: {
      name: 'Ing. Pedro'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 5,
    career_code: 58,
    course_code: '2822',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 8,
      field: 3,
      course: {
        name: 'Análisis y Diseño de Sistemas 1'
      }
    },
    profesor: {
      name: 'Ing. Daniel'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 6,
    career_code: 58,
    course_code: '2800',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 4,
      field: 3,
      course: {
        name: 'Introducción a la Programación y Computación 2'
      }
    },
    profesor: {
      name: 'Ing. Moises'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 7,
    career_code: 58,
    course_code: '2836',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 10,
      field: 3,
      course: {
        name: 'Software Avanzado'
      }
    },
    profesor: {
      name: 'Ing. Moises'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 8,
    career_code: 58,
    course_code: '2803',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 5,
      field: 3,
      course: {
        name: 'Organización de Lenguajes y Compiladores 1'
      }
    },
    profesor: {
      name: 'Ing. Daniel Gonzalez'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 9,
    career_code: 58,
    course_code: '2821',
    section_id: 1,
    classroom_id: 1,
    periods: [
      {
        weekday_id: 1,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 8,
      field: 3,
      course: {
        name: 'Sistemas de Bases de Datos 2'
      }
    },
    profesor: {
      name: 'Ing. Pedro'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '1'
    }
  },
  {
    id: 10,
    career_code: 58,
    course_code: '2820',
    section_id: 1,
    classroom_id: 4,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 8,
      field: 3,
      course: {
        name: 'Redes de Computadoras 2'
      }
    },
    profesor: {
      name: 'Ing. Rojas'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '6'
    }
  },
  {
    id: 11,
    career_code: 58,
    course_code: '2820',
    section_id: 1,
    classroom_id: 4,
    periods: [
      {
        weekday_id: 1,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Investigación de Operaciones 1'
      }
    },
    profesor: {
      name: 'Ing. Alicia Armas'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '6'
    }
  },
  {
    id: 12,
    career_code: 58,
    course_code: '2796',
    section_id: 1,
    classroom_id: 6,
    periods: [
      {
        weekday_id: 1,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '18:40',
        end_time: '19:30',
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
    profesor: {
      name: 'Ing. Daniel Gonzalez'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: '8'
    }
  },
  {
    id: 12,
    career_code: 58,
    course_code: '2809',
    section_id: 1,
    classroom_id: 8,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 6,
      field: 3,
      course: {
        name: 'Economía'
      }
    },
    profesor: {
      name: 'Lic. Stewart'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Salon Proyecciones'
    }
  },
  {
    id: 13,
    career_code: 58,
    course_code: '2829',
    section_id: 1,
    classroom_id: 9,
    periods: [
      {
        weekday_id: 1,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 10,
      field: 3,
      course: {
        name: 'Práctica Final'
      }
    },
    profesor: {
      name: 'Ing. Moises'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Salon TICS'
    }
  },
  {
    id: 14,
    career_code: 58,
    course_code: '2837',
    section_id: 1,
    classroom_id: 10,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:50',
        end_time: '18:40',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 10,
      field: 3,
      course: {
        name: 'Seminario de Investigación'
      }
    },
    profesor: {
      name: 'Ing. Pedro'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Hugo Pineda'
    }
  },
  {
    id: 15,
    career_code: 58,
    course_code: '2823',
    section_id: 1,
    classroom_id: 10,
    periods: [
      {
        weekday_id: 1,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '18:40',
        end_time: '19:30',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 10,
      field: 3,
      course: {
        name: 'Seminario de Sistemas 1'
      }
    },
    profesor: {
      name: 'Ing. Pedro'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Hugo Pineda'
    }
  },
  {
    id: 16,
    career_code: 58,
    course_code: '2819',
    section_id: 1,
    classroom_id: 10,
    periods: [
      {
        weekday_id: 1,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '19:30',
        end_time: '20:20',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 8,
      field: 3,
      course: {
        name: 'Sistemas Operativos 2'
      }
    },
    profesor: {
      name: 'Ing. Otto Soto'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Hugo Pineda'
    }
  },
  {
    id: 17,
    career_code: 58,
    course_code: '2834',
    section_id: 1,
    classroom_id: 10,
    periods: [
      {
        weekday_id: 1,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '20:20',
        end_time: '21:10',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 10,
      field: 3,
      course: {
        name: 'Sistemas Organizacionales y Gerenciales 2'
      }
    },
    profesor: {
      name: 'Ing. Otto Soto'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Hugo Pineda'
    }
  },
  {
    id: 17,
    career_code: 58,
    course_code: '2798',
    section_id: 1,
    classroom_id: 12,
    periods: [
      {
        weekday_id: 1,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '16:10',
        end_time: '17:00',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 4,
      field: 3,
      course: {
        name: 'Lenguajes Formales y de Programación'
      }
    },
    profesor: {
      name: 'Ing. Daniel Gonzalez'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Laboratorio de Aguas'
    }
  },
  {
    id: 18,
    career_code: 58,
    course_code: '2799',
    section_id: 1,
    classroom_id: 12,
    periods: [
      {
        weekday_id: 1,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Lunes'
        }
      },
      {
        weekday_id: 3,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Miercoles'
        }
      },
      {
        weekday_id: 5,
        start_time: '17:00',
        end_time: '17:50',
        weekday: {
          name: 'Viernes'
        }
      }
    ],
    career_course: {
      semester: 4,
      field: 3,
      course: {
        name: 'Matemática de Computo 2'
      }
    },
    profesor: {
      name: 'Ing. Mauricio Lopez'
    },
    section: {
      name: 'A'
    },
    classroom: {
      name: 'Laboratorio de Aguas'
    }
  }
]

const { data: hours, pending: loadingHours } =
  useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

const { data: schedules, pending: loadingSchedules } =
  useCustomLazyFetch<Array<Course>>(`schedules/courses`)

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
