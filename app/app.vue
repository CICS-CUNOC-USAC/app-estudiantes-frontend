<template>
  <main>
    <!-- <NuxtLoadingIndicator :throttle="130" :height="4" :color="loadingColor" /> -->
    <NuxtLayout />
    <!-- <GeneralSnackbar /> -->
  </main>
</template>
<script lang="ts" setup>
// import { useTheme } from 'vuetify'
// import { useConfigsStore } from '~/stores/config'
// import GeneralSnackbar from './components/partials/GeneralSnackbar.vue'

// const vTheme = useTheme()
// const { theme } = storeToRefs(useConfigsStore())
// const currentTheme = computed(() => {
//   return vTheme.computedThemes.value[theme.value]
// })

// const bgColor = computed(() => {
//   return currentTheme.value.dark ? '#121212' : '#fff'
// })

// const loadingColor = computed(() => {
//   return currentTheme.value.dark ? '#fff' : '#121212'
// })

// useHead({
//   // Title template, if titleChunk is defined in a page, it will be injected into the template
//   titleTemplate: (titleChunk) => {
//     return titleChunk
//       ? `${titleChunk} ∙ Ing App CUNOC`
//       : 'CUNOC ∙ Ingenieria App'
//   }
// })
</script>
<style lang="scss">
:root {
  // color-scheme: light dark;
}
/*
Styles used for page and layout transitions - Start
*-active classes control the transition duration and timing function
*-to and *-from classes control the transition state
*/
.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-in-out;
}
.page-leave-to,
.page-enter-from {
  opacity: 0;
  transform: translateX(0.5rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s ease-in-out;
}

.layout-leave-to,
.layout-enter-from {
  opacity: 0;
  transform: translateX(0.5rem);
}
/*
Styles used for page and layout transitions - End
*/
@import '@/assets/styles/main.scss';
</style>
