import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const BASE_URL = 'http://ingenieria.cunoc.usac.edu.gt/portal/index.php'
  const postId = getRouterParam(event, 'postId')
  const postSlug = getRouterParam(event, 'postSlug')

  const html = (await $fetch(`${BASE_URL}/${postId}/${postSlug}/`)) as string

  const doc = new JSDOM(html).window.document

  const postHeader = doc.querySelector('div#contenido')
  const postContent = doc.querySelector('.texto')

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
    .replace(/el/g, 'el ')

  return {
    title: postTitle,
    meta: postMeta,
    content: postContent?.innerHTML.trim()
  }
})
