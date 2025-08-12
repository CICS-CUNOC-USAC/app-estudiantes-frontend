// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  routeRules: {
    '/': { ssr: false },
    '/portal/general/publicaciones': { ssr: false },
    '/portal/general/busqueda': { ssr: false }
  },
  devtools: {
    enabled: false
  },
  compatibilityDate: '2024-11-15',
  srcDir: 'app/',
  strapi: {
    version: 'v5',
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    token: process.env.STRAPI_TOKEN || undefined
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
        { rel: 'manifest', href: '/site.webmanifest' }
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
    // '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@primevue/nuxt-module',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt', // 'vue-sonner/nuxt',
    '@nuxt/content', // (_options, nuxt) => {
    //   nuxt.hooks.hook('vite:extendConfig', (config) => {
    //     // @ts-expect-error vite-plugin-vuetify
    //     config.plugins.push(vuetify({ autoImport: true }))
    //   })
    // }
    '@nuxtjs/color-mode',
    'nuxt-authorization',
    '@nuxtjs/strapi'
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'process.env.DEBUG': false
    },
    build: {
      cssMinify: false
    }

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
    importPT: { from: '@/passthrough/ptOptions.ts' },
    importTheme: { as: 'Aura', from: '@/themes/pThemes.ts' },
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
      { name: 'Inter', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
      { name: 'Bricolage Grotesque', provider: 'google' }
    ],
    experimental: {
      processCSSVariables: true
    }
  }
})
