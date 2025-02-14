import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      // Load every file inside the `content` directory
      source: '**',
      // Specify the type of content in this collection
      type: 'page'
    }),
    associations: defineCollection({
      // Load every file inside the `content/associations` directory
      source: 'associations/**',
      // Specify the type of content in this collection
      type: 'page'
    }),
    extra: defineCollection({
      // Load every file inside the `content/extra` directory
      source: 'extra/**',
      // Specify the type of content in this collection
      type: 'page'
    }),
    faq: defineCollection({
      // Load every file inside the `content/faq` directory
      source: 'faq/**',
      // Specify the type of content in this collection
      type: 'page'
    }),
    help: defineCollection({
      // Load every file inside the `content/help` directory
      source: 'help/**',
      // Specify the type of content in this collection
      type: 'page'
    }),
    manuals: defineCollection({
      // Load every file inside the `content/manuals` directory
      source: 'manuals/**',
      // Specify the type of content in this collection
      type: 'page'
    }),
  }
})
