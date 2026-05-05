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
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    'nuxt-authorization',
    '@nuxtjs/strapi',
    'shadcn-nuxt'
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
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
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
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    families: [
      { name: 'Geist', provider: 'google' },
      { name: 'Stack Sans Notch', provider: 'google' },
      { name: 'Stack Sans Headline', provider: 'google' },
      { name: 'Stack Sans Text', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
      { name: 'Bricolage Grotesque', provider: 'google' }
    ],
    experimental: {
      processCSSVariables: true
    }
  }
})
