import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

type LoginPayload = {
  email: string
  password: string
}

export type Permission = {
  id: number
  name: string
  description: string
  action: string
  subject: string
  conditions: any
  created_at: Date
  updated_at: Date
}

export type Role = {
  id: number
  alias: string
  name: string
  description: string
  permissions: Permission[]
  created_at: Date
  updated_at: Date
}


export type Staff = {
  id: number
  first_name: string
  last_name: string
  email: string
  roles: Role[]
  created_at: Date
  updated_at: Date
}

type LoginResponse = {
  staff: Staff
  token: string
}

export const useStaffAuthStore = defineStore('staff-auth', {
  state: () => ({
    authenticated: false,
    loading: false,
    // error: null as any | {} as any | null,
    user: null as Staff | null,
    staffRoles: [] as any[]
  }),
  actions: {
    async loginStaff(payload: LoginPayload) {
      this.loading = true
      // this.error = null
      const router = useRouter()
      // Fetch the data from the API
      const { data, error } = await useCustomFetch<LoginResponse>(
        '/staff-auth/login',
        {
          method: 'POST',
          body: payload
        }
      )
      if (error.value) {
        if (error.value.data) {
          useSnackbarStore().showSnackbar({
            title: 'Error',
            message: convertError(error.value.data.message),
            type: SnackbarType.ERROR
          })
          error.value = null
          this.loading = false
          return
        }
        if (error.value.cause) {
          useSnackbarStore().showSnackbar({
            title: 'Error',
            message: convertError(error.value!.message),
            type: SnackbarType.ERROR
          })
          error.value = null
          this.loading = false
          return
        }
        /*
        Note: Set the error value to null to bypass nuxt's de-duplication (key based) mechanism
        and be able to make the request again
        */
      }
      // Success
      // Set cookies, user and role
      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      tokenCookie.value = data?.value?.token
      roleCookie.value = 'staff'
      // Set the user in the store
      this.user = data?.value?.staff ?? null
      // Set the authenticated flag
      this.authenticated = true
      // Set the staff roles
      this.staffRoles = data?.value?.staff?.roles ?? []
      // Set the token and role in the auth store
      const authStore = useAuthStore()
      authStore.role = 'staff'
      authStore.token = data?.value?.token ?? ''
      authStore.isAuthenticated = true
      // Redirect to the dashboard
      router.push('/admin/home')
      // Return the data and error
      this.loading = false
      return { data, error: false }
    },
    async myProfile() {
      this.loading = true
      const response = await $api<Staff>('/staff-auth/me')

      if (response) {
        this.user = response ?? null
      } else {
        useSnackbarStore().showSnackbar({
          title: 'Error de sesión',
          message:
            'No se ha podido recuperar tu sesión, por favor vuelve a intentar más tarde',
          type: SnackbarType.ERROR
        })
      }

      this.loading = false
    },
    clear() {
      this.user = null
      this.authenticated = false
      // this.error = null
    }
  }
})
