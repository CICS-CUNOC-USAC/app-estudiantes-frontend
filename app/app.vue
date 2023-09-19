<template>
  <main :style="{ backgroundColor: bgColor }">
    <NuxtLayout />
  </main>
</template>
<script>
import { mapState } from 'pinia'
import { useConfigsStore } from '~/stores/config'
export default {
  setup() {
    useHead({
      // Title template, if titleChunk is defined in a page, it will be injected into the template
      titleTemplate: (titleChunk) => {
        return titleChunk
          ? `${titleChunk} ∙ Ing App CUNOC`
          : 'CUNOC ∙ Ingenieria App'
      }
    })
  },
  computed: {
    ...mapState(useConfigsStore, ['theme']),
    bgColor() {
      return this.theme === 'light' ? '#fff' : '#121212'
    }
  }
}
</script>
<style lang="scss">
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
  filter: blur(4px);
}
/*
Styles used for page and layout transitions - End
*/
@import '@/assets/styles/main.scss';
</style>
