import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import { useRegularAuthStore } from './regular-auth'
import { useStaffAuthStore } from './staff-auth'

type Profile = {
  id: number
  first_name: string
  last_name: string
  created_at: Date
  updated_at: Date
}
type UserJwt = {
  id: number
  email: string
  ra: string
  profile_id: number
  created_at: Date
  updated_at: Date
  profile: Profile
  iat: number
  exp: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: '' as string | null,
    token: '' as string | null,
    isAuthenticated: false
  }),
  actions: {
    logout() {
      const router = useRouter()
      const tokenCookie = useCookie('cicsapp-user-token')
      const roleCookie = useCookie('cicsapp-roleuser')
      const regularAuthStore = useRegularAuthStore()
      const staffAuthStore = useStaffAuthStore()
      tokenCookie.value = null
      roleCookie.value = null
      // Clear the user in the respective store
      if (regularAuthStore.user?.profile_id) {
        regularAuthStore.clear()
      } else {
        staffAuthStore.clear()
      }
      this.role = null
      this.token = null
      this.isAuthenticated = false
      router.push('/')
    },
    async fetchAuth() {
      // const role = useCookie('cicsapp-roleuser')
      // this.role = role.value ?? null
      const tokenCookie = useCookie('cicsapp-user-token')
      this.token = tokenCookie.value ?? null
      if (tokenCookie.value) {
        const decoded = jwtDecode<UserJwt>(tokenCookie.value)
        this.role = decoded.profile_id ? 'regular' : 'staff'
        this.isAuthenticated = true
        if (this.role === 'staff') {
          const staffAuthStore = useStaffAuthStore()
          staffAuthStore.authenticated = true
          await staffAuthStore.myProfile()
        } else {
          const regularAuthStore = useRegularAuthStore()
          regularAuthStore.authenticated = true
          await regularAuthStore.myProfile()
        }
      }
    },
    async fetchUser() {
      try {
        const role = useCookie('cicsapp-roleuser')
        if (role.value === 'staff') {
          const staffAuthStore = useStaffAuthStore()
          await staffAuthStore.myProfile()
        } else {
          const regularAuthStore = useRegularAuthStore()
          await regularAuthStore.myProfile()
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  getters: {
    getRole: (state) => state.role,
    getToken: (state) => state.token,
    user: (state) => {
      if (state.role === 'regular') {
        const regularAuthStore = useRegularAuthStore()
        return regularAuthStore.user
      } else {
        const staffAuthStore = useStaffAuthStore()
        return staffAuthStore.user
      }
    }
  }
})
