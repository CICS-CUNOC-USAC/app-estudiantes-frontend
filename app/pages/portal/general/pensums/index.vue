<template>
  <main>
    <h1 class="mb-4">Pensums</h1>
    <v-row>
      <v-col v-for="(career, index) in careers" :key="index" cols="12" sm="6">
        <InfoCard
          :img="career.img"
          :title="career.name"
          :route="career.route"
        />
      </v-col>
    </v-row>
    <HelpDialog title="Pensums" :content="content_help"></HelpDialog>
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '@/components/dialogs/help/HelpDialog.vue'
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

const content_help = `Los Pensums son la seccion donde puedes acceder al pensum de estudio de cada una de las carreras de la Division de Ingenieria
# Funcionamiento:
Para acceder a un pensum solo debes clickear encima de cualquier tarjeta.`
</script>

<style scoped lang="scss"></style>
