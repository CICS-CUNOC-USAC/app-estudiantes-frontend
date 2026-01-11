import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const BASE_URL = 'http://ingenieria.cunoc.usac.edu.gt/portal/index.php'
  const postId = getRouterParam(event, 'postId')
  const postSlug = getRouterParam(event, 'postSlug')

  // const html = (await $fetch(`${BASE_URL}/${postId}/${postSlug}/`)) as string
  const response = await fetch(`${BASE_URL}/${postId}/${postSlug}/`)

  if (!response.ok) {
    console.log('response.status', response.status)
    if (response.status === 500) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error or Service Unavailable',
      })
    }
    if (response.status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    }
  }
  const html = await response.text()

  const doc = new JSDOM(html).window.document

  const postHeader = doc.querySelector('div#contenido')
  const postContent = doc.querySelector('.texto')
  const postAttachmentsEls = doc.querySelectorAll('.archivos a')


  const linksWithImages = postContent?.querySelectorAll('.imgart>a')
  linksWithImages?.forEach((link) => {
    link.setAttribute('href', `#`)
  })

  // also, select all img's and change the src to the full url: http://ingenieria.cunoc.usac.edu.gt/portal/carpetas/imagenes/
  // if it contains 'articulos', it should be http://ingenieria.cunoc.usac.edu.gt/portal/articulos/...
  const images = postContent?.querySelectorAll('img')
  images?.forEach((img) => {
    const src = img.getAttribute('src')

    if (src) {
      if (src.includes('articulos')) {
        const newSrc = `http://ingenieria.cunoc.usac.edu.gt${src}`
        // img.setAttribute('src', `http://ingenieria.cunoc.usac.edu.gt${src}`)
        // example: https://wsrv.nl/?url=http://ingenieria.cunoc.usac.edu.gt/portal/carpetas/imagenes/vac_asignado.jpg
        img.setAttribute('src', `https://wsrv.nl/?url=${newSrc}`)
      } else {
        const newSrc = `${BASE_URL}/carpetas/imagenes/${src}`
        // img.setAttribute('src', `${BASE_URL}/carpetas/imagenes/${src}`)
        img.setAttribute('src', `https://wsrv.nl/?url=${newSrc}`)
      }
    }
  })

  // Wrap all iframes in a div with loading info
    const iframes = postContent?.querySelectorAll('iframe')
    iframes?.forEach((iframe) => {
      const wrapper = doc.createElement('div')
      wrapper.className = 'holds-the-iframe'
      
      // Clone the iframe to preserve all its attributes
      const iframeClone = iframe.cloneNode(true) as HTMLIFrameElement
      
      // Replace the iframe with the wrapper
      iframe.parentNode?.replaceChild(wrapper, iframe)
      
      // Add the iframe inside the wrapper
      wrapper.appendChild(iframeClone)
    })

  //finally, delete all the <a> tags that have the attribute 'data-gallery' because they are not needed
  // const links = postContent?.querySelectorAll('a')
  // links?.forEach((link) => {
  //   const dataGallery = link.getAttribute('data-gallery')
  //   if (dataGallery) {
  //     link.remove()
  //   }
  // })


  const postTitle = postHeader?.querySelector('h2')?.textContent
  const postMeta = postHeader
    ?.querySelector('blockquote>footer')
    ?.textContent?.trim()
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    // .replace(/\sel/g, ' el ')
  const attachments = Array.from(postAttachmentsEls).map((attachment) => {
    return {
      title: attachment.textContent?.trim()
      .replace(/\n/g, '')
      .replace(/\t/g, ''),
      url: `${import.meta.env.VITE_ATTACHEMENTS_BASE_URL}${attachment.getAttribute('href')}`
    }
  })

  return {
    title: postTitle,
    meta: postMeta,
    content: postContent?.innerHTML.trim(),
    attachments
  }
})
