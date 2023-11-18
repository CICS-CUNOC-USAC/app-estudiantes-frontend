<template>
  <main>
    <v-row>
      <v-col v-for="(career, index) in careers" :key="index" cols="12" sm="6">
        <InfoCard
          :img="career.img"
          :title="career.name"
          :route="career.route"
        />
      </v-col>
    </v-row>
  </main>
</template>

<script setup lang="ts">
import InfoCard from '@/components/cards/InfoCard.vue'
const careers = [
  {
    name: 'Civil',
    img: new URL('@/assets/img/logo_civil.jpg', import.meta.url).href,
    route: 'pensums/civil-33'
  },
  {
    name: 'Ciencias y Sistemas',
    img: new URL('@/assets/img/logo_sistemas.jpg', import.meta.url).href,
    route: 'pensums/sistemas-58'
  },
  {
    name: 'Mecanica',
    img: new URL('@/assets/img/logo_mecanica.jpg', import.meta.url).href,
    route: 'pensums/mecanica-34'
  },
  {
    name: 'Industrial',
    img: new URL('@/assets/img/logo_industrial.jpg', import.meta.url).href,
    route: 'pensums/industrial-35'
  },
  {
    name: 'Mecanica Industrial',
    img: new URL('@/assets/img/logo_mecanica_industrial.jpg', import.meta.url)
      .href,
    route: 'pensums/mecanicaindustrial-36'
  }
]
</script>

<style scoped lang="scss"></style>
