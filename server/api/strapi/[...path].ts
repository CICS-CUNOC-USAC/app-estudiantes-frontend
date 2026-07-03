export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const path = getRouterParam(event, 'path')
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'path is required' })
  }

  const { baseURL: appBaseUrl, strapiUrl, strapiToken, strapiPrefix } = useRuntimeConfig()
  const queryString = getRequestURL(event).search
  const targetUrl = `${appBaseUrl}/${strapiUrl}/${strapiPrefix}/${path}${queryString}`

  const res = await fetch(targetUrl, {
    headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {},
  })

  const body = await res.text()

  setResponseStatus(event, res.status)
  const contentType = res.headers.get('content-type')
  if (contentType) {
    setResponseHeader(event, 'content-type', contentType)
  }

  return body
})
