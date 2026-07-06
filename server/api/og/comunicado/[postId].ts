import { buildOgImage, FALLBACK_CARD, OgCardData } from "~~/server/utils/og-renderer"

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'postId is required' })
  }

  let card: OgCardData = FALLBACK_CARD

  try {
    const { strapiUrl, strapiToken } = useRuntimeConfig()
    const targetUrl = `${strapiUrl}/api/comunicados/${postId}?populate[hero_image]=true`

    const res = await fetch(targetUrl, {
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>')
    } else {
      const json = await res.json() as {
        data: {
          title: string
          description: string
          publishedAt: string
          hero_image?: { url: string } | null
        }
      }
      const { title, description, publishedAt, hero_image } = json.data

      const formattedDate = publishedAt
        ? `Publicado el ${new Date(publishedAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}`
        : ''

      let imageUrl: string | undefined
      if (hero_image?.url) {
        try {
          const imgRes = await fetch(`${strapiUrl}${hero_image.url}`)
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer())
            const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
            imageUrl = `data:${contentType};base64,${buffer.toString('base64')}`
          }
        } catch {
          // fall back to no image if the fetch fails
        }
      }

      card = {
        title: title ?? 'Comunicado',
        subtitle: formattedDate || description || '',
        badge: 'Comunicado',
        imageUrl,
      }
    }
  } catch (err) {
    const cause = err instanceof Error && 'cause' in err ? (err as { cause?: unknown }).cause : undefined
  }

  const png = await buildOgImage(card)

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400')

  return png
})
