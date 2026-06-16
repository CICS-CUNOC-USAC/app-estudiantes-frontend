export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'postId is required' })
  }

  let card: OgCardData = FALLBACK_CARD

  try {
    const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337'
    const strapiToken = process.env.STRAPI_TOKEN

    const res = await fetch(`${strapiUrl}/api/comunicados/${postId}`, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
    })

    if (res.ok) {
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
  } catch {
    // use fallback card
  }

  const png = await buildOgImage(card)

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400')

  return png
})
