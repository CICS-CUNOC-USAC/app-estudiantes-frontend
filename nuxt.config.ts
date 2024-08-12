// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

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
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error vite-plugin-vuetify
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@vueuse/nuxt'
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
  plugins: ['~/plugins/vuetify.ts'],
  googleFonts: {
    display: 'swap',
    families: {
      'IBM+Plex+Sans': [100, 200, 300, 400, 500, 600, 700],
      'DM Sans': [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
      // Sarabun: [100, 200, 300, 400, 500, 600, 700, 800]
    }
  }
})
