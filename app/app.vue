<template>
  <main :style="{ backgroundColor: bgColor }">
    <NuxtLoadingIndicator :throttle="130" :height="4" :color="loadingColor" />
    <NuxtLayout />
  </main>
</template>
<script lang="ts">
import { useTheme } from 'vuetify/lib/framework.mjs'
import { useConfigsStore } from '~/stores/config'
export default {
  setup() {
    const vTheme = useTheme()
    const { theme } = storeToRefs(useConfigsStore())
    const currentTheme = computed(() => {
      return vTheme.computedThemes.value[theme.value]
    })
    vTheme.global.name.value = currentTheme.value.dark ? 'dark' : 'light'
    useHead({
      // Title template, if titleChunk is defined in a page, it will be injected into the template
      titleTemplate: (titleChunk) => {
        return titleChunk
          ? `${titleChunk} ∙ Ing App CUNOC`
          : 'CUNOC ∙ Ingenieria App'
      }
    })
    const bgColor = computed(() => {
      return currentTheme.value.dark ? '#121212' : '#fff'
    })
    const loadingColor = computed(() => {
      return currentTheme.value.dark ? '#fff' : '#121212'
    })
    return {
      theme,
      bgColor,
      loadingColor
    }
  },
  computed: {
    // ...mapState(useConfigsStore, ['theme']),
    // bgColor() {
    //   return this.theme === 'light' ? '#fff' : '#121212'
    // },
    // loadingColor() {
    //   return this.theme === 'light' ? '#121212' : '#fff'
    // }
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
}
/*
Styles used for page and layout transitions - End
*/
@import '@/assets/styles/main.scss';
</style>
