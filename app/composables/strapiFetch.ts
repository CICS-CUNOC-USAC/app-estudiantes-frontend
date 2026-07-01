/**
 * A pre-configured `$fetch` instance for interacting with the Strapi backend.
 *
 * Requests are routed through the `/api/strapi/[...path]` Nuxt server proxy
 * rather than calling Strapi directly, so the Strapi API token stays server-side
 * and is never exposed to the client.
 *
 * @example
 * // Fetch a list of articles
 * const articles = await $strapi('/articles');
 */
export const $strapi = $fetch.create({
  baseURL: '/api/strapi',
})
