<template>
  <main>
    <nav class="space-x-4">
      <CButton
          icon="icon-park-outline:arrow-left"
          variant="link"
          label="Regresar al inicio"
          class="mb-4 text-muted-color-emphasis lg:mb-2"
          to="/"
        />
    </nav>
    <h1 class="py-3 text-xl font-semibold">
      <Icon name="icon-park-twotone:book-open" class="mb-1 mr-1.5 inline-block" />
      Tesarios de carreras
    </h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoCard
      v-for="(carrera, index) in carreras"
      :key="index"
      :img="carrera.img"
      :title="carrera.carrera"
      :route="carrera.link"
      />
    </div>
  </main>
</template>
<script lang="ts">
import InfoCard from '@/components/cards/InfoCard.vue'
export default {
  components: {
    InfoCard
  },
  emits: ['tesarioActual'],
  data() {
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
          img: new URL('@/assets/img/logo_industrial.jpg', import.meta.url)
            .href,
          link: 'tesarios/industrial'
        },
        {
          carrera: 'Mecanica Industrial',
          img: new URL(
            '@/assets/img/logo_mecanica_industrial.jpg',
            import.meta.url
          ).href,
          link: 'tesarios/mecanica-industrial'
        }
      ]
    }
  },
  methods: {
    emitCarrera(nombreCarrera: string) {
      this.$emit('tesarioActual', nombreCarrera)
    }
  }
}
</script>
