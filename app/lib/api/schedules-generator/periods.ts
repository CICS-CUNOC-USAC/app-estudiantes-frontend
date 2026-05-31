import { toast } from 'vue-sonner'

export interface Period {
  id: number
  numero: number
  hora_inicio: string
  hora_fin: string
  es_manana: boolean
  es_tarde: boolean
}

export const fetchPeriods = async () => {
  try {
    return await $apiSchedules<Period[]>('/api/periodos')
  }
  catch (error) {
    toast.error('Error al obtener períodos', {
      description: (error as any).data?.message ?? (error as any).data?.error,
    })
    return undefined
  }
}
