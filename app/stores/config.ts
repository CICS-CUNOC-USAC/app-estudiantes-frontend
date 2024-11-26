import { updatePrimaryPalette } from '@primevue/themes'
import { defineStore } from 'pinia'
import { allThemesPrimaries } from '~/themes/pThemes'

// change to composition api

export const useConfigsStore = defineStore('config', () => {
  const theme = ref('Orange')
  const pv = usePrimeVue();

  // todo: try to make the change of the theme at app.vue level to see if it works and can eliminate the visible shift of the theme on page load/reload
  function initTheme() {
    const themeCookie = useCookie('cicsapp-theme')
    if (!themeCookie.value) {
      theme.value = 'Orange'
      themeCookie.value = 'Orange'
    } else {
      theme.value = themeCookie.value
      const selectedTheme = allThemesPrimaries.find(
        (theme) => theme.name === themeCookie.value
      )
      selectedTheme && updatePrimaryPalette(selectedTheme.values)
      pv.config.theme.preset.name = themeCookie.value
    }
  }

  function changeTheme(newTheme: string) {
    const selectedTheme = allThemesPrimaries.find(
      (theme) => theme.name === newTheme
    )
    selectedTheme && updatePrimaryPalette(selectedTheme.values)
    theme.value = newTheme
    const themeCookie = useCookie('cicsapp-theme')
    themeCookie.value = newTheme
    pv.config.theme.preset.name = newTheme
  }

  return {
    theme,
    initTheme,
    changeTheme,
  }
})
