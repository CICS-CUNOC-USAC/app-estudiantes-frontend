<template>
  <v-card class="mx-auto" max-width="374">
    <v-card-title :class="primaryColor">
      <v-row no-gutters>
        <v-col>
          <v-icon :icon="'mdi-numeric-' + semestre.numero" size="80"></v-icon>
        </v-col>
        <v-col class="pa-2">
          <h2 style="text-align: right">
            {{ semestre.nombre }} <br />
            Semestre
          </h2>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-container v-for="curso in cursos">
      <v-card>
        <v-row>
          <v-col style="background-color: yellow" cols="1"> </v-col>
          <v-col cols="2">
            <v-row
              justify="center"
              no-gutters
              :class="primaryColor"
              style="height: 50%; width: 170%; margin-left: -35%"
            >
              {{ curso.codigo_curso }}
            </v-row>
            <v-row
              justify="center"
              no-gutters
              :class="terciaryColor"
              style="height: 50%; width: 170%; margin-left: -35%"
            >
              {{ curso.curso.creditos }}
            </v-row>
          </v-col>
          <v-col :class="secondaryColor" cols="5">
            <v-card-title
              style="font-size: 13px; line-height: 150%"
              class="text-wrap"
              >{{ curso.curso.nombre }}</v-card-title
            >
          </v-col>
          <v-col cols="2" class="pt-3" align-self="center">
            <p v-for="j in 1">000{{ j }}</p>
          </v-col>
          <v-col cols="2" :class="primaryColor">
            <v-btn-toggle
              background-color="primary"
              :v-model="false"
              rounded="true"
              class="pr-2"
              color="green"
              style="max-height: 80%; padding-top: 30%"
            >
              <v-btn icon="mdi-check" />
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Seleccionar</v-card-title>

    <div class="px-4">
      <v-chip-group :v-model="1">
        <v-chip>Obligatorios</v-chip>

        <v-chip>Opcionales</v-chip>

        <v-chip>Todos</v-chip>
      </v-chip-group>
    </div>

    <v-card-actions>
      <v-btn color="deep-purple-lighten-2" variant="text"> Accion </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
export default {
  data() {
    return {
      cursos: Array<Object>,
    };
  },
  async mounted() {
    const cursos = await fetch(
      "http://localhost:8000/carrera-curso/" +
        this.codigoCarrera +
        "/" +
        this.semestre.numero
    );
    this.cursos = (await cursos.json()).data;
  },
  props: {
    primaryColor: {
      type: String,
      required: true,
    },
    secondaryColor: {
      type: String,
      required: true,
    },
    terciaryColor: {
      type: String,
      required: true,
    },
    semestre: {
      type: Object,
      required: true,
    },
    codigoCarrera: {
      type: Number,
      required: true,
    },
  },
};
</script>
