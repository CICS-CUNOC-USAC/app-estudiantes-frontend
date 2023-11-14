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
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' },
        // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"' },
        // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        // { rel: 'preconnect', href: 'https://fonts.gstatic.com' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
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
  css: [
    // 'vuetify/lib/styles/main.sass',
    // '@mdi/font/css/materialdesignicons.min.css'
  ],
  plugins: [
    // Use Vuetify as a plugin
    '~/plugins/vuetify.ts'
  ],
  googleFonts: {
    display: 'swap',
    families: {
      'IBM+Plex+Sans': [100, 200, 300, 400, 500, 600, 700]
      // Sarabun: [100, 200, 300, 400, 500, 600, 700, 800]
    }
  }
})
