<template>
  <div>
    <v-card
      class="rounded-sm"
      :class="getSemesterColor(curso.career_course.semester)"
      max-width="350"
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
                  {{ 'docente' + curso.classroom_id }}
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center small-text">
                  {{ curso.career_course.semester }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-card>
</div>
</template>

<script lang="ts">
export default {
  props: {
    curso: {
      type: Object,
      required: true
    }
  },
  methods: {
    getSemesterColor(semester: number) {
      if (semester == 1) {
        return 'card_color_orange'
      } else if (semester == 2) {
        return 'card_color_ocean'
      } else if (semester == 3) {
        return 'card_color_green'
      } else if (semester == 4) {
        return 'card_color_yellow'
      } else if (semester == 5) {
        return 'card_color_smoth_green'
      } else if (semester == 6) {
        return 'card_color_orage'
      } else if (semester == 8) {
        return 'card_color_magenta'
      } else if (semester == 9) {
        return 'card_color_magenta'
      } else if (semester == 10) {
        return 'card_color_blue'
      }
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

.card_color_orange {
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

.card_color_red {
  background-color: #7d2f29;
  color: white;
}

.card_color_ocean {
  background-color: #00796b;
  color: white;
}
</style>
