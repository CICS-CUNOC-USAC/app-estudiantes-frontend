// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Aura from '@primevue/themes/aura'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: {
    enabled: false
  },
  compatibilityDate: '2024-11-15',
  srcDir: 'app/',
  // build: {
  //   transpile: ['vuetify']
  // },
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      meta: [
        {
          name: 'theme-color',
          content: '#ffffff',
          media: '(prefers-color-scheme: light)'
        },
        {
          name: 'theme-color',
          content: '#262626',
          media: '(prefers-color-scheme: dark)'
        }
      ]
    }
  },
  modules: [
    '@pinia/nuxt', // '@nuxtjs/tailwindcss',
    '@pinia/colada-nuxt',
    '@primevue/nuxt-module',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    '@nuxt/content', // 'vue-sonner/nuxt',
    // (_options, nuxt) => {
    //   nuxt.hooks.hook('vite:extendConfig', (config) => {
    //     // @ts-expect-error vite-plugin-vuetify
    //     config.plugins.push(vuetify({ autoImport: true }))
    //   })
    // }
    '@nuxtjs/color-mode',
    'nuxt-authorization'
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'process.env.DEBUG': false
    },
    build: {
      cssMinify: false
    },
    

    // vue: {
    //   template: {
    //     transformAssetUrls
    //   }
    // }
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    classPrefix: '',
    classSuffix: '',
    preference: 'system'
  },
  postcss: {
    plugins: {
      cssnano: {
        preset: ['cssnano-preset-default', { calc: false }]
      }
    }
  },
  primevue: {
    composables: {
      exclude: ['useToast']
    },
    directives: {
      prefix: 'P'
    },
    components: {
      prefix: 'P'
    },
    importTheme: { from: '@/themes/pThemes.ts' },
    options: {
      theme: {
        options: {
          // darkModeSelector: '.app-darkmode',
          // preset: Aura,
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      }
    }
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Mona Sans', provider: 'google' },
      { name: 'Hubot Sans', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
      { name: 'General Sans', provider: 'fontshare' }
    ],
    experimental: {
      processCSSVariables: true
    }
  }
})
