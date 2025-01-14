import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const BASE_URL = 'http://ingenieria.cunoc.usac.edu.gt/portal/index.php'
  const query = getQuery(event)
  const page = query.page || 1

  const html = await fetch(BASE_URL + `?page=${page}`)
    .then((res) => res.text())
    .catch((err) => {
      return ''
    })
  const doc = new JSDOM(html).window.document
  const mainPostsContainer = doc.querySelector('#contenido')
  if (!mainPostsContainer) return {}

  const postsContainers = mainPostsContainer.querySelectorAll('.featurette')
  if (!postsContainers.length) return []
  const posts = Array.from(postsContainers).map((postContainer) => {
    const postTitle = postContainer.querySelector('h2')?.textContent
    const postDescription = postContainer
      .querySelector('p')
      ?.firstChild?.textContent?.trim()
    // .replace(/\n/g, '')
    const postLink = postContainer
      .querySelector('p>a')
      ?.getAttribute('href')
      ?.split('/')

    const postLinkFinal = postLink?.[5] + '/' + postLink?.[6]

    const postPostedSince = postContainer
      .querySelector('blockquote>footer')
      ?.textContent?.trim()
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/\sel/g, ' el ')
    return {
      title: postTitle,
      description: postDescription,
      link: postLinkFinal,
      original_link: postLink?.join('/'),
      posted_since: postPostedSince
    }
  })
  return posts
})
