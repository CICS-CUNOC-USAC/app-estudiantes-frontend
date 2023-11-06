export type Manual = {
  id: number
  name: string
  description: string
  file: null
  url: null
  created_at: Date
  updated_at: Date
}

export type ManualsAdminResponse = {
  results: Manual[]
  total: number
  limit: number
  page: number
  total_pages: number
}

type Metadata = {
  total: number
  limit: number
  page: number
  total_pages: number
}

export const useAdminManualsStore = defineStore('admin-manuals', () => {
  const loading = ref<boolean>(false)
  const manuals = ref<Manual[] | undefined>(undefined)
  const manual = ref<Manual | null>(null)
  const userAuth = useCookie('cicsapp-user-token')
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllManuals = async (params?: {
    page?: number
    limit?: number | string
    name?: string
    orderBy?: string
  }) => {
    loading.value = true

    const { data, error } = await useCustomFetch<ManualsAdminResponse>(
      '/manuals/admin',
      { params }
    )

    if (data.value) {
      const { results, ...meta } = data.value
      manuals.value = results
      responseMeta.value = meta
    }
    loading.value = false
  }

  // We'll fetch individual items in each page using nuxt's fetch hook and not functions inside stores
  const fetchManualById = async (id: number | string) => {
    loading.value = true
    const { data, error } = await useLazyFetch<Manual>(
      `${import.meta.env.VITE_API_BASE_URL}/manuals/admin/${+id}`,
      {
        headers: userAuth.value
          ? {
              Authorization: `Bearer ${userAuth.value}`,
              'Content-Type': 'application/json'
            }
          : { 'Content-Type': 'application/json' }
      }
    )
    manual.value = data.value
    loading.value = false
  }

  const updateManual = async (id: number | string, payload: Manual) => {}

  const deleteManual = async (id: number | string) => {}

  return {
    loading,
    manuals,
    manual,
    responseMeta,
    fetchAllManuals,
    fetchManualById,
    updateManual,
    deleteManual
  }
})
