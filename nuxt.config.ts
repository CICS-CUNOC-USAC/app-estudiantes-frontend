// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify']
  },
  modules: [
    '@pinia/nuxt'
  ],
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  plugins: [
    // Use Vuetify as a plugin
    '~/plugins/vuetify.ts'
  ]
})
