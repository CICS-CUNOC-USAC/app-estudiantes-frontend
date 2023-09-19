import { defineStore } from 'pinia'

export const useConfigsStore = defineStore('configs', {
  state: () => ({
    theme: 'light',
    themeBoolean: false
  }),
  actions: {
    initTheme() {
      // Here we use cookies to persist the theme
      const themeCookie = useCookie('cicsapp-theme')
      if (!themeCookie.value) {
        // If there's no cookie, we set the theme to the default
        this.theme = 'light'
        this.themeBoolean = false
        themeCookie.value = 'light'
      } else {
        // Otherwise we set the theme to the cookie value
        this.theme = themeCookie.value
        this.themeBoolean = themeCookie.value === 'dark'
      }
    },
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      const themeCookie = useCookie('cicsapp-theme')
      themeCookie.value = this.theme
    }
  }
})
