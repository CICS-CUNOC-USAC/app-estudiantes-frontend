import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

type UserPayload = {
  email: string
  password: string
}

export type Profile = {
  id: number
  first_name: string
  last_name: string
  created_at: Date
  updated_at: Date
}

export type User = {
  id: number
  email: string
  ra: string
  profile_id: number
  created_at: Date
  updated_at: Date
  profile: Profile
}

export type LoginResponse = {
  user: User
  token: string
}

export const useRegularAuthStore = defineStore('regular-auth', {
  state: () => ({
    authenticated: false,
    loading: false,
    error: null as any | null,
    user: null as User | null
  }),
  actions: {
    async loginUser(payload: UserPayload) {
      this.loading = true
      this.error = null
      const router = useRouter()
      // Fetch the data from the API
      const { data, error } = await useCustomFetch<LoginResponse>(
        'auth/login',
        {
          method: 'POST',
          body: payload
        }
      )
      // Error handling
      if (error.value?.data) {
        this.error = convertError(error.value.data.message)
        this.loading = false
        return
      } else if (error.value?.cause) {
        this.loading = false
        this.error = convertError(error.value.message)
        return
      }
      // Success
      // Set cookies, user and role
      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      tokenCookie.value = data?.value?.token
      roleCookie.value = 'regular'
      // Set the user in the store
      this.user = data?.value?.user ?? null
      this.authenticated = true
      // Set the token and role in the auth store
      const authStore = useAuthStore()
      authStore.role = 'regular'
      authStore.token = data?.value?.token ?? ''
      authStore.isAuthenticated = true
      // Redirect to the dashboard
      router.push('/dashboard/home')
      // Return the data and error
      this.loading = false
      return { data, error: false }
    },
    async myProfile() {
      this.loading = true
      const { data } = await useCustomFetch<User>('auth/me')
      if (data.value) {
        this.user = data?.value
      }
      this.loading = false
    },
    clear() {
      this.user = null
      this.authenticated = false
      this.error = null
    }
  }
})
