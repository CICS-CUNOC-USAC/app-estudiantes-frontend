export const fetchAllStaffs = async (params?: {}) => {
  try {
    const response = await $api<StaffsResponse>('/staffs', {
      params
    })
    const { results, ...meta } = response
    return {
      results,
      meta
    }
  } catch (error) {
    useSnackbarStore().showSnackbar({
      title: 'Error al obtener los usuarios',
      message: (error as any).data.message ?? (error as any).data.error,
      type: SnackbarType.ERROR
    })
  }
}

export const fetchStaff = async (id: string | number) => {
  const response = await $api<Staff>(`/staffs/${id}`)
  return response
}

export const createStaff = async (data: StaffPayload) => {
  const response = await $api<Staff>('/staffs', {
    method: 'POST',
    body: data
  })
  return response
}

export const updateStaff = async (id: string | number, data: StaffPayload) => {
  const response = await $api<Staff>(`/staffs/${id}`, {
    method: 'PATCH',
    body: data
  })
  return response
}
