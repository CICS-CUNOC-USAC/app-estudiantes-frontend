<template>
    <!--
  <v-container fluid class="h-75 w-auto" style="display: flex; align-items: center;">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="6" lg="6">
        <v-card style="text-align: center">
          <v-card-title class="headline d-flex flex-column justify-center align-center">
            <v-icon>
              mdi-wrench
            </v-icon>
            <h6 style="color: darkcyan; font-style: italic">
                Pensum {{$route.params.carrera}}
            </h6>
            <strong>En construcción...</strong>
          </v-card-title>
          <v-card-text>
            Esta sección está en construcción. Por favor, regresa más tarde.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    -->
  <h1 align="center">{{titulo}}</h1>
  <v-container>
    <v-btn
      style="margin-bottom: 3%;"
      prepend-icon="mdi-arrow-left"
      @click="regresarATesario()"
    >Regresar</v-btn>
    <v-row justify="center">
      <v-col
        v-for="semestre in semestres"
        cols="12"
        xs="12"
        sm="12"
        lg="4"
      >
      <PensumsCard 
        :primary-color="colorCarrera" 
        :secondary-color="colorSecundario" 
        :terciary-color="colorTerciario" 
        :semestre="semestre"
        :codigo-carrera="codigo"
      />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'Pensum',
  mounted() {
    const route = useRoute()
    switch (route.params.carrera) {
      case "civil":
        this.titulo = "Civil"
        this.carreraActual = "civil"
        this.colorCarrera = "bg-red-darken-1"
        this.colorSecundario = "bg-red-lighten-4"
        this.colorTerciario = "bg-red-lighten-2"
        break;
      case "ciencias-sistemas":
        this.titulo = "Ciencias y Sistemas"
        this.carreraActual = "sistemas",
        this.colorCarrera = "bg-orange-accent-4"
        this.colorSecundario = "bg-deep-orange-lighten-4"
        this.colorTerciario = "bg-orange-lighten-3"
        break;
      case "mecanica":
        this.titulo = "Mecanica"
        this.carreraActual = "mecanica"
        this.colorCarrera = "bg-green-darken-1"
        this.colorSecundario = "bg-green-lighten-3"
        this.colorTerciario = "bg-green-lighten-2"
        break;
      case "industrial":
        this.titulo = "Industrial"
        this.carreraActual = "industrial"
        this.colorCarrera = "bg-light-green-darken-2"
        this.colorSecundario = "bg-light-green-lighten-4"
        this.colorTerciario = "bg-light-green-lighten-3"
        break;
      case "mecanica-industrial":
        this.titulo = "Mecanica Industrial"
        this.carreraActual = "mecanica-industrial"
        this.colorCarrera = "bg-teal-darken-2"
        this.colorSecundario = "bg-teal-lighten-3"
        this.colorTerciario = "bg-teal-lighten-1"
        break;
      default:
        break;
    }
  },
  data() {
    return {
      bannerImg: new URL("@/assets/img/tesario.jpg", import.meta.url).href,
      titulo: '',
      codigo: 58,
      carreraActual: '',
      colorCarrera: '',
      colorSecundario: '',
      colorTerciario: '',
      semestres : [
        {
          nombre: "Primer",
          numero: "1"
        },
        {
          nombre: "Segundo",
          numero: "2"
        },
        {
          nombre: "Tercer",
          numero: "3"
        },
        {
          nombre: "Cuarto",
          numero: "4"
        },
        {
          nombre: "Quinto",
          numero: "5"
        },
        {
          nombre: "Sexto",
          numero: "6"
        },
        {
          nombre: "Septimo",
          numero: "7"
        },
        {
          nombre: "Octavo",
          numero: "8"
        },
        {
          nombre: "Noveno",
          numero: "9"
        },
        {
          nombre: "Decimo",
          numero: "10"
        },
      ]
    }
  },
  methods: {
    regresarATesario() {
      const router = useRouter()
      router.push('pensums')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
