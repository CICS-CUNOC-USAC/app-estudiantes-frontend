import type { Carrera } from './types'

export const USAC_TO_SCHEDULER: Record<number, string> = {
  58: 'SISTEMAS',
  33: 'CIVIL',
  34: 'MECANICA',
  35: 'INDUSTRIAL',
  36: 'MEC_INDUSTRIAL',
}

export function resolveCarreraId(carreras: Carrera[], userCareerCode: number): number | null {
  const codigo = USAC_TO_SCHEDULER[userCareerCode]
  if (!codigo) return null
  return carreras.find(c => c.codigo === codigo)?.id ?? null
}
