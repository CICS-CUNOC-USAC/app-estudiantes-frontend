import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { toast } from 'vue-sonner'
import { type FetchError } from 'ofetch'

type UserPayload = {
  email: string
  password: string
}

export type UserUpdatePayload = {
  first_name?: string
  last_name?: string
  user?: {
    email?: string
    password?: string
  }
}

export type SignupPayload = {
  first_name: string
  last_name: string
  user: {
    email: string
    career_code: number
    ra: string
    username: string
    password: string
  }
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
  career: {
    code: number
    name: string
  }
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
    error: null as any | string[] | null,
    user: null as User | null
  }),
  actions: {
    async loginUser(payload: UserPayload) {
      this.loading = true
      this.error = null
      const router = useRouter()

      const loginResponse = await $api<LoginResponse>('/auth/login', {
        method: 'POST',
        body: payload
      })

      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      tokenCookie.value = loginResponse.token
      roleCookie.value = 'regular'
      // Set the user in the store
      this.user = loginResponse.user ?? null
      this.authenticated = true
      // Set the token and role in the auth store
      const authStore = useAuthStore()
      authStore.role = 'regular'
      authStore.token = loginResponse.token ?? ''
      authStore.isAuthenticated = true
      // Redirect to the dashboard
      router.push('/dashboard/home')

      this.loading = false
      return { data: { value: loginResponse }, error: null }

    },

    async signupUser(payload: SignupPayload) {
      this.loading = true
      this.error = null
      const router = useRouter()
      try {
        const response = await $api<LoginResponse>('/auth/sign-up', {
          method: 'POST',
          body: payload
        })

        const tokenCookie = useCookie('cicsapp-user-token')
        const roleCookie = useCookie('cicsapp-roleuser')
        tokenCookie.value = response.token
        roleCookie.value = 'regular'
        // Set the user in the store
        this.user = response.user ?? null
        this.authenticated = true
        // Set the token and role in the auth store
        const authStore = useAuthStore()
        authStore.role = 'regular'
        authStore.token = response.token ?? ''
        authStore.isAuthenticated = true

        router.push('/dashboard/home')
        toast.success(
          `Bienvenid@ ${this.user?.profile.first_name} ${this.user?.profile.last_name}`
        )
      } catch (error) {
        // example of error message: {statusCode: 400, message: [{email: "Email already exists"}, {ra: "RA already exists"}], error: "Bad Request"}, we want to get all the messages and show them in the toast as description so let's map the error.data.message
        toast.error('Error al registrar usuario', {
          description: error.data?.message
            .map((m: any) => Object.values(m))
            .join(', ')
        })
      } finally {
        this.loading = false
      }
    },
    async myProfile() {
      this.loading = true
      const response = await $api<User>('/auth/me')
      if (response) {
        this.user = response
      } else {
        toast.error('Error de sesión', {
          description:
            'No se ha podido recuperar tu sesión, por favor vuelve a intentar más tarde'
        })
      }
      this.loading = false
    },
    async updateProfile(payload: UserUpdatePayload) {
      this.loading = true
      const router = useRouter()
      const { data, error } = await useCustomFetch<User>('/auth/me', {
        method: 'PUT',
        body: payload
      })
      if (error.value) {
        this.loading = false
        return
      }
      if (data.value) {
        this.myProfile()
        router.push('/dashboard/profile')
      }
      this.loading = false
    },
    clearError() {
      this.error = null
    },
    clear() {
      this.user = null
      this.authenticated = false
      this.error = null
    }
  }
})
