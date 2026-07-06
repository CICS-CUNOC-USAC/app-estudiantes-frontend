import type { AlgoritmoConfig, AlgoritmoEstado, HistorialRow, EjecutarBody } from './types'

export const getConfig = () =>
  $apiSchedules<AlgoritmoConfig>('/api/algoritmo/configuracion')

export const saveConfig = (body: Partial<AlgoritmoConfig>) =>
  $apiSchedules<AlgoritmoConfig>('/api/algoritmo/configuracion', { method: 'PUT', body })

export const getEstado = () =>
  $apiSchedules<AlgoritmoEstado>('/api/algoritmo/estado')

export const ejecutar = (body: EjecutarBody) =>
  $apiSchedules('/api/algoritmo/ejecutar', { method: 'POST', body })

export const getHistorial = (id: number) =>
  $apiSchedules<HistorialRow[]>(`/api/algoritmo/historial/${id}`)
