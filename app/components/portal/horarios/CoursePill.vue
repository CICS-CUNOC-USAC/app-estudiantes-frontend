<template>
  <v-container class="py-1 px-1">
    <v-card
      class="mx-auto rounded-sm"
      :class="getColorCourse(curso as Course)"
      max-width="180"
      min-width="180"
    >
      <template #actions>
        <v-container>
          <v-row justify="center">
            <v-col class="text-center">
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.career_course.course.name }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.course_code }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  Salon: {{ curso.classroom.name }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  Semestre: {{ curso.career_course.semester }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import type { Course } from '~/utils/types/schedule-courses'
export default {
  props: {
    curso: {
      type: Object as () => Course,
      required: true
    }
  },
  methods: {
    getColorCourse(curso: Course) {
      if (curso.career_course.semester == 3) {
        return 'card_color_green'
      } else if (curso.career_course.semester == 4) {
        return 'card_color_yellow'
      } else if (curso.career_course.semester == 5) {
        return 'card_color_smoth_green'
      } else if (curso.career_course.semester == 6) {
        return 'card_color_orage'
      } else if (curso.career_course.semester == 8) {
        return 'card_color_magenta'
      } else if (curso.career_course.semester == 10) {
        return 'card_color_blue'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.small-text {
  font-size: 12px;
  font-weight: 900;
  /* Ajusta el tamaño según sea necesario */
  margin: 0;
  padding: 0;
  /* Elimina márgenes adicionales */
}

.card_color_green {
  background-color: #4caf50;
  color: white;
}

.card_color_yellow {
  background-color: #ffeb3b;
  color: black;
}

.card_color_smoth_green {
  background-color: #8bc34a;
  color: white;
}

.card_color_orage {
  background-color: #f7aa36;
  color: black;
}

.card_color_magenta {
  background-color: #c74b74;
  color: white;
}

.card_color_blue {
  background-color: #2196f3;
  color: white;
}
</style>
