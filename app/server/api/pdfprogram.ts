export default defineEventHandler(async (event) => {
  const BASE_URL =
    'https://administrativo.ingenieria.cunoc.edu.gt/index.php/competencias/imprimir/id/'
  const query = getQuery(event)
  const programId = query.program
  const res = await fetch(`${BASE_URL}${programId}`)
  return res
})
