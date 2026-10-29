export const OFFICIAL_PORTAL_HOST = 'ingenieria.cunoc.usac.edu.gt'

/**
 * Builds the url of our own image proxy for an image hosted on the official portal.
 * It includes the app's baseURL (e.g. /estudiantes) since the browser resolves it
 * against the origin, not against Nuxt.
 */
export function proxiedOfficialImage(url: string) {
  const { baseURL } = useRuntimeConfig().app
  const base = baseURL.replace(/\/+$/, '')
  return `${base}/api/official-image?url=${encodeURIComponent(url)}`
}
