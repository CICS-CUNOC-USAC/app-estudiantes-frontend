export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')
  const postSlug = getRouterParam(event, 'postSlug')

  if (!postId || !postSlug) {
    throw createError({ statusCode: 400, statusMessage: 'postId and postSlug are required' })
  }

  let card: OgCardData = FALLBACK_CARD

  try {
    const postData = await $fetch<{ title?: string; meta?: string }>(`/api/official-post-detail/${postId}/${postSlug}`)

    card = {
      title: postData.title ?? 'Publicación oficial',
      subtitle: postData.meta ?? '',
      badge: 'Publicación Oficial',
    }
  } catch {
    // use fallback card
  }

  const png = await buildOgImage(card)

  setResponseHeader(event, 'Content-Type', 'image/png')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400')

  return png
})
