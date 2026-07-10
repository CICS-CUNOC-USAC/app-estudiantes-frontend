import { defineStore } from 'pinia'
import {
  getConfig,
  saveConfig as apiSaveConfig,
  getEstado,
  ejecutar,
  getHistorial,
} from '~/lib/api/schedules-generator/algoritmo'
import type {
  AlgoritmoConfig,
  AlgoritmoEstado,
  HistorialRow,
  EjecutarBody,
  WsEvent,
} from '~/lib/api/schedules-generator/types'

export const useAlgorithmRunnerStore = defineStore('algorithm-runner', {
  state: () => ({
    config:      null as AlgoritmoConfig | null,
    estado:      null as AlgoritmoEstado | null,
    historial:   [] as HistorialRow[],
    wsLog:       [] as string[],
    loading:     false,
    saving:      false,
    error:       null as string | null,
    saveSuccess: false,
  }),

  actions: {
    async fetchConfig() {
      this.loading = true
      this.error = null
      try { this.config = await getConfig() }
      catch { this.error = 'No se pudo cargar la configuración.' }
      finally { this.loading = false }
    },

    async saveConfig(body: Partial<AlgoritmoConfig>) {
      this.saving = true
      this.error = null
      this.saveSuccess = false
      try {
        this.config = await apiSaveConfig(body)
        this.saveSuccess = true
      }
      catch { this.error = 'Error al guardar configuración.' }
      finally { this.saving = false }
    },

    async fetchEstado() {
      try { this.estado = await getEstado() }
      catch { /* silencioso */ }
    },

    async fetchHistorial(id: number) {
      try { this.historial = await getHistorial(id) }
      catch { this.historial = [] }
    },

    applyWsEvent(event: WsEvent) {
      const ts = new Date().toLocaleTimeString('es', { hour12: false })
      if (event.type === 'progreso') {
        const p = event.payload
        if (!this.estado) {
          this.estado = { corriendo: true, generacion: 0, mejorAptitud: null, conflictos: null, horarioId: null, error: null }
        }
        this.estado.corriendo    = true
        this.estado.generacion   = p.generacion
        this.estado.mejorAptitud = p.mejorAptitud
        this.estado.conflictos   = p.conflictos
        this.historial.push({ generacion: p.generacion, mejor_aptitud: p.mejorAptitud, conflictos: p.conflictos })
        this.wsLog.push(`[${ts}] [progreso] gen:${p.generacion} apt:${p.mejorAptitud.toFixed(2)}%`)
      }
      else if (event.type === 'estado') {
        this.estado = event.payload
        this.wsLog.push(`[${ts}] [estado] corriendo:${event.payload.corriendo}`)
      }
      else if (event.type === 'finalizado') {
        if (this.estado) {
          this.estado.corriendo  = false
          this.estado.horarioId  = event.payload.horarioId
        }
        this.wsLog.push(`[${ts}] [finalizado] horarioId:${event.payload.horarioId}`)
      }
      else if (event.type === 'error') {
        if (this.estado) {
          this.estado.corriendo = false
          this.estado.error     = event.payload.message
        }
        this.wsLog.push(`[${ts}] [error] ${event.payload.message}`)
      }
      else if (event.type === 'connected') {
        this.wsLog.push(`[${ts}] [connected] ${event.payload.message}`)
      }
      if (this.wsLog.length > 50) this.wsLog.splice(0, this.wsLog.length - 50)
    },
  },

  getters: {
    isRunning:        (s) => s.estado?.corriendo ?? false,
    currentHorarioId: (s) => s.estado?.horarioId ?? null,
    chartPoints:      (s) => s.historial.map(r => ({ x: r.generacion, y: r.mejor_aptitud })),
  },
})
