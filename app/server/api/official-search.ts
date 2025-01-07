import { JSDOM } from 'jsdom'

export default defineEventHandler(async (event) => {
  const BASE_URL = 'http://ingenieria.cunoc.usac.edu.gt/portal/index.php'
  const query = getQuery(event)
  const siteSearch = query.search || ''

  const html = await fetch(BASE_URL + `/Buscar?ensitio=${siteSearch}`)
    .then((res) => res.text())
    .catch((err) => {
      return {}
    })
  // console.log('html: ', html)
  const doc = new JSDOM(html).window.document

  const searchResultsContainer = doc.querySelector('table.table') as HTMLTableElement
  
  if (!searchResultsContainer) return []

  const searchResults = Array.from(searchResultsContainer.querySelectorAll('tbody>tr')).map((searchResult) => {
    const searchResultTitle = searchResult.querySelector('td>a')?.textContent
    const searchResultLink = searchResult.querySelector('td>a')?.getAttribute('href')
    const searchResultCategory = searchResult.querySelector('td:nth-child(2)')?.textContent
    const internalLink = searchResultLink?.split('/')
    const searchResultPostedSince = searchResult.querySelector('td:last-child')?.textContent as string

    return {
      title: searchResultTitle,
      category: searchResultCategory,
      original_link: searchResultLink,
      internal_link: internalLink?.[3] + '/' + internalLink?.[4],
      posted_since: searchResultPostedSince
    }
  })

  return searchResults.slice(1)
  // const mainPostsContainer = doc.querySelector('#contenido')
  // if (!mainPostsContainer) return {}

  // const postsContainers = mainPostsContainer.querySelectorAll('.featurette')
  // if (!postsContainers.length) return []
  // const posts = Array.from(postsContainers).map((postContainer) => {
  //   const postTitle = postContainer.querySelector('h2')?.textContent
  //   const postDescription = postContainer
  //     .querySelector('p')
  //     ?.firstChild?.textContent?.trim()
  //   // .replace(/\n/g, '')
  //   const postLink = postContainer
  //     .querySelector('p>a')
  //     ?.getAttribute('href')
  //     ?.split('/')

  //   const postLinkFinal = postLink?.[5] + '/' + postLink?.[6]

  //   const postPostedSince = postContainer
  //     .querySelector('blockquote>footer')
  //     ?.textContent?.trim()
  //     .replace(/\n/g, '')
  //     .replace(/\t/g, '')
  //     .replace(/el/g, 'el ')

  //   return {
  //     title: postTitle,
  //     description: postDescription,
  //     link: postLinkFinal,
  //     original_link: postLink?.join('/'),
  //     posted_since: postPostedSince
  //   }
  // })
  // return posts
})
