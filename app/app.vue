<template>
  <NuxtLayout />
</template>
<script>
export default {
  setup () {
    useHead({
      // Title template, if titleChunk is defined in a page, it will be injected into the template
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} ∙ App Ing` : 'CUNOC ∙ Ingenieria App'
      }
    })
  }
}
</script>
<style>
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
  transform: translateX(.5rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s ease-in-out;
}

.layout-leave-to,
.layout-enter-from {
  opacity: 0;
  transform: translateX(.5rem);
  filter: blur(8px);
}
/*
Styles used for page and layout transitions - End
*/
</style>
