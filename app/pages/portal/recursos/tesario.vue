<template>
  <div>
    <v-container v-for="carrera, index in carreras" :key="index">
      <InfoCard
        :img="carrera.img"
        :title="carrera.carrera"
        :route="carrera.link"
      />
    </v-container>
  </div>
</template>
<script lang="ts">
import InfoCard from '@/components/cards/InfoCard.vue'
export default {
  components: {
    InfoCard
  },
  emits: ['tesarioActual'],
  data () {
    return {
      carreras: [
        {
          carrera: 'Ciencias y Sistemas',
          img: new URL('@/assets/img/logo_sistemas.jpg', import.meta.url).href,
          link: 'tesarios/ciencias-sistemas'
        },
        {
          carrera: 'Civil',
          img: new URL('@/assets/img/logo_civil.jpg', import.meta.url).href,
          link: 'tesarios/civil'
        },
        {
          carrera: 'Mecanica',
          img: new URL('@/assets/img/logo_mecanica.jpg', import.meta.url).href,
          link: 'tesarios/mecanica'
        },
        {
          carrera: 'Industrial',
          img: new URL('@/assets/img/logo_industrial.jpg', import.meta.url).href,
          link: 'tesarios/industrial'
        },
        {
          carrera: 'Mecanica Industrial',
          img: new URL('@/assets/img/logo_mecanica_industrial.jpg', import.meta.url).href,
          link: 'tesarios/mecanica-industrial'
        }
      ]
    }
  },
  methods: {
    emitCarrera (nombreCarrera: string) {
      this.$emit('tesarioActual', nombreCarrera)
    }
  }
}
</script>
