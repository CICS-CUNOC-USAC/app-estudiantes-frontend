<template>
  <main>
    <v-progress-linear
      v-if="loading"
      absolute
      color="orange"
      height="5"
      indeterminate
    />
    <nav class="space-x-4">
      <CButton
        icon="lucide:arrow-left"
        variant="link"
        label="Regresar"
        class="mb-4 text-muted-color-emphasis lg:mb-2"
        to="/portal/general/pensums"
      />
    </nav>
    <h1 v-if="careerCourses" class="mt-4 mb-8 text-xl font-semibold">
      <span class="font-weight-light">Carrera:</span>
      {{ careerCourses?.career_name }} -
      <span>
        {{ careerCourses?.career_code }}
      </span>
    </h1>
    <PensumPublicView
      :career-courses="careerCourses?.courses"
      :loading="loading"
    />
    <HelpDialog title="Pensum" :content="content_help"></HelpDialog>
  </main>
</template>

<script setup lang="ts">
import HelpDialog from '@/components/dialogs/help/HelpDialog.vue'
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
import CButton from '~/components/primitives/button/CButton.vue'
import type { CareerCoursesResponse } from '~/utils/types/career-courses'
const route = useRoute()
const { data: careerCourses, pending: loading } =
  useCustomLazyFetch<CareerCoursesResponse>(
    `/career-courses/${route.params.codigoCarrera}`
  )
// export default {
//   components: {
//     PensumsCard
//   },
//   data() {
//     return {
//       bannerImg: new URL('@/assets/img/tesario.jpg', import.meta.url).href,
//       titulo: '',
//       codigo: 58,
//       carreraActual: '',
//       colorCarrera: '',
//       colorSecundario: '',
//       colorTerciario: '',
//       semestres: [
//         {
//           nombre: 'Primer',
//           numero: '1'
//         },
//         {
//           nombre: 'Segundo',
//           numero: '2'
//         },
//         {
//           nombre: 'Tercer',
//           numero: '3'
//         },
//         {
//           nombre: 'Cuarto',
//           numero: '4'
//         },
//         {
//           nombre: 'Quinto',
//           numero: '5'
//         },
//         {
//           nombre: 'Sexto',
//           numero: '6'
//         },
//         {
//           nombre: 'Septimo',
//           numero: '7'
//         },
//         {
//           nombre: 'Octavo',
//           numero: '8'
//         },
//         {
//           nombre: 'Noveno',
//           numero: '9'
//         },
//         {
//           nombre: 'Decimo',
//           numero: '10'
//         }
//       ]
//     }
//   },
//   mounted() {
//     const route = useRoute()
//     switch (route.params.carrera) {
//       case 'civil':
//         this.titulo = 'Civil'
//         this.carreraActual = 'civil'
//         this.colorCarrera = 'bg-red-darken-1'
//         this.colorSecundario = 'bg-red-lighten-4'
//         this.colorTerciario = 'bg-red-lighten-2'
//         break
//       case 'ciencias-sistemas':
//         this.titulo = 'Ciencias y Sistemas'
//         this.carreraActual = 'sistemas'
//         this.colorCarrera = 'bg-orange-accent-4'
//         this.colorSecundario = 'bg-deep-orange-lighten-4'
//         this.colorTerciario = 'bg-orange-lighten-3'
//         break
//       case 'mecanica':
//         this.titulo = 'Mecanica'
//         this.carreraActual = 'mecanica'
//         this.colorCarrera = 'bg-green-darken-1'
//         this.colorSecundario = 'bg-green-lighten-3'
//         this.colorTerciario = 'bg-green-lighten-2'
//         break
//       case 'industrial':
//         this.titulo = 'Industrial'
//         this.carreraActual = 'industrial'
//         this.colorCarrera = 'bg-light-green-darken-2'
//         this.colorSecundario = 'bg-light-green-lighten-4'
//         this.colorTerciario = 'bg-light-green-lighten-3'
//         break
//       case 'mecanica-industrial':
//         this.titulo = 'Mecanica Industrial'
//         this.carreraActual = 'mecanica-industrial'
//         this.colorCarrera = 'bg-teal-darken-2'
//         this.colorSecundario = 'bg-teal-lighten-3'
//         this.colorTerciario = 'bg-teal-lighten-1'
//         break
//       default:
//         break
//     }
//   },
//   methods: {
//     regresarATesario() {
//       const router = useRouter()
//       router.push('pensums')
//     }
//   }
// }
const content_help = `En la seccion de Pensum se pueden visualizar toda la informacion del pensum de estudio de la carrera asi como informacion de cada uno de los cursos.
  ## Funcionamiento:
  ### Vista Principal:
  Todos los cursos estan organizados por semestre de la carrera representado por una tarjeta permitiendo filtrar los cursos.
  Cada tarjeta de curso cuenta de las siguientes partes:
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)
  Esto permite una visualizacion integra de los cursos de la carrera con su codigo, area, creditos, prerequisitos y obligatoriedad.
  ### Filtro:
  Es posible filtrar los cursos mostrados por semestre basados en su obligatoriedad.
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)
  ### Vista de Curso:
  Cada curso tiene una vista personalizada al clickear sobre su nombre, esta cuenta con las siguientes partes.
  ![TestImage](https://as2.ftcdn.net/v2/jpg/04/74/32/65/1000_F_474326573_R0pN6QJCuDOsDDj4sxVgpzGLk5cQHe6s.jpg)
  En esta vista se pueden observar todos los detalles de un curso en especifico inclyendo una breve descripcion del mismo.`
</script>

<style scoped lang="scss"></style>
