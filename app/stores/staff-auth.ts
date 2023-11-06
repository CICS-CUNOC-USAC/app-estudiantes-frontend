import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

type LoginPayload = {
  email: string
  password: string
}

export type Staff = {
  id: number
  first_name: string
  last_name: string
  email: string
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
    user: null as Staff | null
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
        }
        if (error.value.cause) {
          useSnackbarStore().showSnackbar({
            title: 'Error',
            message: convertError(error.value!.message),
            type: SnackbarType.ERROR
          })
        }
        /*
        Note: Set the error value to null to bypass nuxt's de-duplication (key based) mechanism
        and be able to make the request again
        */
        error.value = null
        this.loading = false
        return
      }
      // Success
      // Set cookies, user and role
      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      tokenCookie.value = data?.value?.token
      roleCookie.value = 'staff'
      // Set the user in the store
      this.user = data?.value?.staff ?? null
      this.authenticated = true
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
      try {
        const { data } = await useCustomFetch<Staff>('/staff-auth/me')
        this.user = data?.value ?? null
      } catch (error) {
        // this.error = error
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    clear() {
      this.user = null
      this.authenticated = false
      // this.error = null
    }
  }
})
