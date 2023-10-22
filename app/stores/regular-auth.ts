import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { SnackbarType } from './snackbar'

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
  firstName: string
  lastName: string
  user: {
    email: string
    career_code: number
    ra: string
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
      // Fetch the data from the API

      const { data, error } = await useCustomFetch<LoginResponse>(
        'auth/login',
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
        this.loading = false
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
      // Show success snackbar
      useSnackbarStore().showSnackbar({
        title: 'Session iniciada',
        message: `Bienvenid@ ${this.user?.profile.first_name} ${this.user?.profile.last_name}`,
        type: SnackbarType.SUCCESS
      })
      // Return the data and error
      this.loading = false
      return { data, error: false }
    },
    async signupUser(payload: SignupPayload) {
      const { firstName, lastName, ...payloadRest } = payload
      const newPayload = {
        first_name: firstName,
        last_name: lastName,
        user: payloadRest
      }
      this.loading = true
      this.error = null
      const router = useRouter()
      // Fetch the data from the API
      const { data, error } = await useCustomFetch<LoginResponse>(
        'auth/sign-up',
        {
          method: 'POST',
          body: newPayload
        }
      )
      // Error handling
      // if (error.value?.data) {
      //   // Check if the error message is an array or just a string
      //   if (Array.isArray(error.value.data.message)) {
      //     this.error = convertArrayErrors(error.value.data.message)
      //   } else {
      //     this.error = convertError(error.value.data.message)
      //   }
      //   this.loading = false
      //   return
      // } else if (error.value?.cause) {
      //   this.loading = false
      //   this.error = convertError(error.value.message)
      //   return
      // }

      if (error.value && error.value.data) {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: convertError(error.value.data.message),
          type: SnackbarType.ERROR
        })
        this.loading = false
        return
      } else if (error.value && error.value.cause) {
        useSnackbarStore().showSnackbar({
          title: 'Error',
          message: convertError(error.value!.message),
          type: SnackbarType.ERROR
        })
        this.loading = false
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
    },
    async myProfile() {
      this.loading = true
      // const snackbarStore = useSnackbarStore()

      const { data } = await useCustomFetch<User>('auth/me')
      if (data.value) {
        this.user = data?.value
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
    async updateProfile(payload: UserUpdatePayload) {
      this.loading = true
      const router = useRouter()
      const { data, error } = await useCustomFetch<User>('auth/me', {
        method: 'PUT',
        body: payload
      })
      if (error.value) {
        console.log(error.value)
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
