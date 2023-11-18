import { JSDOM } from 'jsdom'
export default defineEventHandler(async (event) => {
  const BASE_URL = 'https://administrativo.ingenieria.cunoc.edu.gt'
  const query = getQuery(event)
  const search = query.search
  if (search === '') return []
  const res = await fetch(
    'https://administrativo.ingenieria.cunoc.edu.gt/index.php/cursos/buscar',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `curso=${search}&buscar=1`
    }
  )
  const html = await res.text()

  const doc = new JSDOM(html).window.document
  const test = doc.querySelectorAll(
    'table.table-condensed tr:not(:first-child)'
  )
  const elsArr = Array.from(test).map((el) => {
    // Get all tds from tr element
    const tds = el.querySelectorAll('td')
    // Get pdfLink from last td
    let pdfLink = tds[5]
      .querySelector('input')
      ?.getAttribute('onclick')
      ?.split('=')[1]
    // Remove single quotes and semicolon from pdfLink with regex
    pdfLink = pdfLink?.replace(/'/g, '').replace(/;/g, '')
    pdfLink = `${BASE_URL}${pdfLink}`
    // Get the pdf id from pdfLink, spliting the string by '/' and getting the last element
    const pdfId = pdfLink?.split('/').pop()
    // Get text content from tds
    const texts = Array.from(tds).map((td) => td.textContent)
    // Destructure texts
    const [name, teacher, section, semester, year] = texts
    // Remove spaces and '\t' from semester
    const newSemester = semester?.replace(/\t/g, '').trim()
    // Return object
    return {
      id: pdfId,
      name,
      teacher,
      section,
      semester: newSemester,
      year,
      pdfLink
    }
  })

  // Return converted array with custom objects
  return elsArr
})
