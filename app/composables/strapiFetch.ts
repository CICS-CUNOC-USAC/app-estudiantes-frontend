/**
 * A pre-configured `$fetch` instance for interacting with a Strapi backend.
 *
 * The `baseURL` is constructed from the environment variables:
 * - `VITE_STRAPI_URL`
 * - `VITE_STRAPI_PREFIX` (defaults to `"api"` if not set)
 *
 * On every request, if `VITE_STRAPI_TOKEN` is defined, an `Authorization`
 * header with the Bearer token will be automatically added.
 *
 * @remarks
 * Ensure that `VITE_STRAPI_URL` (and optionally `VITE_STRAPI_PREFIX` and
 * `VITE_STRAPI_TOKEN`) are set in your environment before using this instance.
 *
 * @example
 * // Fetch a list of articles
 * const articles = await $strapi('/articles');
 */
export const $strapi = $fetch.create({
  baseURL: `${import.meta.env.VITE_STRAPI_URL}/${import.meta.env.VITE_STRAPI_PREFIX || 'api'}`,
  onRequest: ({
    options
  }) => {
    const strapiToken = import.meta.env.VITE_STRAPI_TOKEN || undefined
    
    if (strapiToken) {
      options.headers.set('Authorization', `Bearer ${strapiToken}`)
    }
  },
})
