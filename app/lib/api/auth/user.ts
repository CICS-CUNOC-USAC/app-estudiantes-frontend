export interface UserSirecaInfoResponse {
    estatus:    Estatus;
    estudiante: Estudiante;
    inscrito:   Inscrito;
}

export interface Estatus {
    codigo:  number;
    mensaje: string;
}

export interface Estudiante {
    carne:     string;
    nombres:   string;
    apellidos: string;
    completos: string;
    correo:    string;
}

export interface Inscrito {
    codigo:  string;
    carrera: string;
}

export const getUserInfoBySirecaCredentials = async (credentials: {
  ra: string
  pin: string
}) => {
  const res = await $api<UserSirecaInfoResponse>(
    '/auth/student-info',
    {
      method: 'GET',
      query: credentials
    }
  )
  return res
}
