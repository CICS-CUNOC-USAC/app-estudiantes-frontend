export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'postId is required' })
  }

  let card: OgCardData = FALLBACK_CARD

  try {
    const { strapiUrl, strapiToken } = useRuntimeConfig()
    const targetUrl = `${strapiUrl}/api/comunicados/${postId}`

    console.error(`[og/comunicado] DEBUG fetching url=${targetUrl} hasToken=${!!strapiToken}`)

    const res = await fetch(targetUrl, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>')
      console.error(`[og/comunicado] Strapi returned ${res.status} ${res.statusText} for postId=${postId} url=${targetUrl} body=${body}`)
    } else {
      const json = await res.json() as { data: { title: string; description: string; publishedAt: string } }
      const { title, description, publishedAt } = json.data

      const formattedDate = publishedAt
        ? `Publicado el ${new Date(publishedAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}`
        : ''

      card = {
        title: title ?? 'Comunicado',
        subtitle: formattedDate || description || '',
        badge: 'Comunicado',
      }
    }
  } catch (err) {
    const cause = err instanceof Error && 'cause' in err ? (err as { cause?: unknown }).cause : undefined
    console.error(`[og/comunicado] Failed to fetch from Strapi for postId=${postId}:`, err instanceof Error ? err.stack || err.message : err, cause ? `cause=${String(cause)}` : '')
  }

  const png = await buildOgImage(card)

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400')

  return png
})
