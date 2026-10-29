export const OFFICIAL_PORTAL_HOST = 'ingenieria.cunoc.usac.edu.gt'

/** Builds the url of our own image proxy for an image hosted on the official portal. */
export function proxiedOfficialImage(url: string) {
  return `/api/official-image?url=${encodeURIComponent(url)}`
}
