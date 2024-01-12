<template>
  <main>
    <v-progress-linear
      v-if="loading"
      absolute
      color="orange"
      height="5"
      indeterminate
    />
    <h1 v-if="careerCourses" align="center">
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
  </main>
</template>

<script setup lang="ts">
import PensumPublicView from '~/components/portal/pensums/PensumPublicView.vue'
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
</script>

<style scoped lang="scss"></style>
