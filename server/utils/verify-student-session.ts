import jwt from 'jsonwebtoken'
import { getHeader, createError, type H3Event } from 'h3'

interface StudentTokenPayload {
  id: number
  profile_id: number
  email: string
  username: string
}


export function verifyStudentSession(event: H3Event): StudentTokenPayload {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado' })
  }

  try {
    const config = useRuntimeConfig()
    const payload = jwt.verify(token, config.jwtKey) as StudentTokenPayload

    if (!payload.profile_id) {
      throw createError({ statusCode: 401, statusMessage: 'Token inválido' })
    }
    return payload
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Sesión inválida o expirada' })
  }
}