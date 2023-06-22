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
              Pensums
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
  <v-container v-for="carrera in carreras">
    <InfoCard 
    :img="carrera.img" 
    :title="carrera.carrera" 
    :route="carrera.route"
    />
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Pensums',
  data() {
    return {
        carreras : [
          {
            carrera:"Civil",
            img: new URL("@/assets/img/logo_civil.jpg", import.meta.url).href,
            route: "pensums/civil",
          }, 
          {
            carrera:"Ciencias y Sistemas",
            img: new URL("@/assets/img/logo_sistemas.jpg", import.meta.url).href,
            route:"pensums/ciencias-sistemas"
          }, 
          {
            carrera:"Mecanica",
            img: new URL("@/assets/img/logo_mecanica.jpg", import.meta.url).href,
            route:"pensums/mecanica"
          }, 
          {
            carrera:"Industrial",
            img: new URL("@/assets/img/logo_industrial.jpg", import.meta.url).href,
            route:"pensums/industrial"
          }, 
          {
            carrera:"Mecanica Industrial",
            img: new URL("@/assets/img/logo_mecanica_industrial.jpg", import.meta.url).href,
            route:"pensums/mecanica-industrial"
          }
        ],
    }
  }
}
</script>

<style scoped lang="scss">

</style>
