import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { toast } from 'vue-sonner'

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
      const loginResponse = await $api<LoginResponse>('/staff-auth/login', {
        method: 'POST',
        body: payload
      })
      // Success
      // Set cookies, user and role
      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      tokenCookie.value = loginResponse.token
      roleCookie.value = 'staff'
      // Set the user in the store
      this.user = loginResponse.staff ?? null
      // Set the authenticated flag
      this.authenticated = true
      // Set the staff roles
      this.staffRoles = loginResponse.staff?.roles ?? []
      // Set the token and role in the auth store
      const authStore = useAuthStore()
      authStore.role = 'staff'
      authStore.token = loginResponse.token ?? ''
      authStore.isAuthenticated = true
      // Redirect to the dashboard
      router.push('/admin/home')
      // Return the data and error
      this.loading = false
      return { data: { value: loginResponse }, error: false }
    },
    async myProfile() {
      this.loading = true
      const response = await $api<Staff>('/staff-auth/me')

      if (response) {
        this.user = response ?? null
      } else {
        toast.error('Error de sesión', {
          description:
            'No se ha podido recuperar tu sesión, por favor vuelve a intentar más tarde'
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
