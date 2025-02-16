// import '../assets/styles/main.scss'
import VueGridLayout from 'vue-grid-layout-v3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGridLayout)
})
