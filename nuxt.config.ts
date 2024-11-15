// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { AuraBase } from './app/utils/themes/pThemes'

export default defineNuxtConfig({
  srcDir: 'app/',
  build: {
    transpile: ['vuetify']
  },
  imports: {
    dirs: ['stores']
  },
  runtimeConfig: {
    baseURL: process.env.BASE_URL || 'http://localhost:8000'
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://rsms.me/' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error vite-plugin-vuetify
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
  ],
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },
  primevue: {
    components: {
      prefix: 'P'
    },
    options: {
      theme: {
        preset: AuraBase,
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      }
    }
  },
  plugins: ['~/plugins/vuetify.ts'],
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    families: [
      { name: 'Geist Sans', provider: 'fontsource' },
      { name: 'Geist Mono', provider: 'fontsource' }
    ]
    // styles: ['normal', 'italic'],
  },
  googleFonts: {
    display: 'swap',
    families: {
      // 'IBM+Plex+Sans': [100, 200, 300, 400, 500, 600, 700],
      'DM Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
      // Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    }
  }
})
