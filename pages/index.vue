<template>
  <v-container>
    <v-img max-width="450" alt="Logo CICS" :src="getLogo()" />

    <div class="greetings">
      <h1>Aplicación para Estudiantes</h1>
      <v-divider thickness="3" />
      <div class="my-6">
        <p>
          La aplicación para los estudiantes de Ingenieria del Centro
          Universitario De Occidente fue creada con el fin de apoyar a los
          estudiantes a encontrar informacion que les puede ser util a lo largo de
          su carrera.
        </p>
        <br>
        <p>
          La aplicacion esta compuesta por secciones con informacion y
          herramientas.
        </p>
      </div>
      <div class="section-divider">
        <h2 class="green">
          Informacion Básica
        </h2>
        <v-divider thickness="3" />
      </div>
      <v-row justify="center">
        <v-col
          v-for="(item, index) in sections.basicInfo.slice(0, 2)"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="4"
        >
          <InfoCard
            :img="item.img"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :route="item.route"
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          v-for="(item, index) in sections.basicInfo.slice(2, 4)"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="4"
        >
          <InfoCard
            :img="item.img"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :route="item.route"
          />
        </v-col>
      </v-row>

      <div class="section-divider">
        <h2 class="green">
          Asociaciones Estudiantiles
        </h2>
        <v-divider thickness="3" />
      </div>
      <v-row justify="center">
        <v-col
          v-for="(item, index) in sections.associations"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="4"
        >
          <InfoCard
            :img="item.img"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :route="item.route"
          />
        </v-col>
      </v-row>

      <div class="section-divider">
        <h2 class="green">
          Material y Recursos
        </h2>
        <v-divider thickness="3" />
      </div>
      <v-row>
        <v-col
          v-for="(item, index) in sections.resources"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="4"
        >
          <InfoCard
            :img="item.img"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :route="item.route"
          />
        </v-col>
      </v-row>

      <div class="section-divider">
        <h2 class="green">
          Extra
        </h2>
        <v-divider thickness="3" />
      </div>
      <v-row justify="center">
        <v-col
          v-for="(item, index) in sections.extra"
          :key="index"
          cols="12"
          xs="12"
          sm="12"
          lg="4"
        >
          <InfoCard
            :img="item.img"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :route="item.route"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script lang="ts">
export default {
  props: ['theme'],
  data () {
    return {
      sections: {
        basicInfo: [
          {
            title: 'Horarios de Semestre',
            subtitle: 'Para organizarte',
            description:
              'Horarios de clases y laboratorios del semestre en curso',
            route: '/general/horarios',
            img: new URL('@/assets/img/horario.jpg', import.meta.url).href
          },
          {
            title: 'Pensums de Estudio',
            subtitle: 'Para planificar',
            description:
              ' Recopilatorio de los pensums de las diferentes carreras de la division, y herramienta para calcular diferentes datos acerca de tu pensum.',
            route: '/general/pensums',
            img: new URL('@/assets/img/pensum.jpeg', import.meta.url).href
          },
          {
            title: 'FAQ | Primer Ingreso',
            subtitle: 'Para ayudarte al inicio',
            description:
              'Preguntas Frecuentes para los estudiantes de primer ingreso',
            route: '/general/faq-primer-ingreso',
            img: new URL('@/assets/img/faq.jpg', import.meta.url).href
          },
          {
            title: 'FAQ',
            subtitle: 'Para ayudarte',
            description: 'Preguntas Frecuentes para estudiantes de reingreso',
            route: '/general/faq',
            img: new URL('@/assets/img/faq.jpg', import.meta.url).href
          }
        ],
        associations: [
          {
            title: 'CICS',
            subtitle: 'Acerca del comite',
            description:
              'Informacion relevante del Comite de Ingenieria en Ciencias y Sistemas',
            route: '/asociaciones/cics',
            img: new URL('@/assets/img/cics.png', import.meta.url).href
          },
          {
            title: 'AEIO',
            subtitle: 'Acerca de la asociacion',
            description:
              'Informacion relevante de la Asociacion de Estudiantes de Ingenieria de Occidente',
            route: '/asociaciones/aeio',
            img: new URL('@/assets/img/aeio.jpg', import.meta.url).href
          }
        ],
        resources: [
          {
            title: 'Manuales',
            subtitle: 'Para orientarte',
            description:
              'Manuales e infografias acerca de procesos importantes en la universidad',
            route: '/recursos/manuales',
            img: new URL('@/assets/img/manuales.jpg', import.meta.url).href
          },
          {
            title: 'Biblioteca',
            subtitle: 'Para estudiar',
            description:
              'Material de estudio de los diferentes cursos de la Division',
            route: '/recursos/biblioteca',
            img: new URL('@/assets/img/biblioteca.jpg', import.meta.url).href
          },
          {
            title: 'Tesario',
            subtitle: 'Para investigar',
            description:
              'Recopilacion de las tesis de estudiantes de ingenieria a lo largo del tiempo.',
            route: '/recursos/tesario',
            img: new URL('@/assets/img/tesario.jpg', import.meta.url).href
          }
        ],
        extra: [
          {
            title: 'Acerca de',
            subtitle: 'Más informacion',
            description:
              'Conoce más acerca de esta aplicacion, su desarrollo, y cómo puedes contribuir',
            route: '/extras/about',
            img: new URL('@/assets/img/acerca_de.jpg', import.meta.url).href
          }
        ]
      }
    }
  },
  head () {
    return {
      title: 'Home'
    }
  },
  methods: {
    getLogo () {
      if (this.theme === 'light') {
        return new URL('@/assets/img/logo-cics-light.png', import.meta.url).href
      }
      return new URL('@/assets/img/logo-cics-dark.png', import.meta.url).href
    }
  }
}
</script>
<style scoped>
/*Estilo para los textos*/
h2 {
  font-weight: 700;
  font-size: 1.8rem;
  text-transform: uppercase;
}
h1 {
  font-weight: 400;
  font-size: 2.4rem;
  text-transform: uppercase;
}

.section-divider {
  margin-top: 32px;
  margin-bottom: 32px;
}
.greetings h1,
.greetings h2 {
  text-align: left;
}

.greetings p {
  text-align: left;
}
</style>
