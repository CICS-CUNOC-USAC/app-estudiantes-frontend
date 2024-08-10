<template>
  <main>
    <h1 class="mb-4">
      <v-icon size="32" class="mr-2"> mdi-calendar-month-outline </v-icon>
      Horarios
    </h1>
    <p class="font-weight-light my-4">
      En esta sección se pueden administrar los horarios de cursos y
      laboratorios.
    </p>
    <v-row align="center" justify="start">
      <v-col cols="12" md="3">
        <v-btn block @click="console.log('crear horario')">
          <v-icon>mdi-plus</v-icon>
          Nuevo horario
        </v-btn>
      </v-col>
      <!--
      <v-col cols="12" md="3">
        <v-text-field
          v-model="name"
          append-icon="mdi-text-search"
          label="Buscar"
          clearable
        ></v-text-field>
      </v-col>
      -->
    </v-row>
    <v-row>
      <v-container
        v-if="!loadingHours && !loadingClassrooms && !loadingSchedules"
      >
        <ClassScheduleV1
          :hours="hours!"
          :classrooms="classrooms!"
          :schedules="schedules!"
        />
      </v-container>
    </v-row>
  </main>
</template>
<script setup lang="ts">
import ClassScheduleV1 from '~/components/portal/horarios/ClassScheduleV1.vue'
import type { Classroom, Course, Hour } from '~/utils/types/schedule-courses'

definePageMeta({
  layout: 'admin'
})

const name = ref('')

const { data: hours, pending: loadingHours } =
  useCustomLazyFetch<Array<Hour>>(`hours`)

const { data: classrooms, pending: loadingClassrooms } =
  useCustomLazyFetch<Array<Classroom>>(`classrooms`)

const { data: schedules, pending: loadingSchedules } =
  useCustomLazyFetch<Array<Course>>(`schedules/courses`)
</script>
<style lang="scss" scoped></style>
