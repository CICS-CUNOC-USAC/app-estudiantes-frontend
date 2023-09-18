type ErrorMap = {
  [key: string]: string
}

const errorMap: ErrorMap = {
  'failed to fetch':
    'No se han podido obtener los datos, por favor intenta más tarde',
  'invalid staff credentials':
    'Credenciales inválidas, por favor verifica tus datos',
  'invalid user credentials':
    'Credenciales inválidas, por favor verifica tus datos'
  // Add more error messages here as needed
}

export function convertError(error: string): string {
  error = error.toLowerCase()

  const [matchingKey, matchingValue] =
    Object.entries(errorMap).find(([key]) => error.includes(key)) || []

  return (
    matchingValue ||
    'Parece que este servicio no esté disponible en este momento, por favor intenta más tarde'
  )
}
