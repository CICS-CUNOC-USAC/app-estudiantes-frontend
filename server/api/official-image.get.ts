const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  if (typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url' })
  }

  let target: URL
  try {
    target = new URL(url)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid url' })
  }

  // only proxy images of the official portal, never an arbitrary host
  if (
    !['http:', 'https:'].includes(target.protocol) ||
    target.hostname !== OFFICIAL_PORTAL_HOST
  ) {
    throw createError({ statusCode: 403, statusMessage: 'Host not allowed' })
  }

  const res = await fetch(target, {
    redirect: 'error',
    signal: AbortSignal.timeout(15000)
  }).catch(() => {
    throw createError({ statusCode: 502, statusMessage: 'Bad Gateway' })
  })

  if (!res.ok) {
    throw createError({
      statusCode: res.status === 404 ? 404 : 502,
      statusMessage: res.status === 404 ? 'Not Found' : 'Bad Gateway'
    })
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) {
    throw createError({ statusCode: 415, statusMessage: 'Not an image' })
  }

  const image = Buffer.from(await res.arrayBuffer())
  if (image.length > MAX_IMAGE_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Image too large' })
  }

  setResponseHeaders(event, {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
  })
  return image
})
