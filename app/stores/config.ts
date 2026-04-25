import { defineStore } from 'pinia'
import { allThemes, defaultTheme, applyTheme } from '~/themes/themes'

export const useConfigsStore = defineStore('config', () => {
  const theme = ref(defaultTheme.name)

  function initTheme() {
    const themeCookie = useCookie('cicsapp-theme')
    if (!themeCookie.value) {
      themeCookie.value = defaultTheme.name
    } else {
      theme.value = themeCookie.value
      const selected = allThemes.find((t) => t.name === themeCookie.value)
      if (selected) applyTheme(selected)
    }
  }

  function changeTheme(newTheme: string) {
    const selected = allThemes.find((t) => t.name === newTheme)
    if (!selected) return
    applyTheme(selected)
    theme.value = newTheme
    const themeCookie = useCookie('cicsapp-theme')
    themeCookie.value = newTheme
  }

  return {
    theme,
    initTheme,
    changeTheme,
  }
})
