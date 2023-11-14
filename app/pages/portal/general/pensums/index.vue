<template>
  <v-container>
    <div v-for="(carrera, index) in carreras" :key="index">
      <InfoCard
        :img="carrera.img"
        :title="carrera.carrera"
        :route="carrera.route"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Pensums',
  data() {
    return {
      carreras: [
        {
          carrera: 'Civil',
          img: new URL('@/assets/img/logo_civil.jpg', import.meta.url).href,
          route: 'pensums/civil'
        },
        {
          carrera: 'Ciencias y Sistemas',
          img: new URL('@/assets/img/logo_sistemas.jpg', import.meta.url).href,
          route: 'pensums/ciencias-sistemas'
        },
        {
          carrera: 'Mecanica',
          img: new URL('@/assets/img/logo_mecanica.jpg', import.meta.url).href,
          route: 'pensums/mecanica'
        },
        {
          carrera: 'Industrial',
          img: new URL('@/assets/img/logo_industrial.jpg', import.meta.url)
            .href,
          route: 'pensums/industrial'
        },
        {
          carrera: 'Mecanica Industrial',
          img: new URL(
            '@/assets/img/logo_mecanica_industrial.jpg',
            import.meta.url
          ).href,
          route: 'pensums/mecanica-industrial'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss"></style>
