import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    blueprint: md3,
    defaults: {
      VBtn: {
        variant: 'tonal',
        color: 'orange-accent-4'
      },
      VTextField: {
        variant: 'underlined'
      },
      VCard: {
        rounded: 'xl'
      },
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
