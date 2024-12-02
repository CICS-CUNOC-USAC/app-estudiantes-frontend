// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: {
    enabled: false
  },
  compatibilityDate: '2024-11-15',
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
        // favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://rsms.me/' },
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' }
      ],
      meta: [
        { name: 'theme-color', content: '#faf6ed', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#262626', media: '(prefers-color-scheme: dark)' }
      ]
    },
    // pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    '@nuxt/content',
    // 'vue-sonner/nuxt',
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
    composables: {
      exclude: ['useToast']
    },
    directives: {
      prefix: 'P',
    },
    components: {
      prefix: 'P'
    },
    importTheme: { from: '@/themes/pThemes.ts' },
    options: {
      theme: {
        // preset: AuraBase,
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      }
    }
  },
  // plugins: ['~/plugins/vuetify.ts'],
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    families: [
      { name: 'Geist Sans', provider: 'fontsource' },
      { name: 'Mona Sans', provider: 'google' },
      { name: 'Hubot Sans', provider: 'google' },
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
