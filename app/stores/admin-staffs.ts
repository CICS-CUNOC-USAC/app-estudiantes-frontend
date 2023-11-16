import type { Role } from './staff-auth'
import type { Metadata } from '~/utils/types/fetching'

export type StaffsResponse = {
  results: Staff[]
  total: number
  limit: number
  page: number
  total_pages: number
}

export type StaffPayload = {
  id?: number
  last_name: string
  first_name: string
  email: string
  password: string
}

export const useAdminStaffsStore = defineStore('admin-staffs', () => {
  const loading = ref<boolean>(false)
  const staffs = ref<Staff[] | undefined>(undefined)
  const staff = ref<Staff | null>(null)
  const roles = ref<Role[] | undefined>(undefined)
  const responseMeta = ref<Metadata | null>(null)

  const fetchAllStaffs = async (params?: {}) => {
    loading.value = true
    try {
      const response = await $api<StaffsResponse>('/staffs', {
        params
      })
      if (response) {
        const { results, ...meta } = response
        staffs.value = results
        responseMeta.value = meta
      }
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los usuarios',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    } finally {
      loading.value = false
    }
  }

  const createStaff = async (staff: StaffPayload) => {
    try {
      const response = await $api<Staff>('/staffs', {
        method: 'POST',
        body: staff
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al crear el usuario',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    }
  }

  const updateStaffById = async (staffId: number, staff: StaffPayload) => {
    try {
      const response = await $api<Staff>(`/staffs/${staffId}`, {
        method: 'PATCH',
        body: staff
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al actualizar el usuario',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    }
  }

  // TODO: Refactor later: All Roles related actions should be another store
  const fetchAllRoles = async () => {
    try {
      const response = await $api<Role[]>('/roles')
      if (response) {
        roles.value = response
      }
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los roles',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    }
  }

  const updateStaffRoles = async (staffId: number, roles: number[]) => {
    try {
      const response = await $api<Role[]>(`/staffs/${staffId}/roles`, {
        method: 'PATCH',
        body: {
          rolesIds: roles
        }
      })
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los roles',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    }
  }

  const fetchAllStaffRoles = async (staffId: number) => {
    try {
      const response = await $api<Role[]>(`/staffs/${staffId}/roles`)
      return response
    } catch (error) {
      useSnackbarStore().showSnackbar({
        title: 'Error al obtener los roles',
        message: (error as any).data.message ?? (error as any).data.error,
        type: SnackbarType.ERROR
      })
    }
  }

  return {
    loading,
    staffs,
    staff,
    roles,
    responseMeta,
    fetchAllStaffs,
    createStaff,
    updateStaffById,
    updateStaffRoles,
    fetchAllStaffRoles,
    fetchAllRoles
  }
})
