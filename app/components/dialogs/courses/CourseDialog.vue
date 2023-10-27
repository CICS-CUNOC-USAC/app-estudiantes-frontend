<template>
  <div>
    <span
      class="text-wrap text-body-2 CourseName"
      @click="openAndFetchCareerCourse(courseCode, careerCode)"
    >
      {{ courseName }}<v-icon v-if="mandatory"> mdi-circle-medium </v-icon>
    </span>

    <v-dialog v-model="dialog" class="CourseDialog">
      <v-skeleton-loader
        v-if="loading"
        type="heading, heading, text"
      ></v-skeleton-loader>
      <v-card v-else class="CourseCard">
        <v-card-text>
          <v-row class="text-center">
            <v-col cols="6" sm="4">
              <v-sheet
                rounded="lg"
                class="pa-1 h-100 d-flex align-center flex-column justify-center"
              >
                <span class="font-weight-bold text-subtitle-1"
                  >{{ careerCourse.course.name }}
                  <v-icon v-if="mandatory"> mdi-circle-medium </v-icon></span
                >
              </v-sheet>
            </v-col>
            <v-col cols="6" sm="4"
              ><v-sheet
                rounded="lg"
                class="pa-1 h-100 d-flex align-center flex-column justify-center"
              >
                <span>{{ careerCourse.field_name }}</span>
              </v-sheet>
            </v-col>
            <v-col cols="6" sm="2"
              ><v-sheet border rounded="lg" class="CourseCard__numeric">
                <span class="text-subtitle-2"> Código </span>
                <span class="text-overline font-weight-bold"
                  >#{{ courseCode }}</span
                >
              </v-sheet>
            </v-col>
            <v-col cols="6" sm="2"
              ><v-sheet border rounded="lg" class="CourseCard__numeric">
                <span class="text-subtitle-2"> Créditos </span>
                <span class="text-overline font-weight-bold">{{
                  careerCourse.course.credits
                }}</span>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-sheet
                border
                rounded="lg"
                class="pa-2 h-100 d-flex align-center"
              >
                <span>
                  {{
                    careerCourse.course.description === ''
                      ? 'No hay descripción para este curso'
                      : careerCourse.course.description
                  }}
                </span>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="4">
              <v-row>
                <v-col>
                  <v-sheet
                    border
                    rounded="lg"
                    class="pa-2 w-100 d-flex flex-column"
                  >
                    <span class="text-subtitle-2 text-center">
                      Prerequisitos
                    </span>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-sheet
                    border
                    rounded="lg"
                    class="pa-2 w-100 d-flex flex-column"
                  >
                    <span class="text-subtitle-2 text-center">
                      Postrequisitos
                    </span>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-5 mb-1">
          <v-spacer />
          <v-btn color="red" variant="plain" @click="dialog = false"
            >CERRAR</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { VSkeletonLoader } from 'vuetify/lib/labs/VSkeletonLoader/index.mjs'
defineProps<{
  field: number
  courseCode: string
  courseName: string
  mandatory: boolean
  careerCode: number
}>()
const { fetchCareerCourse } = useCoursesStore()
const { loading, careerCourse } = storeToRefs(useCoursesStore())
const dialog = ref(false)
const openAndFetchCareerCourse = async (
  courseCode: string,
  careerCode: number
) => {
  dialog.value = true
  await fetchCareerCourse(courseCode, careerCode)
}
</script>
<style lang="scss" scoped>
.CourseCard {
  &__numeric {
    padding: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.CourseName {
  cursor: pointer;
  font-weight: bold;
}
.CourseName:hover {
  text-decoration: underline;
}

.CourseDialog {
  max-width: 100%;
  @media (min-width: 900px) {
    max-width: 70%;
  }
  @media (min-width: 1200px) {
    max-width: 50%;
  }
}
</style>
