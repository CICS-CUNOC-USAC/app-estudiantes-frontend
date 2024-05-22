import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { es } from 'vuetify/locale'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as customThemes from '@/utils/themes/themes'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    blueprint: md3,
    theme: {
      themes: {
        ...customThemes
      }
    },
    defaults: {
      VBtn: {
        variant: 'tonal',
        color: 'accent-4'
      },
      VTextField: {
        variant: 'underlined'
      },
      VTextarea: {
        variant: 'underlined'
      },
      VAutocomplete: {
        variant: 'underlined'
      },
      VCard: {
        rounded: 'xl'
      },
      VChip: {
        rounded: 'lg'
      },
      VProgressLinear: {
        rounded: '2xl',
        height: 6
      },
      global: {
        // ripple: false
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    },
    locale: {
      locale: 'es',
      fallback: 'es',

      messages: { es }
    },
    ssr: true
  })

  nuxtApp.vueApp.use(vuetify)
})
