type ErrorMap = {
  [key: string]: string
}

const errorMap: ErrorMap = {
  'failed to fetch':
    'No se han podido obtener los datos, por favor intenta más tarde',
  'invalid staff credentials':
    'Credenciales inválidas, por favor verifica tus datos',
  'invalid user credentials':
    'Credenciales inválidas, por favor verifica tus datos',
  'email already exists':
    'Parece que este correo ya está registrado, por favor intenta con otro',
  'ra already exists':
    'Parece que este número de registro ya está registrado, por favor intenta con otro',
  'internal server error':
    'Ha ocurrido un error interno, por favor intenta más tarde',
  unauthorized: 'Creedenciales inválidas, por favor verifica tus datos',
  "you don't have permission to authenticate as this user. no roles assigned.":
    'No tienes permiso para autenticarte como este usuario. No se han asignado roles.'
  // Add more error messages here as needed
}

export function convertError(error: string): string {
  error = error.toLowerCase()
  const [, matchingValue] =
    Object.entries(errorMap).find(([key]) => error.includes(key)) || []

  return (
    matchingValue ||
    'Parece que este servicio no esté disponible en este momento, por favor intenta más tarde'
  )
}

type ErrorMessages = {
  [key: string]: string
}

export function convertArrayErrors(messages: ErrorMessages[]): string[] {
  const errorArray: string[] = []

  for (const message of messages) {
    const [field, error] = Object.entries(message)[0]
    errorArray.push(`${convertError(error)}`)
  }

  return errorArray
}
