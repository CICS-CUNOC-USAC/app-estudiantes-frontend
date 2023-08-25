import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    defaults: {
      global: {
        ripple: false
      }
    },
    ssr: true,
    components,
    directives
  })

  nuxtApp.vueApp.use(vuetify)
})
